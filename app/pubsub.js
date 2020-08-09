const redis = require('redis');
const CHANNELS = {
    TEST : "TEST",
    BLOCKCHAIN: "BLOCKCHAIN",
    TRANSACTION: "TRANSACTION"

};
class PubSub {
    constructor({blockchain, transactionPool}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeTo();
        this.subscriber.on('message', (channel, message)=> this.handleMessage(channel, message));
    }
    handleMessage(channel, message){
        // this is majorly for the subscriber part, where a new incoming/boradcasted chain/transaction
        // is stored/updated in the local files of the subsriber netowrk.
        console.log(`message:${message}, from channel:${channel}`);
        const parsedMessage = JSON.parse(message);

        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage);    
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage)
                break;
            default:
                break;
        }
    }

    subscribeTo(){
        //Just a function to dynamically subs to the given channels in CHANNEL.  
        Object.values(CHANNELS).forEach(channel=>{
            this.subscriber.subscribe(channel);
        })
    }

    publish({channel, message}){
        // Here every publisher was originally its own subcriber as well.
        // so naturally a publisher would also recieve its own pushlished
        // message as well. To avoid that, we unsub temporarily.
        this.subscriber.unsubscribe(channel,()=>{
            this.publisher.publish(channel,message,()=>{
                this.subscriber.subscribe(channel);
            });
        })
        
    }
    broadcastChain(){
        this.publish({
            channel:CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction){
        this.publish({
            channel:CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}
module.exports = PubSub;