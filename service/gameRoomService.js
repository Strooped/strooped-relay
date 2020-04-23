const GameRoom = require('../model/gameRoom');
const GameMode = require('../model/gameMode');
const Game = require('../model/game');
const Round = require('../model/round');
const Task = require('../model/task');
const Player = require('../model/player');
const pinGenerator = require('./pinGenerator');
const gameModeService = require('./gameModeService');

const gameRoomService = {
  create: () => GameRoom.create({ joinPin: pinGenerator.generate() }),
  findAll: () => GameRoom.findAll(),
  createFromGame: async (gameModeId) => gameModeService.findById(gameModeId)
    .then(() => GameRoom.create({ joinPin: pinGenerator.generate(), gameModeId })),
  findFromPin: async (pin) => GameRoom.findOne({
    where: {
      joinPin: pin
    }
  }),
  findById: async (id) => GameRoom.findByPk(id,
    {
      include: [
        {
          model: GameMode,
          attributes: { exclude: ['gameId'] },
          include: [
            { model: Game },
            {
              model: Round,
              include: [{ model: Task, through: { attributes: [] } }],
              through: { attributes: [] }
            }
          ]
        },
        { model: Player }
      ],
      attributes: { exclude: ['gameModeId', 'CurrentTaskId'] }
    }),
};

module.exports = gameRoomService;
