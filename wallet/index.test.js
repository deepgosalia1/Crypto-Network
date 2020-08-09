const Wallet = require('./index');
const { verifySignature } = require('../util');
const Transaction = require('./transaction');

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
})