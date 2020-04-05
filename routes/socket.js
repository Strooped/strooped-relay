const SocketServer = require('socket.io');
const redisAdapter = require('socket.io-redis');
const gameRoomService = require('../service/gameRoomService');
const { initLogger } = require('../utils/logger');

const logger = initLogger(module);

const getRoom = (joinPin) => Promise.resolve(gameRoomService.findFromPin(joinPin));

const handleSocketConnection = (io, socket) => {
  const { token } = socket.handshake.query;
  logger.info('Client connecting...', { token });

  const roomId = Promise.resolve(getRoom(token)).then((room) => {
    if (!room) {
      logger.warn('Token provided by client was not valid', { token });
      return new Error('Invalid joinToken');
    }

    socket.join(`room-${room.id}`);

    logger.info('Client connected successfully', { token, room });
    return room.id;
  });

  setTimeout(() => {
    io.emit('hello', 'to all clients');
    // Simulate that the game-master started a game in a game room using

    io
      .to(`room-${roomId}`)
      .emit('game:start', { roomId, message: 'Game-master has started the game' });

    // Check which clients are connected to this room
    io.in(`room-${roomId}`).clients((err, clients) => {
      logger.info('Clients in room', { roomId, clients });
    });
  }, 10000);

  // const interval = setInterval(() => {
  //   console.log('Notifying all listeners');
  //   io.emit('master:notify', { message: `Hello ${count}` })
  //   count++;
  // }, 3000);

  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });

  socket.on('game message', (msg) => {
    logger.info('Game message', { socketMessage: msg });
  });
};

const initSocket = (server) => {
  const io = new SocketServer(server);
  io.adapter(redisAdapter({ host: 'redis', port: 6379 }));

  // Authenticate connection
  // Will only run once per client-server connection
  io.use((socket, next) => {
    const { token } = socket.handshake.query;
    Promise.resolve(getRoom(token)).then((room) => {
      logger.info('Authenticating client...', { token, room });
      logger.info('RoomId', { room });
      if (!room) {
        logger.warn('Token provided by client was not valid', { token });
        return next(new Error('Invalid joinToken'));
      }
      return next();
    }, (error) => next(error));
  });

  io.on('connection', (socket) => handleSocketConnection(io, socket));
};


module.exports = initSocket;
