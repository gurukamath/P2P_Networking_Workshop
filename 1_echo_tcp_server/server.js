#!node

const net = require("net");

const server = net.createServer((c) => {

    console.log('client connected');

    c.on('data', (data) => {
        console.log(data.toString());
        c.write('Hello Client!');
    })

    c.on('end', () => {
        console.log('client disconnected');
      });

  });

  server.on('error', (err) => {
    throw err;
  });

  server.listen(8124, () => {
    console.log('Server listening on port 8124');
  });