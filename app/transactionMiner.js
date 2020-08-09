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
        // 2. generate miner's reward
        // 3. add a block consisting of these transaction data
        // 4. broadcast the updated blockchain
        // 5. clear the pool
        
    }


}

module.exports = TransactionMiner;