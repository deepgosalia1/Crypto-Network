const {START_BAL} = require('../config');
const {ec} = require('../util');
const cryptoHash = require('../util/cryptohash');
const Transaction = require('./transaction');

class Wallet{

    constructor(){
        this.balance = START_BAL;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data){
        return this.keyPair.sign(cryptoHash(data)) 
        // calling crytohash to sign is because sign() requires a data in a hash form for optimal perf.
    }

    createTransaction({ amountToBePaid, recipient, chain}){
        if (chain){
            this.balance = Wallet.calculateBalance({chain, address:this.publicKey})
        }
        if (amountToBePaid > this.balance){
            throw new Error('Err. Amount exceeds balance')
        }

        return new Transaction({senderWallet:this, amountToBePaid, recipient});
    }

    static calculateBalance({chain, address}){
        let outputsTotal = 0;
        let hasConductedTransaction = false;
        
        for (let i = chain.length - 1; i > 0; i--){
        
            const block = chain[i];
        
            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }
                
                const addressOutput = transaction.outputMap[address];
                
                if (addressOutput){
                    outputsTotal = outputsTotal + addressOutput;
                }                
            }
            if (hasConductedTransaction) break;

        }
        return hasConductedTransaction? outputsTotal : START_BAL + outputsTotal;
    }
    
}

module.exports = Wallet;