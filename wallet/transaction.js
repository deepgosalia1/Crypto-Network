const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction{

    constructor({senderWallet, recipient, amountToBePaid, input, outputMap}){
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({senderWallet, recipient, amountToBePaid});
        this.input = input || this.createInput({senderWallet, outputMap:this.outputMap});
    }

    createOutputMap({senderWallet, recipient, amountToBePaid}){
        let outputMap = {};
        outputMap[recipient] = amountToBePaid;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amountToBePaid;

        return outputMap;
    }

    createInput({senderWallet, outputMap}){
        return {
            timestamp: Date.now(),
            balance:senderWallet.balance,
            address:senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        }
    }

    static validTransaction(transaction){
        const {input:{address,balance,signature}, outputMap} = transaction;
        const outTotal = Object.values(outputMap).reduce(
            (total, outputAmount)=>total+outputAmount
        )
        if (balance !== outTotal) {
            console.log('Err. Sender"s total does not match the transaction total amounts.')
            return false;
        }
        if (!verifySignature({publicKey:address, signature, data:outputMap})) {
            console.log('Err. Signature validation Failed.')
            return false;
        }
        return true;
    }

    static rewardTransaction({minerWallet}){
        return new this({
            input:REWARD_INPUT,
            outputMap: {[minerWallet.publicKey]:MINING_REWARD}
        });
    }

    update({senderWallet, recipient, nextAmountToBePaid}){
        if (nextAmountToBePaid > this.outputMap[senderWallet.publicKey]){
            throw new Error('Err. Amount exceeds balance');
        }

        if (!this.outputMap[recipient]){
            this.outputMap[recipient] = nextAmountToBePaid;
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + nextAmountToBePaid;
        }
        this.outputMap[senderWallet.publicKey] = 
            this.outputMap[senderWallet.publicKey] - nextAmountToBePaid;
        
            this.input = this.createInput({senderWallet, outputMap: this.outputMap})
    }
}

module.exports = Transaction