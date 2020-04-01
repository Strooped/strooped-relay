const gameRoom = require('../model/gameRoom');

const gameRoomService = {
  create: () => gameRoom.create(),
  findAll: () => gameRoom.findAll()
};

module.exports = gameRoomService;
