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

t.on('connection', (socket, id) => {
    console.log(`New Connection: ${id}`);
    socket = jsonStream(socket);
    activeSockets.add(socket);
    
    socket.on('data', (data) => {

        const userInd = _.findIndex(indexTracker, {user: data.user});

        if (userInd === -1 || indexTracker[userInd].msgIndex < data.index){

            console.log(`\t${data.user}: ${data.message.replace(/(\r\n|\n|\r)/gm, "")}`);
            utils.upsert(indexTracker, {user: data.user}, {user: data.user, msgIndex: data.index});
            activeSockets.forEach((soc) => {
                if (soc != socket){
                    soc.write({user: data.user, message: data.message, index: data.index});
                }
            })

        }  
    })
})

process.stdin.on('data', (data) => {
    msgIndex++;
    utils.upsert(indexTracker, {user: user}, {user: user, msgIndex: msgIndex});
    activeSockets.forEach(socket => {
        socket.write({user: user, message: data.toString(), index: msgIndex});

    })
})



