const SocketServer = require('socket.io');
const redisAdapter = require('socket.io-redis');
const gameRoomService = require('../service/gameRoomService');
const socketController = require('../controller/socketController');
const { initLogger } = require('../utils/logger');

const logger = initLogger(module);

const getRoom = (joinPin) => gameRoomService.findFromPin(joinPin);

const initSocket = (server) => {
  const io = new SocketServer(server);
  io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: 6379 }));

  // Authenticate connection
  // Will only run once per client-server connection
  io.use((socket, next) => {
    const { token, role } = socket.handshake.query;
    logger.info('Authenticating Client...', { token, role });
    getRoom(token)
      .then((room) => {
        if (!room) {
          logger.warn('Token provided by client was not valid', { token });
          return Promise.reject(new Error('Invalid joinToken'));
        }

        return Promise.resolve(room);
      })
      .then((room) => {
        if (role === 'master') {
          room.update({
            gameMasterID: socket.id
          });
        }
        return next();
      })
      .catch((error) => next(error));
  });

  io.on('connection', (socket) => socketController.handleSocketConnection(io, socket));
};


module.exports = initSocket;
