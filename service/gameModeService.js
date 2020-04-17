const GameMode = require('../model/gameMode');

const gameModeService = {
  findAll: () => GameMode.findAll(),
  findById: (id) => GameMode.findByPk(id),
  create: (request) => GameMode.create(request)
};

module.exports = gameModeService;
