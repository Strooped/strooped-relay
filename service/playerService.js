const Player = require('../model/player');

const playerService = {
  create: (socket, username, gameRoomId) => Player.create({ username, socket, gameRoomId }),
  findFromUsername: async (username, gameRoomId) => Player.findOne({
    where: {
      username,
      gameRoomId
    }
  }),
  incrementScoreIfAnswerCorrect: async (answer, task, player) => {
    if (task.correctAnswer === answer) {
      player.increment('score').then(player.reload());
    }
    return player;
  }
};

module.exports = playerService;
