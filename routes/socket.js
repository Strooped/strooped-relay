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
    if (typeof role !== 'undefined' && role === 'master') {
      getRoom(token).then((room) => {
        logger.info('Authenticating Game Master...', { token, room });
        logger.info('RoomId', { room });
        if (!room) {
          logger.warn('Token provided by Game Master was not valid', { token });
          return next(new Error('Invalid joinToken'));
        }
        room.update({
          gameMasterID: socket.id
        });
        return next();
      }, (error) => next(error));
    } else {
      getRoom(token).then((room) => {
        logger.info('Authenticating client...', { token, room });
        logger.info('RoomId', { room });
        if (!room) {
          logger.warn('Token provided by client was not valid', { token });
          return next(new Error('Invalid joinToken'));
        }
        return next();
      }, (error) => next(error));
    }
  });

  io.on('connection', (socket) => socketController.handleSocketConnection(io, socket));
};


module.exports = initSocket;
