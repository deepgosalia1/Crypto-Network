const Transaction = require('./transaction');

class TransactionPool{
    constructor(){
        this.transactionMap = {};
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    clear(){
        this.transactionMap = {};
    }

    setMap(transactionPoolMap){
        this.transactionMap = transactionPoolMap;
    }

    existingTransaction({ inputAddress }) {
         // this function is to check if a transaction is already existing in 
        // the current pool with the same senderAddress.
        const transactions = Object.values(this.transactionMap);
    
        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions(){
        return Object.values(this.transactionMap).filter(transaction=>Transaction.validTransaction(transaction));
    }
    
    clearBlockchainTransactions({chain}){
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            for (let transaction of block.data){
                console.log('of wala txn here', transaction);
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
            
        }
    }
}

module.exports = TransactionPool;