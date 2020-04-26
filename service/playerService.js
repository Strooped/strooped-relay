const Player = require('../model/player');

const playerService = {
  create: (socket, username, gameRoomId) => Player.create({ username, socket, gameRoomId }),
  findFromUsername: async (username, gameRoomId) => Player.findOne({
    where: {
      username,
      gameRoomId
    }
  }),
  incrementScoreIfAnswerCorrect: async (answer, task, playerId) => {
    if (task.correctAnswer === answer) {
      Player.increment('score', { where: { id: playerId } });
    }
  }
};

module.exports = playerService;
