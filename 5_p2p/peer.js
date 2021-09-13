#! node

const topology = require("fully-connected-topology");

const myAddr = process.argv[2];
const peerAddr = process.argv.slice(3);

const t = topology(myAddr, peerAddr);

t.on('connection', () => {
    console.log('Peer connected');
})