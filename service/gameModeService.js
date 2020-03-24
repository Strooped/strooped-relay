const gameMode = require('../model/gameMode');

const gameModeService = {
  findAll: () => gameMode.findAll(),
  create: (request) => gameMode.create(request)
};

module.exports = gameModeService;
