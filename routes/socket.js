const SocketServer = require('socket.io');
const redisAdapter = require('socket.io-redis');
const gameRoomService = require('../service/gameRoomService');
const { initLogger } = require('../utils/logger');

const logger = initLogger(module);

const getRoom = (joinPin) => gameRoomService.findFromPin(joinPin);

const handleSocketConnection = async (io, socket) => {
  const { token } = socket.handshake.query;
  logger.info('Client connecting...', { token });

  const room = await getRoom(token);
  const roomId = room.id;
  const gameMasterSocketId = room.gameMasterID;


  if (!roomId) {
    logger.warn('Token provided by client was not valid', { token });
    throw new Error('Invalid joinToken');
  }

  socket.join(`room-${roomId}`);

  logger.info('Client connected successfully', { token, roomId });

  io.to(`${gameMasterSocketId}`).emit('player:joined', { player: socket.id });

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

  socket.on('task:start', (task) => {
    logger.info('task:start', { socketMessage: task, roomId });
    socket.to(`room-${roomId}`).emit('task:start', { task });
  });

  socket.on('task:ending', (task) => {
    logger.info('task:ending', { socketMessage: task, roomId });
    socket.to(`room-${roomId}`).emit('task:ending', { task });
  });

  socket.on('task:answer', (answer) => {
    logger.info('task:answer', { socketMessage: answer, roomId, gameMasterSocketId });
    io.to(`${gameMasterSocketId}`).emit('task:answer', { answer, player: socket.id });
  });

  socket.on('game:start', (game) => {
    logger.info('game:start', { socketMessage: game, roomId });
    socket.to(`room-${roomId}`).emit('game:start', { game });
  });

  socket.on('game:ending', (game) => {
    logger.info('game:ending', { socketMessage: game, roomId });
    socket.to(`room-${roomId}`).emit('game:ending', { game });
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { roomId });
  });

  socket.on('game message', (msg) => {
    logger.info('Game message', { socketMessage: msg, roomId });
  });
};

const initSocket = (server) => {
  const io = new SocketServer(server);
  io.adapter(redisAdapter({ host: 'redis', port: 6379 }));

  // Authenticate connection
  // Will only run once per client-server connection
  io.use((socket, next) => {
    const { token } = socket.handshake.query;
    getRoom(token).then((room) => {
      logger.info('Authenticating client...', { token, room });
      logger.info('RoomId', { room });
      if (!room) {
        logger.warn('Token provided by client was not valid', { token });
        return next(new Error('Invalid joinToken'));
      }
      if (!room.gameMasterID) {
        room.update({
          gameMasterID: socket.id
        }).then(() => {});
      }
      return next();
    }, (error) => next(error));
  });

  io.on('connection', (socket) => handleSocketConnection(io, socket));
};


module.exports = initSocket;
