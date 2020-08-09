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

    createTransaction({ amountToBePaid, recipient}){
        if (amountToBePaid > this.balance){
            throw new Error('Err. Amount exceeds balance')
        }

        return new Transaction({senderWallet:this, amountToBePaid, recipient});
    }
}

module.exports = Wallet;