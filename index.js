const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser')
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transactionPool');
const Wallet = require('./wallet')
const DEFAUT_PORT = 3000;
 
const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool})

const RNA = `http://localhost:${DEFAUT_PORT}` //Root Node Address

app.use(bodyParser.json());

app.get('/api/blocks', (req, res)=>{
    res.json(blockchain.chain);
})

app.get('/api/t_pool_map', (req, res)=>{
    res.json(transactionPool.transactionMap);
})

app.post('/api/mine', (req, res)=>{
    const {data} = req.body;
    blockchain.addBlock({newData:data});
    pubsub.broadcastChain();
    res.redirect('/api/blocks')
})

app.post('/api/transact',(req,res)=>{
    const { amountToBePaid, recipient } = req.body;

    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
        transaction.update({ senderWallet: wallet, recipient, nextAmountToBePaid:amountToBePaid });
        } else {
        transaction = wallet.createTransaction({
            recipient,
            amountToBePaid,
        });
        }
    } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    console.log('trnasactoin pool', transactionPool);
    res.json({transaction})
})

const syncChain = () => {
    request({url:`${RNA}/api/blocks`},(error, response, body)=>{
        if (!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('Syncing with the root chain...', rootChain);
            blockchain.replaceChain(rootChain);
        }
    })  

    request({url:`${RNA}/api/t_pool_map`},(error, response, body)=>{
        if (!error && response.statusCode === 200){
            const rootTransactionMap = JSON.parse(body);
            console.log('Syncing with the root transaction pool...', rootTransactionMap);
            transactionPool.setMap(rootTransactionMap);
        }
    })  
}
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAUT_PORT + Math.ceil(Math.random() * 1500)
}
const PORT = PEER_PORT || DEFAUT_PORT;

app.listen(PORT, ()=>{
    console.log(`Listening at localhost:${PORT}`)
    if (PORT !== DEFAUT_PORT ) syncChain();
})