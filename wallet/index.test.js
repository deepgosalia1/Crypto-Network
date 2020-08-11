const Wallet = require('./index');
const { verifySignature } = require('../util');
const Transaction = require('./transaction');
const Blockchain = require('../blockchain');
const { START_BAL } = require('../config');

describe('Wallet Tests',()=>{
    let wallet;
    
    beforeEach(()=>{
        wallet = new Wallet();
    })
    
    it('checking defaults like Balace and pub key property',()=>{
        console.log(wallet.publicKey)
        expect(wallet).toHaveProperty('balance')
        expect(wallet).toHaveProperty('publicKey')
    })

    describe('Signature checks on the data',()=>{
        let data = 'lets do this.';
        it('Verify a Signature',()=>{
            expect(verifySignature({
                publicKey:wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true)
        })
        it('invalidates a fake signature',()=>{
            expect(verifySignature({
                publicKey:new Wallet().publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(false)
        })
    })

    describe('Creating Transaction and their checks',()=>{
        
        describe('Invalid condition, where amount to be paid, exceeds the balance',()=>{
            it('throw an error ', ()=>{
                expect(()=>{
                    wallet.createTransaction({
                        amountToBePaid:99999,
                        recipient:'demo - recipient'
                    }).toThrow('Err. Amount exceeds balance')
                })
            })
        })

        describe('Valid Conditions',()=>{
            let transaction, amountToBePaid, recipient;
            beforeEach(()=>{
                amountToBePaid = 50;
                recipient = 'fooooo';
                transaction = wallet.createTransaction({amountToBePaid, recipient})
            });

            it('normal valid condition checks', ()=>{
                expect(transaction instanceof Transaction).toBe(true);
                expect(transaction.input.address).toEqual(wallet.publicKey);
                expect(transaction.outputMap[recipient]).toEqual(amountToBePaid);
            })
        })

        
    })

    describe('calculateBalance()',()=>{
        let blockchain;
        beforeEach(()=>{
            blockchain = new Blockchain();
        });

        describe('WHen there are no transactions made to a particular account', ()=>{
            it('returns original starting balance',()=>{
                expect(Wallet.calculateBalance({chain: blockchain.chain, address:wallet.publicKey})).toEqual(START_BAL);
            })
        })

        describe('WHen there are some deposit transactions made to a particular account', ()=>{
            let transaction1, transaction2;
            beforeEach(()=>{
                transaction1 = new Wallet().createTransaction({recipient:wallet.publicKey, amountToBePaid:50});
                transaction2 = new Wallet().createTransaction({recipient:wallet.publicKey, amountToBePaid:90});
                blockchain.addBlock({newData:[transaction1,transaction2]});
            });

            it('returns new SUMMED balance',()=>{
                expect(Wallet.calculateBalance({chain: blockchain.chain, address:wallet.publicKey}))
                .toEqual(START_BAL + transaction1.outputMap[wallet.publicKey] + transaction2.outputMap[wallet.publicKey]);
            })

            describe('When the wallet has made a transaction',()=>{
                let recentTransaction;
                beforeEach(()=>{
                    recentTransaction = wallet.createTransaction({
                        recipient:'new-foo',
                        amountToBePaid:30
                    });
                    blockchain.addBlock({newData:[recentTransaction]});

                })
                it('should return the new updated remaining balance of the wallet',()=>{
                    expect(Wallet.calculateBalance({
                        chain:blockchain.chain,
                        address:wallet.publicKey
                    })).toEqual(recentTransaction.outputMap[wallet.publicKey]);
                })

                describe('When 3 distinct types of transactions occur in same mined block',()=>{
                    // WHat is happening in this test scenario is that, 
                    // firstly, a normal 'recentTransaction' is occuring from this wallet
                    // to any other recipient. So now the balance should be updated for this wallet
                    // Now this very same wallet, is also recieving a mining reward. 
                    // so now again balance should be updated. And now again, some other wallet is
                    // transferring currency to this wallet so again Balance has to be sync and updated.

                    let sameBlockTransaction, nextBlockTransaction;
                    beforeEach(()=>{
                        recentTransaction = wallet.createTransaction({
                            recipient:'Later-address',
                            amountToBePaid: 50
                        });
                        sameBlockTransaction = Transaction.rewardTransaction({minerWallet:wallet})
                        blockchain.addBlock({newData:[recentTransaction,sameBlockTransaction]})
                        // here the two transactions are now published to the network.

                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey,
                            amountToBePaid:80
                        });
                        blockchain.addBlock({newData:[nextBlockTransaction]});
                    })

                    it('includes output amounts in the returned balance',()=>{
                        expect(
                            Wallet.calculateBalance({
                                chain:blockchain.chain,
                                address:wallet.publicKey
                            })
                        ).toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        )
                    })
                })
            })
        })
    })
})