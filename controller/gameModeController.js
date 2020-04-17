const gameModeService = require('../service/gameModeService');

async function gameModeList(req, res) {
  const gameModes = await gameModeService.findAll();
  res.json(gameModes);
}

async function generateGameModes(req, res) {
  const gameMode = await gameModeService.create({ title: 'test1', description: 'Test game-mode', difficulty: 1 }, { fields: ['title', 'description', 'difficulty'] });
  res.status(201).json(gameMode);
}

module.exports = { gameModeList, generateGameModes };
