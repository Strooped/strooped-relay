const Player = require('../model/player');

const playerService = {
  create: (socket, username, roomId) => Player.create({ username, socket, GameRoomId: roomId }),
  findFromUsername: async (username, roomId) => Player.findOne({
    where: {
      username,
      GameRoomId: roomId
    }
  }),
};

module.exports = playerService;
