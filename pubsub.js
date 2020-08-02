const redis = require('redis');
const CHANNELS = {
    TEST : "TEST",
    BLOCKCHAIN: "BLOCKCHAIN",

};
class PubSub {
    constructor({blockchain}){
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeTo();
        this.subscriber.on('message', (channel, message)=> this.handleMessage(channel, message));
    }
    handleMessage(channel, message){
        console.log(`message:${message}, from channel:${channel}`);
        const parsedMessage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parsedMessage);
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
}
module.exports = PubSub;