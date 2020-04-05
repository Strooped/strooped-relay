const gameRoom = require('../model/gameRoom');
const pinGenerator = require('./pinGenerator');

const gameRoomService = {
  create: () => gameRoom.create({ joinPin: pinGenerator.generate() }),
  findAll: () => gameRoom.findAll()
};

module.exports = gameRoomService;
