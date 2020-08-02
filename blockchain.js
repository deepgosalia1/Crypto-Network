const Block = require('./block');
const cryptohash = require('./cryptohash');

class Blockchain{
    
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({newData}){
        const newBlock = Block.mineBlock({
            lastBlock:this.chain[this.chain.length - 1],
            data: newData
        })

        this.chain.push(newBlock);
    }

    static isValidChain(chain){
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false; //check if the genesis block is still intact
        for (let i = 1; i<chain.length; i++){ //check for other block's corruption
            const {timestamp, data, lastHash,difficulty, nonce, hash} = chain[i]
            if (chain[i-1].hash !== lastHash) return false
            if (cryptohash(timestamp,data,lastHash,nonce, difficulty) !== hash) return false
            // Also have to lookout for a security condition where, suddenly an attacker tries to jump down the difficulty very low.
            // This will increase the spamming of mined blocks. Similary if someone jumps up the difficulty condition too needs to be managed.
            if (Math.abs(chain[i-1].difficulty - difficulty)>1) return false;
        }
        return true
    }

    replaceChain(incoming_chain){
        if (incoming_chain.length <= this.chain.length) {
            console.log('Invalid chain length detected.')
            return
        }
        if (!Blockchain.isValidChain(incoming_chain)) {
            console.log('Invalid Chain detected.')
            return
        }
        this.chain = incoming_chain
    }
}

module.exports = Blockchain;