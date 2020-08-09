// EC is the elliptic curve functionality to achieve 
// optimum security standards for the blockchain here.
const EC = require('elliptic').ec;
const cryptohash = require('./cryptohash');
const ec = new EC('secp256k1');// secp256k1 is a specific type of EC method we require here. refer more at git repo.

const verifySignature = ({publicKey, data, signature}) =>{
    // line below has the funciton to verify a signature 'verify'.
    // But it can only do so in the scope of a key instance. hence we use
    // the public key. And recall that we are actually passing the key in the hex format.
    const keyFromPub = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPub.verify(cryptohash(data),signature);
}
module.exports = {ec, verifySignature, cryptohash}