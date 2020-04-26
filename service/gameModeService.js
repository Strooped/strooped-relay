const GameMode = require('../model/gameMode');

const gameModeService = {
  findAll: () => GameMode.findAll(),
  findById: (id) => GameMode.findByPk(id),
  create: (gameMode) => GameMode.create(gameMode)
};

module.exports = gameModeService;
