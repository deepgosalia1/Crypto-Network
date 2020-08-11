const Block = require('./block')
const Blockchain = require('.')
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

describe('main BlockChain rendering tests ', ()=>{

    const bc = new Blockchain();
    console.log(bc.chain instanceof Array, 'True or False')
    
    it('check Mined Block and its hash ', ()=>{
        expect(bc.chain instanceof Array).toBe(true)
        expect(bc.chain[0] instanceof Block).toBe(true)
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    bc.addBlock({newData:'welcome_to_blockchain'})

    it('Added the block successfully', () => {
        expect(bc.chain[bc.chain.length - 1].data).toEqual('welcome_to_blockchain')
    })
})

describe('Chain Validation Tests',()=>{
    let bc = new Blockchain();
    beforeEach(()=>{
        bc.addBlock({newData:'Newblockhere'})
        bc.addBlock({newData:'Newerrrblockhere'})
        bc.addBlock({newData:'Newestttblockhere'})
    })

    it('if not initiated with genesis block', () => {
        bc.chain[0].data = 'fake-gen'
        expect(Blockchain.isValidChain(bc.chain)).toBe(false)
    })

    it('if only last added block`s hash ref has changed', () => {
        bc.chain[2].hash = 'invalid-hash'
        expect(Blockchain.isValidChain(bc.chain)).toBe(false)
    })
    
    it('if one of the data field has gone corrupt', () => {
        bc.chain[2].data = 'corrupted-hash'
        expect(Blockchain.isValidChain(bc.chain)).toBe(false)
    })
    
    it('if one of the data field has gone corrupt', () => {
        bc.chain[2].data = 'corrupted-hash'
        expect(Blockchain.isValidChain(bc.chain)).toBe(false)
    })

    it('Finally, chain is top-notch bug free, or as we gujarati"s say -> Taka Tak che', () => {

        expect(Blockchain.isValidChain(bc.chain)).toBe(false)
    })


})

describe('Chain Replication Tests',()=>{
    let bc, new_bc, og_bc, temp_bc;
    beforeEach(()=>{
        bc = new Blockchain();
        new_bc = new Blockchain();
        og_bc = bc.chain;
        temp_bc = new Blockchain();

        bc.addBlock({newData:'Newblockhere'})
        bc.addBlock({newData:'Newerrrblockhere'})
        bc.addBlock({newData:'Newestttblockhere'})
    })

    it('new incoming chain isnt longer',()=>{
        new_bc.chain[0] = { unexpected_var : 'not cool' }
        bc.replaceChain(new_bc.chain)
        expect(bc.chain).toEqual(og_bc)
    })
    it('new incoming chain is longer, but invalid',()=>{
        new_bc.addBlock({newData:'Newblockhere'})
        new_bc.addBlock({newData:'Newerrrblockhere'})
        new_bc.addBlock({newData:'Newestttblockhere'})
        new_bc.chain[2].hash = 'unknown-hash'
        bc.replaceChain(new_bc)
        expect(bc.chain).toEqual(og_bc)
    })
    // it('new incoming chain is longer and valid',()=>{
    //     bc.replaceChain(new_bc)
    //     expect(bc.chain).toEqual(new_bc.chain)
    // })

    
    describe('Security Checks: Valid Transaction Data in blockchain',()=>{
        let transaction, rewardTransaciton, wallet;
        beforeEach(()=>{
            bc = new Blockchain();
            wallet = new Wallet();
            transaction = wallet.createTransaction({recipient:'foooe', amountToBePaid:50});
            rewardTransaciton = Transaction.rewardTransaction({minerWallet:wallet});
        })
    
        describe('and the transaction data is valid',()=>{
            it('return True',()=>{
                temp_bc.addBlock({newData:[transaction, rewardTransaciton]});
                expect(bc.validTransactionData({chain:temp_bc.chain})).toBe(true);
    
            })
        })
    
        describe('and the transaction has multiple rewards',()=>{
            it('return False',()=>{
                temp_bc.addBlock({newData:[transaction, rewardTransaciton, rewardTransaciton]});
                expect(bc.validTransactionData({chain:temp_bc.chain})).toBe(false);
    
            })
        })
    
        describe('and the transaction has malformed OutputMap',()=>{
            
            describe('is a reward Transaction',()=>{
                it('return False',()=>{
                    transaction.outputMap[wallet.publicKey] = 909000;
                    temp_bc.addBlock({newData:[transaction, rewardTransaciton]})
                    expect(bc.validTransactionData({chain:temp_bc.chain})).toBe(false);
                })
            })
    
    
            describe('is not a reward Transaction',()=>{
                it('return False',()=>{
                    rewardTransaciton.outputMap[wallet.publicKey] = 909000;
                    temp_bc.addBlock({newData:[transaction, rewardTransaciton]})
                    expect(bc.validTransactionData({chain:temp_bc.chain})).toBe(false);
                })
            })
    
        })
    
    
        describe('and the transaction has malformed input',()=>{
            it('return False',()=>{
                wallet.balance = 9000;
                const badOutputMap = {
                    [wallet.publicKey]:8900,
                    fooRecipient:100
                };
                const badtransaction = {
                    input:{
                        timestamp: Date.now(),
                        balance: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(badOutputMap)
                    },
                    outputMap: badOutputMap
                }
                temp_bc.addBlock({newData:[badtransaction, rewardTransaciton]})
                expect(bc.validTransactionData({chain:temp_bc.chain})).toBe(false);
            })
        })
    
    
        describe('and the transaction has multiple identical transactions',()=>{
            it('return False',()=>{
                temp_bc.addBlock({newData:[transaction, transaction, transaction, rewardTransaciton]})
                expect(bc.validTransactionData({chain:temp_bc.chain})).toBe(false);
            })
        })
    })
    
})

// const Blockchain = require('./index');
// const Block = require('./block');
// const Wallet = require('../wallet');
// const Transaction = require('../wallet/transaction');
// const cryptoHash = require('../util/cryptohash');

// describe('Blockchain', () => {
//   let blockchain, newChain, originalChain, errorMock;

//   beforeEach(() => {
//     blockchain = new Blockchain();
//     newChain = new Blockchain();
//     // errorMock = jest.fn();

//     originalChain = blockchain.chain;
//     // global.console.error = errorMock;
//   });

//   it('contains a `chain` Array instance', () => {
//     expect(blockchain.chain instanceof Array).toBe(true);
//   });

//   it('starts with the genesis block', () => {
//     expect(blockchain.chain[0]).toEqual(Block.genesis());
//   });

//   it('adds a new block to the chain', () => {
//     const newData = 'foo bar';
//     blockchain.addBlock({ data: newData });

//     expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
//   });

//   describe('isValidChain()', () => {
//     describe('when the chain does not start with the genesis block', () => {
//       it('returns false', () => {
//         blockchain.chain[0] = { data: 'fake-genesis' };

//         expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
//       });
//     });

//     describe('when the chain starts with the genesis block and has multiple blocks', () => {
//       beforeEach(() => {
//         blockchain.addBlock({ data: 'Bears' });
//         blockchain.addBlock({ data: 'Beets' });
//         blockchain.addBlock({ data: 'Battlestar Galactica' });
//       });

//       describe('and a lastHash reference has changed', () => {
//         it('returns false', () => {
//           blockchain.chain[2].lastHash = 'broken-lastHash';

//           expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
//         });
//       });

//       describe('and the chain contains a block with an invalid field', () => {
//         it('returns false', () => {
//           blockchain.chain[2].data = 'some-bad-and-evil-data';

//           expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
//         });
//       });

//       describe('and the chain contains a block with a jumped difficulty', () => {
//         it('returns false', () => {
//           const lastBlock = blockchain.chain[blockchain.chain.length-1];
//           const lastHash = lastBlock.hash;
//           const timestamp = Date.now();
//           const nonce = 0;
//           const data = [];
//           const difficulty = lastBlock.difficulty - 3;
//           const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
//           const badBlock = new Block({
//             timestamp, lastHash, hash, nonce, difficulty, data
//           });

//           blockchain.chain.push(badBlock);

//           expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
//         });
//       });

//       describe('and the chain does not contain any invalid blocks', () => {
//         it('returns true', () => {
//           expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
//         });
//       });
//     });
//   });

//   describe('replaceChain()', () => {
//     let logMock;

//     beforeEach(() => {
//     //   logMock = jest.fn();

//     //   global.console.log = logMock;
//     });

//     describe('when the new chain is not longer', () => {
//       beforeEach(() => {
//         newChain.chain[0] = { new: 'chain' };

//         blockchain.replaceChain(newChain.chain);
//       });

//       it('does not replace the chain', () => {
//         expect(blockchain.chain).toEqual(originalChain);
//       });

//     //   it('logs an error', () => {
//     //     expect(errorMock).toHaveBeenCalled();
//     //   });
//     });

//     describe('when the new chain is longer', () => {
//       beforeEach(() => {
//         newChain.addBlock({ data: 'Bears' });
//         newChain.addBlock({ data: 'Beets' });
//         newChain.addBlock({ data: 'Battlestar Galactica' });
//       });

//       describe('and the chain is invalid', () => {
//         beforeEach(() => {
//           newChain.chain[2].hash = 'some-fake-hash';

//           blockchain.replaceChain(newChain.chain);
//         });

//         it('does not replace the chain', () => {
//           expect(blockchain.chain).toEqual(originalChain);
//         });

//         // it('logs an error', () => {
//         //   expect(errorMock).toHaveBeenCalled();
//         // });
//       });

//       describe('and the chain is valid', () => {
//         beforeEach(() => {
//           blockchain.replaceChain(newChain.chain);
//         });

//         it('replaces the chain', () => {
//           expect(blockchain.chain).toEqual(newChain.chain);
//         });

//         // it('logs about the chain replacement', () => {
//         //   expect(logMock).toHaveBeenCalled();
//         // });
//       });
//     });

//     describe('and the `validateTransactions` flag is true', () => {
//       it('calls validTransactionData()', () => {
//         // const validTransactionDataMock = jest.fn();

//         // blockchain.validTransactionData = validTransactionDataMock;

//         newChain.addBlock({ data: 'foo' });
//         blockchain.replaceChain(newChain.chain, true);

//         // expect(validTransactionDataMock).toHaveBeenCalled();
//       });
//     });
//   });

//   describe('validTransactionData()', () => {
//     let transaction, rewardTransaction, wallet;

//     beforeEach(() => {
//       wallet = new Wallet();
//       transaction = wallet.createTransaction({ recipient: 'foo-address', amountToBePaid: 65 });
//       rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
//     });

//     describe('and the transaction data is valid', () => {
//       it('returns true', () => {
//         newChain.addBlock({ data: [transaction, rewardTransaction] });

//         expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(true);
//         // expect(errorMock).not.toHaveBeenCalled();
//       });
//     });

//     describe('and the transaction data has multiple rewards', () => {
//       it('returns false and logs an error', () => {
//         newChain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction] });

//         expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
//         // expect(errorMock).toHaveBeenCalled();
//       });
//     });

//     describe('and the transaction data has at least one malformed outputMap', () => {
//       describe('and the transaction is not a reward transaction', () => {
//         it('returns false and logs an error', () => {
//           transaction.outputMap[wallet.publicKey] = 999999;

//           newChain.addBlock({ data: [transaction, rewardTransaction] });

//           expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
//         //   expect(errorMock).toHaveBeenCalled();
//         });
//       });

//       describe('and the transaction is a reward transaction', () => {
//         it('returns false and logs an error', () => {
//           rewardTransaction.outputMap[wallet.publicKey] = 999999;

//           newChain.addBlock({ data: [transaction, rewardTransaction] });

//           expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
//         //   expect(errorMock).toHaveBeenCalled();
//         });
//       });
//     });

//     describe('and the transaction data has at least one malformed input', () => {
//       it('returns false and logs an error', () => {
//         wallet.balance = 9000;

//         const evilOutputMap = {
//           [wallet.publicKey]: 8900,
//           fooRecipient: 100
//         };

//         const evilTransaction = {
//           input: {
//             timestamp: Date.now(),
//             balance: wallet.balance,
//             address: wallet.publicKey,
//             signature: wallet.sign(evilOutputMap)
//           },
//           outputMap: evilOutputMap
//         }

//         newChain.addBlock({ data: [evilTransaction, rewardTransaction] });

//         expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
//         // expect(errorMock).toHaveBeenCalled();
//       });
//     });

//     describe('and a block contains multiple identical transactions', () => {
//       it('returns false and logs an error', () => {
//         newChain.addBlock({
//           data: [transaction, transaction, transaction, rewardTransaction]
//         });

//         expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
//         // expect(errorMock).toHaveBeenCalled();
//       });
//     });
//   });
// });