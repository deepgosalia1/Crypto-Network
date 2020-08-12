const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser')
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transactionPool');
const Wallet = require('./wallet')
const TransactionMiner = require('./app/transactionMiner');
const DEFAUT_PORT = 3000;
const path = require('path')
const isDevelopment = process.env.ENV === 'development';
const REDIS_URL = isDevelopment ? 'redis://127.0.0.1:6379' : 'your redis-url-here'
const RNA = `http://localhost:${DEFAUT_PORT}` //Root Node Address
const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl:REDIS_URL })
const transactionMiner = new TransactionMiner({ pubsub, wallet, transactionPool, blockchain });



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
})

app.get('/api/t_pool_map', (req, res) => {
    res.json(transactionPool.transactionMap);
})

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks')
})

app.get('/api/wallet-info', (req, res) => {
    address = wallet.publicKey;
    res.json({ address, balance: Wallet.calculateBalance({ chain: blockchain.chain, address }) })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
})

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ newData: data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks')
})

app.post('/api/transact', (req, res) => {
    const { amountToBePaid, recipient } = req.body;

    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, nextAmountToBePaid: amountToBePaid });
        } else {
            transaction = wallet.createTransaction({
                recipient,
                amountToBePaid,
                chain: blockchain.chain
            });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    console.log('trnasactoin pool', transactionPool);
    res.json({ type: 'success', transaction })
})

const syncChain = () => {
    request({ url: `${RNA}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('Syncing with the root chain...', rootChain);
            blockchain.replaceChain(rootChain);
        }
    })

    request({ url: `${RNA}/api/t_pool_map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionMap = JSON.parse(body);
            console.log('Syncing with the root transaction pool...', rootTransactionMap);
            transactionPool.setMap(rootTransactionMap);
        }
    })
}

if (isDevelopment) {
    // helper methods to mine temporary transactions
    const walletFoo = new Wallet();
    const walletBar = new Wallet();

    const generateWalletTransaction = ({ wallet, recipient, amountToBePaid }) => {
        const transaction = wallet.createTransaction({ recipient, amountToBePaid, chain: blockchain.chain })
        transactionPool.setTransaction(transaction);
    }

    const walletAction = () => {
        generateWalletTransaction({
            wallet, recipient: walletFoo.publicKey, amountToBePaid: 5
        })
    }

    const walletFooAction = () => {
        generateWalletTransaction({
            wallet: walletFoo, recipient: walletBar.publicKey, amountToBePaid: 10
        })
    }
    const walletBarAction = () => {
        generateWalletTransaction({
            wallet: walletBar, recipient: wallet.publicKey, amountToBePaid: 15
        })
    }

    for (let i = 0; i < 10; i++) {
        if (i % 3 === 0) {
            walletAction();
            walletFooAction();
        } else if (i % 3 === 1) {
            walletAction();
            walletBarAction();
        } else {
            walletFooAction();
            walletBarAction();
        }
        transactionMiner.mineTransactions();
    }

}

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAUT_PORT + Math.ceil(Math.random() * 1500)
}
const PORT = process.env.PORT || PEER_PORT || DEFAUT_PORT;

app.listen(PORT, () => {
    console.log(`Listening at localhost:${PORT}`)
    if (PORT !== DEFAUT_PORT) syncChain();
})