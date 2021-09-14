#! node

const topology = require("fully-connected-topology");
const streamSet = require('stream-set');
const jsonStream = require('duplex-json-stream');

let activeSockets = streamSet();

const user = process.argv[2];
const myAddr = process.argv[3];
const peerAddr = process.argv.slice(4);

const t = topology(myAddr, peerAddr);

t.on('connection', (socket, id) => {
    console.log(`New Connection: ${id}`);
    socket = jsonStream(socket);
    activeSockets.add(socket);
    
    socket.on('data', (data) => {
        console.log(`\t${data.user}: ${data.message.replace(/(\r\n|\n|\r)/gm, "")}`);
    })
})

process.stdin.on('data', (data) => {
    activeSockets.forEach(socket => {
        socket.write({user: user, message: data.toString()});

    })
})



