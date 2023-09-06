// socket.js
const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin:[process.env.FRONTEND_ORIGIN_DEV , process.env.FRONTEND_ORIGIN_PROD ],
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });

  return io;
};