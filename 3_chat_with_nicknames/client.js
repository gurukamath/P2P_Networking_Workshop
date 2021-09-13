#!node

const net = require("net");

const jsonStream = require('duplex-json-stream');
let socket = jsonStream(net.connect(8124, 'localhost'));

const nickname = process.argv[2];

process.stdin.on('data', function (data) {
  const message = {
    name: nickname,
    message: data.toString()
  }
  socket.write(message);
})

socket.on('data', function (data) {

  process.stdout.write("The following message was received from the server...\n");
  console.log(`${data.name} says ${data.message.replace(/(\r\n|\n|\r)/gm, "")}`);
})

