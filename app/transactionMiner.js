const Transaction = require("../wallet/transaction");

class TransactionMiner{
    constructor({blockchain, transactionPool, wallet, pubsub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }
    mineTransactions(){
        // main goal of this class is to achieve thses 5 steps:
        
        // 1. get the t_pools valid transactions
        const validTransactions = this.transactionPool.validTransactions();
        
        // 2. generate miner's reward
        validTransactions.push(Transaction.rewardTransaction({minerWallet:this.wallet}));
        
        // 3. add a block consisting of these transaction data
        this.blockchain.addBlock({newData:validTransactions})

        // 4. broadcast the updated blockchain
        this.pubsub.broadcastChain();

        // 5. clear the pool
        this.transactionPool.clear()
        
    }


}

module.exports = TransactionMiner;