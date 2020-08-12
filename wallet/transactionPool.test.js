const Transaction = require('./transaction');
const TransactionPool = require('./transactionPool');
const Blockchain = require('../blockchain');
const Wallet = require('./index');

describe('Transaction Pool Testing', ()=>{
    let transactionPool, transaction, senderWallet;
    beforeEach(()=>{
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({senderWallet, recipient:'A-new-Recipient', amountToBePaid:50});
    });

    describe('setTransTests',()=>{
        it('adds a transaction',()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction)
        })
    })

    describe('existingTransaction',()=>{
        it('checks for transaction',()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress:senderWallet.publicKey})).toBe(transaction)
        })
    })

    describe('setTransTests',()=>{
        let validTxn;
        beforeEach(()=>{
            validTxn = [];
            for (let i = 0; i < 10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient:'anyone',
                    amountToBePaid:50
                })

                if (i%3 === 0){
                    transaction.input.balance = 9;
                } else if( i%3 === 1){
                    transaction.input.signature = new Wallet().sign('Nope.')
                } else{
                    validTxn.push(transaction)
                }
                transactionPool.setTransaction(transaction)
            }
        })

        it('return valid txn only',()=>{
            expect(transactionPool.validTransactions()).toEqual(validTxn);
        })
    })

    describe('Clear() method',()=>{
        it('',()=>{
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        })
        
    })

    describe('Clear the already included transactions in the new synced blockchain from the local txn pool',()=>{
        it('clearBlockchainTransactions()',()=>{
            const expectedtxnMap = {}
            const blockchain = new Blockchain();
            for (let i = 0; i < 6; i++) {
                const transaction = new Wallet().createTransaction({amountToBePaid:50, recipient:'foooo'});
                transactionPool.setTransaction(transaction);
                if(i%2===0){
                    blockchain.addBlock({newData:[transaction]});
                } else{
                    expectedtxnMap[transaction.id] = transaction;
                }
            }
            transactionPool.clearBlockchainTransactions({chain:blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedtxnMap);
        })
    })
})