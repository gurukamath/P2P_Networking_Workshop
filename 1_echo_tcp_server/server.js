#!node

const net = require("net");

var server = net.createServer(function (socket) {
  console.log('new connection')

  socket.on('data', function (data) {
    process.stdout.write("New message received from client....");
    socket.write(`I received the data that you sent: ${data}`);
    process.stdout.write("Response has been sent.\n");
  })

  socket.on('close', () => {
    process.stdout.write("Client disconnected\n");
  })
})



server.listen(8124, () => {
  console.log('Server listening on port 8124');
});


