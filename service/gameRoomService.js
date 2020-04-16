const gameRoom = require('../model/gameRoom');
const gameMode = require('../model/gameMode');
const game = require('../model/game');
const round = require('../model/round');
const task = require('../model/task');
const pinGenerator = require('./pinGenerator');
const gameModeService = require('./gameModeService');

const gameRoomService = {
  create: () => gameRoom.create({ joinPin: pinGenerator.generate() }),
  findAll: () => gameRoom.findAll(),
  createFromGame: async (gameModeId) => {
    const GameMode = await gameModeService.findById(gameModeId);
    return gameRoom.create({ joinPin: pinGenerator.generate(), gameModeId: GameMode.id });
  },
  findFromPin: async (pin) => gameRoom.findOne({
    where: {
      joinPin: pin
    }
  }),
  findById: async (id) => gameRoom.findByPk(id,
    {
      include: [
        {
          model: gameMode,
          attributes: { exclude: ['gameId'] },
          include: [
            { model: game },
            {
              model: round,
              include: [{ model: task, through: { attributes: [] } }],
              through: { attributes: [] }
            }
          ]
        }
      ],
      attributes: { exclude: ['gameModeId'] }
    })
};

module.exports = gameRoomService;
