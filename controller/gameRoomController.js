const GameRoomService = require('../service/gameRoomService');

async function gameRoomList(req, res) {
  const gameRoom = await GameRoomService.findAll();
  res.json(gameRoom);
}

async function generateGameRooms(req, res) {
  const gameRoom = await GameRoomService.create();
  res.status(201).json(gameRoom);
}

module.exports = { gameRoomList, generateGameRooms };
