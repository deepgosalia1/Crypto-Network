const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser')
const PubSub = require('./pubsub');
const DEFAUT_PORT = 3000;
 
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain})

const RNA = `http://localhost:${DEFAUT_PORT}` //Root Node Address

app.use(bodyParser.json());
app.get('/api/blocks', (req, res)=>{
    res.json(blockchain.chain);
})
app.post('/api/mine', (req, res)=>{
    const {data} = req.body;
    blockchain.addBlock({newData:data});
    pubsub.broadcastChain();
    res.redirect('/api/blocks')
})

const syncChain = () => {
    request({url:`${RNA}/api/blocks`},(error, response, body)=>{
        if (!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('Syncing the root chain...', rootChain);
            blockchain.replaceChain(rootChain);
        }
    })    
}
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAUT_PORT + Math.ceil(Math.random() * 1500)
}
const PORT = PEER_PORT || DEFAUT_PORT;

app.listen(PORT, ()=>{
    console.log(`Listening at localhost:${PORT}`)
    if (PORT !== DEFAUT_PORT ) syncChain();
})