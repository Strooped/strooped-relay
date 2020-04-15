const gameRoom = require('../model/gameRoom');
const pinGenerator = require('./pinGenerator');
const gameModeService = require('./gameModeService');

const gameRoomService = {
  create: () => gameRoom.create({ joinPin: pinGenerator.generate() }),
  findAll: () => gameRoom.findAll(),
  createFromGame: async (gameModeId) => {
    const game = await gameModeService.findById(gameModeId).then((gameMode) => gameMode.getGame());
    return gameRoom.create({ joinPin: pinGenerator.generate(), gameId: game.id });
  },
  findFromPin: async (pin) => gameRoom.findOne({
    where: {
      joinPin: pin
    }
  }),
  findById: async (id) => gameRoom.findOne({
    where: {
      id
    }
  })
};

module.exports = gameRoomService;
