var {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptohash = require('./cryptohash');
const HTB = require('hex-to-binary')

class Block{
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis(){
        return new Block(GENESIS_DATA)
    }

    static mineBlock({lastBlock, data}){
        let timestamp, hash;
        const lastHash = lastBlock.hash
        let nonce = 0;
        let {difficulty} = lastBlock

        // Do while loop below essentially regenerates the nonces again and again
        // until the hash with first `difficulty` number of 0's are produced.
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDiff({og_block:lastBlock, timestamp})// for auto adjusting difficulty, if mining blocks becomes too fast.
            hash = cryptohash(timestamp, lastBlock.hash, data, difficulty, nonce)
        } while (HTB(hash).substring(0,difficulty)!== '0'.repeat(difficulty));

        return new Block({
            timestamp,
            lastHash,
            difficulty,
            nonce,
            hash,
            data
        })
    }

    static adjustDiff({og_block, timestamp}) {
        const {difficulty} = og_block
        if (difficulty < 1) return 1
        if (timestamp - og_block.timestamp > MINE_RATE) return difficulty - 1
        return difficulty + 1
    }
}

module.exports = Block;