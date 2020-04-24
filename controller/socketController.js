const playerService = require('../service/playerService');
const gameRoomService = require('../service/gameRoomService');
const { initLogger } = require('../utils/logger');

const logger = initLogger(module);

const handleSocketConnection = async (io, socket) => {
  const { token, username, role } = socket.handshake.query;
  const room = await gameRoomService.findFromPin(token);
  const roomId = room.id;
  let player;
  let gameMasterSocketId;
  if (role === 'master') {
    logger.info('Game master connecting...', { token });

    if (!roomId) {
      logger.warn('Token provided by Game Master was not valid', { token });
      throw new Error('Invalid joinToken');
    }

    socket.join(`room-${roomId}`);

    logger.info('Game Master connected successfully', { token, roomId });
  } else {
    logger.info('Client connecting...', { token });

    gameMasterSocketId = room.gameMasterID;

    if (!roomId) {
      logger.warn('Token provided by client was not valid', { token });
      throw new Error('Invalid joinToken');
    }

    socket.join(`room-${roomId}`);

    logger.info('Client connected successfully', { token, roomId });

    player = await playerService.findFromUsername(username, roomId);
    logger.info('Player from DB', { player });
    if (player === null) {
      player = await playerService.create(socket.id, username, roomId);
      logger.info('New player created', { player, token });
    }

    io.to(gameMasterSocketId).emit('player:joined', { player });
  }

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

  socket.on('task:answer', (payload) => {
    logger.info('task:answer', { socketMessage: payload, roomId, gameMasterSocketId });
    const task = room.getCurrentTask();
    player = playerService.incrementScoreIfAnswerCorrect(payload.answer, task, player);
    io.to(gameMasterSocketId).emit('task:answer', { payload, player });
  });

  socket.on('round:ending', () => {
    logger.info('round:ending', { roomId });
    room.getPlayers().then((players) => {
      players.forEach((playerObj) => {
        io.to(playerObj.socket).emit('round:ending', { player: playerObj });
      });
    });
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

module.exports = { handleSocketConnection };
