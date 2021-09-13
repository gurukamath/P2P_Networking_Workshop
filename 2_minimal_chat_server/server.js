#!node

const net = require("net");
const streamSet = require('stream-set');

const activeSockets = streamSet();

const server = net.createServer(function (socket) {
  console.log('new connection');
  activeSockets.add(socket);

  socket.on('data', function (data) {
    process.stdout.write("New message received from a client....");

    activeSockets.forEach(soc => {
      if (soc != socket) {
        soc.write(data);
      }
    })

    process.stdout.write("Response has been sent.\n");
  })

  socket.on('close', () => {
    process.stdout.write("Client disconnected\n");
    process.stdout.write(`Remaining client connections: ${activeSockets.size}\n`);
  })
})


server.listen(8124, () => {
  console.log('Server listening on port 8124');
});


