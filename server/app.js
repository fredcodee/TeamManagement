const config = require('./configs/config');
const app = require('./configs/express');
const http = require('http');
require('./configs/mongoose');


const server = http.createServer(app);

server.listen(config.port, () => {
    console.info(`server started on port ${config.port}`);
  });
  
module.exports = { server };







