const INIT_DIFF = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp:'1111',
    lastHash:'firsthash',
    hash:'----',
    difficulty: INIT_DIFF,
    nonce:0,
    data:[]
}

module.exports={GENESIS_DATA, MINE_RATE}