const gameMode = require('../model/gameMode');

const gameModeService = {
  findAll: () => gameMode.findAll(),
  findById: (id) => gameMode.findByPk(id),
  create: (request) => gameMode.create(request)
};

module.exports = gameModeService;
