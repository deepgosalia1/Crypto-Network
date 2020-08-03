let Block = require('./block')
let {GENESIS_DATA, MINE_RATE} = require('../config')
const cryptohash = require('../util/cryptohash')
const HTB = require('hex-to-binary')

describe('Block Test: ', ()=>{
    const nonce = 1;
    const difficulty = 1;
    var block1 = new Block({timestamp:2000 , lastHash:'lasthash', hash:'justhash', data:'trial', nonce, difficulty})

    it('only IT',()=>{
        expect(block1.lastHash = 'lasthash')
    })


    describe('Genesis Test ', ()=>{

        const GBlock = Block.genesis()
        console.log(GBlock)
        it('check the instance of ', ()=>{
            expect(GBlock instanceof Block).toBe(true)
            expect(GBlock).toEqual(GENESIS_DATA);
        })
    })

    describe('Mining Block Test ', ()=>{

        const lastBlock = Block.genesis()
        const data = 'mined data'
        const minedBlock = Block.mineBlock({lastBlock, data})
        console.log(minedBlock)
        it('check Mined Block and its details ', ()=>{
            expect(minedBlock instanceof Block).toBe(true)
            expect(minedBlock.hash).toEqual(cryptohash(minedBlock.timestamp,lastBlock.hash, data, minedBlock.nonce, minedBlock.difficulty))
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
            expect(minedBlock.timestamp).not.toEqual(undefined); 
            // expect(minedBlock.lastHash).toEqual(lastBlock.hash);
            // expect(minedBlock.nonce).toEqual(lastBlock.nonce);

        })

        it('Meets the difficulty criteria with the first required number of 0 in hash. ', ()=>{
            expect(HTB(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
        })

        it('Adjusts Difficulty dynamically ', ()=>{
            const newPossibleDifficultyRange = [lastBlock.difficulty+1,lastBlock.difficulty-1]
            expect(newPossibleDifficultyRange.includes(minedBlock.difficulty)).toBe(true)
        })

    })

    describe('Dynamic Minig Rate Test', ()=>{
        it('Raise the diff as blocks are mined quickly',()=>{
            expect(Block.adjustDiff({og_block:block1, timestamp:block1.timestamp + MINE_RATE - 100})).toEqual(block1.difficulty + 1)
            // With the above line, we are sending the static timestamp value of the newly mined block.
            // that is originalblock's timestamp + (lets say it also took) MINE_RATE seconds to mine a new block, but subtracting 100 so that
            // it falls within the condition that it is too early to have anew block mined.
        })

        it('Lower the diff as blocks are mined slowly',()=>{
            expect(Block.adjustDiff({og_block:block1, timestamp:block1.timestamp + MINE_RATE + 100})).toEqual(block1.difficulty - 1)
            // Similary, here the opposite condition is checked for timestamp value just a little bit higher (+100 millisecs) 
            // than the prev mined block
        })
    })

})