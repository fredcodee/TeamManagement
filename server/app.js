const config = require('./configs/config');
const app = require('./configs/express');
const http = require('http');
require('./configs/mongoose');


const server = http.createServer(app);
const io = require('./configs/socket')(server);
app.set('io', io); // set io object to app (socket.io set up)

server.listen(config.port, () => {
    console.info(`server started on port ${config.port}`);
  });
  
module.exports = { server };







