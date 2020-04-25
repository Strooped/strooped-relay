const gameRoomService = require('./gameRoomService');
const playerService = require('./playerService');
const { initLogger } = require('../utils/logger');

const logger = initLogger(module);

const gameMasterConnection = async (io, socket) => {
  const { token } = socket.handshake.query;
  const room = await gameRoomService.findFromPin(token);
  const roomId = room.id;

  logger.info('Game master connecting...', { token });

  if (!roomId) {
    logger.warn('Token provided by Game Master was not valid', { token });
    throw new Error('Invalid joinToken');
  }

  socket.join(`room-${roomId}`);

  logger.info('Game Master connected successfully', { token, roomId });

  socket.on('task:start', (task) => {
    logger.info('task:start', { socketMessage: task, roomId });
    socket.to(`room-${roomId}`).emit('task:start', { task });
    room.update({
      currentTaskId: task.id
    });
  });

  socket.on('task:ending', () => {
    logger.info('task:ending', { roomId });
    socket.to(`room-${roomId}`).emit('task:ending');
  });

  socket.on('round:ending', () => {
    logger.info('round:ending', { roomId });
    room.getPlayers().then((players) => {
      players.sort((prev, next) => prev.score - next.score)
        .forEach((playerObj, index) => {
          io.to(playerObj.socket).emit('round:ending', { player: playerObj, placement: index + 1 });
        });
    });
  });

  socket.on('game:start', (game) => {
    logger.info('game:start', { socketMessage: game, roomId });
    socket.to(`room-${roomId}`).emit('game:start', { game });
  });

  socket.on('game:ending', (game) => {
    logger.info('game:ending', { socketMessage: game, roomId });
    room.getPlayers().then((players) => {
      players.sort((prev, next) => prev.score - next.score)
        .forEach((playerObj, index) => {
          io.to(playerObj.socket).emit('round:ending', { player: playerObj, placement: index + 1 });
        });
    });
  });

  socket.on('disconnect', () => {
    logger.info('Game Master disconnected', { roomId });
  });
};

const clientConnection = async (io, socket) => {
  const { token, username } = socket.handshake.query;

  logger.info('Client connecting...', { token });
  const room = await gameRoomService.findFromPin(token);
  const roomId = room.id;

  const gameMasterSocketId = room.gameMasterID;

  if (!roomId) {
    logger.warn('Token provided by client was not valid', { token });
    throw new Error('Invalid joinToken');
  }

  socket.join(`room-${roomId}`);

  logger.info('Client connected successfully', { token, roomId });

  let player = await playerService.findFromUsername(username, roomId);
  logger.info('Player from DB', { player });
  if (player === null) {
    player = await playerService.create(socket.id, username, roomId);
    logger.info('New player created', { player, token });
  }

  io.to(gameMasterSocketId).emit('player:joined', { player });

  socket.on('task:answer', async (payload) => {
    const task = await room.getCurrentTask();
    logger.info('task:answer', {
      socketMessage: payload, gameMasterSocketId, task, room
    });

    player = playerService.incrementScoreIfAnswerCorrect(payload.answer, task, player);
    io.to(gameMasterSocketId).emit('task:answer', { payload, player });
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { roomId });
  });
};

module.exports = { gameMasterConnection, clientConnection };
