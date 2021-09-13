#!node

const net = require("net");
const streamSet = require('stream-set');
const jsonStream = require('duplex-json-stream');

const activeSockets = streamSet();

const server = net.createServer(function (socket) {
  console.log('new connection');
  socket = jsonStream(socket);
  activeSockets.add(socket);

  socket.on('data', function (data) {

    process.stdout.write("New message received from a client....");

    activeSockets.forEach(soc => {
      if (soc != socket) {
        soc.write(data);
      }
    })

    process.stdout.write("the message has been forwarded to the others\n");
  })

  socket.on('close', () => {
    process.stdout.write("Client disconnected\n");
    process.stdout.write(`Remaining client connections: ${activeSockets.size}\n`);
  })
})


server.listen(8124, () => {
  console.log('Server listening on port 8124');
});


