const Player = require('../model/player');

const playerService = {
  create: (socket, username, gameRoomId) => Player.create({ username, socket, gameRoomId }),
  findFromUsername: async (username, gameRoomId) => Player.findOne({
    where: {
      username,
      gameRoomId
    }
  }),
};

module.exports = playerService;
