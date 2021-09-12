#!node

const net = require("net");

const client = new net.Socket();

client.connect(8124, 'localhost', () => {
    console.log("Connected....");
    client.write("Hello Server!");
})

client.on('data', (data) => {
    console.log(data.toString());
})

client.on('close', () => {
    console.log('Connection closed');
})