const GameModeService = require('../service/gameModeService');

async function gameModeList(req, res) {
  const gameModes = await GameModeService.findAll();
  res.json(gameModes);
}

async function generateGameModes(req, res) {
  const gameMode = await GameModeService.create({ title: 'test1', description: 'Test game-mode', difficulty: 1 }, { fields: ['title', 'description', 'difficulty'] });
  res.status(201).json(gameMode);
}

module.exports = { gameModeList, generateGameModes };
