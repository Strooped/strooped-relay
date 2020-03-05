const SocketServer = require('socket.io');
const redisAdapter = require('socket.io-redis');
const { initLogger } = require('../utils/logger');

const logger = initLogger(module);

const rooms = {
  // eslint-disable-next-line quote-props
  '223455': 'e92e95f8-71cc-455d-9426-07744ea2b83d',
  // eslint-disable-next-line quote-props
  '102345': 'c4bad8e3-3145-461a-9d28-1e9cacfb856b',
  // eslint-disable-next-line quote-props
  '987931': 'e29cc8f0-16c3-4c23-83ec-41224d77bf8d'
};

const getRoomId = (joinPin) => rooms[joinPin] || null;

const handleSocketConnection = (io, socket) => {
  const { token } = socket.handshake.query;
  logger.info('Client connecting...', { token });

  const roomId = getRoomId(token);

  socket.join(`room-${roomId}`);

  logger.info('Client connected successfully', { token, roomId });

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
    const roomId = getRoomId(token);

    logger.info('Authenticating client...', { token, roomId });

    if (!roomId) {
      logger.warn('Token provided by client was not valid', { token });
      return next(new Error('Invalid joinToken'));
    }

    return next();
  });

  io.on('connection', (socket) => handleSocketConnection(io, socket));
};


module.exports = initSocket;
