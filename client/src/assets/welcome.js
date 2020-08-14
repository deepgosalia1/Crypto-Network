const title = "CryptoNetwork"
const welcome = "Welcome! to the demo blockchain implemented purely on Javascript!"
const welcome2 = " It features secure transactions, mining your own blocks, and exporing other known addresses in the system!"
const notes = [
    {
        id: "1",
        text: "This project is also configured to run a multi-peer (peer-to-peer network) blockchain if hosted on a local server."
    },
    {
        id: "2",
        text: "It will use Redis-Server and Publisher/Subscriber methodology to broadcast new blocks over the entire peer network."
    },]

const steps = [
    {
        id: "1",
        text: "First, Go to the `Perform  Transactions` page and create a blockchain transaction."
    },
    {
        id: "2",
        text: "You can then, mine the transactions from your mining pool consisting of your recent transactions."
    },
    {
        id: "3",
        text: "Once you have mined, you can then view your transaction published in the ledger at `Mined Blocks` page. (most recent blocks first)"
    },]
module.exports = { title, welcome, welcome2, notes, steps };