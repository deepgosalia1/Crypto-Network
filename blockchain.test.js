const Block = require('./block')
const Blockchain = require('./blockchain')


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

describe('Chain Relication Tests',()=>{
    let bc, new_bc, og_bc;
    beforeEach(()=>{
        bc = new Blockchain();
        new_bc = new Blockchain();
        og_bc = bc.chain;

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

    
})