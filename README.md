<h1 align="center"> CRYPTO-NETWORK </h1> <br>
<p align="center">
  <a href="https://deepgosalia1.github.io/portfolio/">
    <img alt="CryptoNetwork" title="CryptoNetwork" src="https://i.imgur.com/SUdPfzG.gif">
  </a>
</p>

## Introduction
This is a project dedicated towards building the basic cryptocurrency blockchain from scratch, using nothing but JS and to be precise:
1. React, React-Router for the frontend
2. Redis, NodeJS and Express for the backened.
3. <b>NO</b> external packages or languages like Solidity, Truffle, Ganache are used in the project

## Features
-   [x] This webApp provides security and transaparency to its users involved within its network.
-   [x] Concepts like <b>Proof-of-Work, Nonce, Difficulty</b> have been implemented
-   [x] Secure transactions of <b>demo cryptocurrency</b> in the network is enabled.
-   [x] A <b>publisher/subscriber methodology</b> is implemented where the authorized users in the network will remain subcribed to the root chain of the network.
-   [x] A <b>multi-node (Peer-to-Peer) system architecture</b> is designed (as shown in the GIF above) where you can send crypto to other wallets as well.

## Understanding concepts
### -> Proof -of- work (~ PoW) and Mining (`Difficulty` && `Nonce`)
In the domain of blockchain, an authorized user can only add a new block to the chain(mining), when his system demomstrates a PoW mechanism.
Here, every new block containing its relevant data, will bear a hash of the data too. The PoW constraint applied is that:
The hash generated should be such that the first 'difficulty' number of bits should be '0' mandatorily. And the variable 'nonce' can be manipulated accordingly
to achieve this required Hash. In general, this is set to counter the mining rate of the new blocks, such it does not spam the enitre blockchain.

## Requirements
1. Node and NPM
2. Redis-Server
3. PubNub (alternative to Redis)

## Run
1. After cloning the project in your system, run ```npm run dev``` for main development server. It is currently defaulting to `localhost:3000`.
2. All the backend endpoints refer to ```localhost:3000/api/...```. 
3. In-order to run multiple peers (mutiple nodes of the BC network) simultaneously, run `npm run dev-peer` as many times as the number of nodes you want.
4. All the peer nodes are configured to run on random ports <=4500. To figure out you peer-port, please watch the console logs in the ```npm run dev-peer``` command.

## Note
1. This project is configured to run multiple nodes, and sync with the blockchain data with the ```Root-Node-Address (RNA)```. On every peer's initial boot, it will first fetch the data from the Root chain.
2. The package.json contains multiple startup Scripts according to the different use cases like server start ups, distribution code, App deployment to public servers.
