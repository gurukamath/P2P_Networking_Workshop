#!node

const net = require("net");

let nickname = '';
if (process.argv.length === 3){
  nickname = process.argv[2];
} else {
  console.log('Usage: ./client <name>');
  process.exit();
}

const jsonStream = require('duplex-json-stream');
let socket = jsonStream(net.connect(8124, 'localhost'));


process.stdin.on('data', function (data) {
  const message = {
    name: nickname,
    message: data.toString()
  }

  socket.write(message);
})

socket.on('data', function (data) {

  console.log(`\t${data.name}: ${data.message.replace(/(\r\n|\n|\r)/gm, "")}`);
})

