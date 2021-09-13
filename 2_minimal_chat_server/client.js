#!node

const net = require("net");

const socket = net.connect(8124, 'localhost')

process.stdin.on('data', function (data) {
  socket.write(data);
})

socket.on('data', function (data) {
  process.stdout.write("The following message was received from the server...\n");
  process.stdout.write(data);
})

