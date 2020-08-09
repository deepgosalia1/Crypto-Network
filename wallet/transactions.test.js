const Wallet = require('./index');
const Transaction = require('./transaction');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD, MINE_RATE } = require('../config');
// const { validTransaction } = require('./transaction');

describe('Transaction tests',()=>{
    let senderWallet, transaction, recipient, amountToBePaid;
    beforeEach(()=>{
        senderWallet = new Wallet();
        amountToBePaid = 100;
        recipient = 'this_is_recipient_key';
        transaction = new Transaction({senderWallet, amountToBePaid, recipient});
    })

    it('property Checks and other validations',()=>{
        expect(transaction).toHaveProperty('id')
    })

    it('Multi recipient helper checks',()=>{
        // Output map is nothing but a feature to handle multiple
        // transactions to many recipients together. 
        expect(transaction).toHaveProperty('outputMap');
    })
    
    it('check the output maps',()=>{
        expect(transaction.outputMap[recipient]).toEqual(amountToBePaid);
        expect(transaction.outputMap[senderWallet.publicKey])
        .toEqual(senderWallet.balance - amountToBePaid);
        // the above statement checks for the condition that,
        // whenever a sender sends curr to reciever, the transaction has to
        // send the 'new' remaining bal of the sender as a transaction amount to the 
        // sender, thus adding added security to the final check like having 
        // correct and updated figures in the sender's account
    })

    it('transaction input property checks',()=>{
        expect(transaction).toHaveProperty('input');
        expect(transaction.input.balance).toEqual(senderWallet.balance);
        expect(transaction.input.address).toEqual(senderWallet.publicKey);
        expect(verifySignature({
            data:transaction.outputMap,
            signature:transaction.input.signature,
            publicKey:senderWallet.publicKey
        })).toBe(true)

    })

    describe(' txn validation cases' ,()=>{
        it('Valid scenario', ()=>{
            expect(Transaction.validTransaction(transaction)).toBe(true)
        })
        it('all inValid scenario', ()=>{
            transaction.outputMap[senderWallet.publicKey] = 55555;
            transaction.input.signature = new Wallet().sign('data')
            expect(Transaction.validTransaction(transaction)).toBe(false)
        })
        
    })
            
    describe('updatable transactions, clubbing multiple together.',()=>{
        let og_sig, og_remainingbalance, nextRecipient, nextAmountToBePaid;

        describe('invalid amount',()=>{
            it('throws an error',()=>{
                expect(()=>transaction.update({senderWallet, recipient:'fooro', nextAmountToBePaid:999999}))
                    .toThrow('Err. Amount exceeds balance')
            })
        })
        describe('valid amount',()=>{
            beforeEach(()=>{
                nextAmountToBePaid = 50;
                nextRecipient = 'fo000oooo';
                og_sig = transaction.input.signature;
                og_remainingbalance = transaction.outputMap[senderWallet.publicKey]
                transaction.update({
                    senderWallet, recipient: nextRecipient, nextAmountToBePaid
                })
            });
    
            it('normal valid condition checks', ()=>{
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmountToBePaid);
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
                    og_remainingbalance - nextAmountToBePaid
                );
                // Now original signature should also update and hence re-sign.
                expect(transaction.input.signature).not.toEqual(og_sig);
            })
            describe('special scenario where, multiple txn intended for same recipient.',()=>{
                // To be clear, in this test case, by the og implementation, if a new value is 
                // added to the outputMap for the same recipient then, old value will, 
                // simply be over written. Which is certainly not the desired choice.
                let newAmount;
                beforeEach(()=>{
                    newAmount = 50;
                    transaction.update({senderWallet, recipient: nextRecipient, nextAmountToBePaid: newAmount});

                })
                it('',()=>{
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmountToBePaid+newAmount);
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
                        og_remainingbalance - nextAmountToBePaid - newAmount
                    )
                })
            })
        })
        
    })

    describe('Transaction Rewards for miners.',()=>{
        let minerWallet, rewardTransaction;
        beforeEach(()=>{
            minerWallet = new Wallet();
            rewardTransaction = Transaction.rewardTransaction({minerWallet})
        })

        it('create rew. txn and mining reward', ()=>{
            expect(rewardTransaction.input).toEqual(REWARD_INPUT);
            expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
        })
    })
})