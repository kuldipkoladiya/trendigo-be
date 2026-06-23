const { Server } = require('socket.io');
const socketAPI = require('../socketAPI');

module.exports = {
  initSockets(server) {
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    socketAPI.bindEvents(io);
    // eslint-disable-next-line no-console
    console.log('Socket.io successfully attached to HTTP server');
  },
};
