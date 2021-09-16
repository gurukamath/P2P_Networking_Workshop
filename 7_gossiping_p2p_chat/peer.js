#! node

const topology = require("fully-connected-topology");
const streamSet = require('stream-set');
const jsonStream = require('duplex-json-stream');
const _ = require("lodash");
const utils = require('./utils.js');


let activeSockets = streamSet();

const user = process.argv[2];
const myAddr = process.argv[3];
const peerAddr = process.argv.slice(4);

const t = topology(myAddr, peerAddr);

let msgIndex = 0;
let indexTracker = [];
const id = Math.random();

t.on('connection', (socket, id) => {
    console.log(`New Connection: ${id}`);
    socket = jsonStream(socket);
    activeSockets.add(socket);
    
    socket.on('data', (data) => {

        const userInd = _.findIndex(indexTracker, {id: data.id});

        if (userInd === -1 || indexTracker[userInd].msgIndex < data.index){

            console.log(`\t${data.user}: ${data.message.replace(/(\r\n|\n|\r)/gm, "")}`);
            utils.upsert(indexTracker, {id: data.id}, {id: data.id, msgIndex: data.index});
            activeSockets.forEach((soc) => {
                if (soc != socket){
                    soc.write({user: data.user, id: data.id, message: data.message, index: data.index});
                }
            })

        }  
    })
})

process.stdin.on('data', (data) => {
    msgIndex++;
    utils.upsert(indexTracker, {user: user}, {user: user, msgIndex: msgIndex});
    activeSockets.forEach(socket => {
        socket.write({user: user, id: id, message: data.toString(), index: msgIndex});

    })
})

// Testing 

// ./7_gossiping_p2p_chat/peer.js eduardo localhost:3000 localhost:3001
// ./7_gossiping_p2p_chat/peer.js mafintosh localhost:3001 localhost:3002
// ./7_gossiping_p2p_chat/peer.js watson localhost:3002
// ./7_gossiping_p2p_chat/peer.js Guru localhost:3003 localhost:3000 localhost:3002


