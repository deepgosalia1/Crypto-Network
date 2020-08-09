const INIT_DIFF = 3;
const MINE_RATE = 1000;
const START_BAL = 1000;
const GENESIS_DATA = {
    timestamp:'1111',
    lastHash:'firsthash',
    hash:'----',
    difficulty: INIT_DIFF,
    nonce:0,
    data:[]
}
const MINING_REWARD = 50;
const REWARD_INPUT = {address:"!*reward-address-authorization*!"};

module.exports={GENESIS_DATA, MINE_RATE, START_BAL, MINING_REWARD, REWARD_INPUT}