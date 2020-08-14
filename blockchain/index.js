const Block = require('./block');
const cryptohash = require('../util/cryptohash');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Blockchain {

    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ newData }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data: newData
        })

        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false; //check if the genesis block is still intact
        for (let i = 1; i < chain.length; i++) { //check for other block's corruption
            const { timestamp, data, lastHash, difficulty, nonce, hash } = chain[i]
            if (chain[i - 1].hash !== lastHash) return false
            if (cryptohash(timestamp, data, lastHash, nonce, difficulty) !== hash) return false
            // Also have to lookout for a security condition where, suddenly an attacker tries to jump down the difficulty very low.
            // This will increase the spamming of mined blocks. Similary if someone jumps up the difficulty condition too needs to be managed.
            if (Math.abs(chain[i - 1].difficulty - difficulty) > 1) return false;
        }
        return true
    }

    replaceChain(chain, validateTransactions, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.log('Invalid chain length detected.')
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.log('Invalid Chain detected.')
            return;
        }

        // if (validateTransactions && !this.validTransactionData({ chain })) {
        // console.log('Err. Invalid transaction data detected')
        //     return;
        // }

        if (onSuccess) onSuccess();
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            let rewardTxnCount = 0;
            const transactionSet = new Set();
            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTxnCount += 1;
                    if (rewardTxnCount > 1) {
                        console.log('Err. Miner rewards limit exceeded');
                        return false;
                    }
                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.log('Err. Inconsistent Mining Reward value')
                        return false
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.log('Err. Invalid Transaction Data provided')
                        return false;
                    }

                    if (transactionSet.has(transaction)) {
                        console.log('Err. Identical transactions Detected')
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.balance !== trueBalance) {
                        console.log('Err. Invalid Balance detected')
                        return false
                    }
                }
            }

        }
        return true;
    }
}

module.exports = Blockchain;