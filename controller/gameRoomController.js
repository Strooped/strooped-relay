const GameRoomService = require('../service/gameRoomService');

async function gameRoomList(req, res) {
  const gameRoom = await GameRoomService.findAll();
  res.json(gameRoom);
}

async function generateGameRooms(req, res) {
  const gameRoom = await GameRoomService.create();
  res.status(201).json(gameRoom);
}

async function createGameRoomFromGame(req, res) {
  const gameRoom = await GameRoomService.createFromGame(req.body.mode);
  res.status(201).json(gameRoom);
}

async function getGameById(req, res) {
  const gameRoom = await GameRoomService.findById(req.params.roomId);
  res.status(200).json(gameRoom);
}

module.exports = {
  gameRoomList, generateGameRooms, createGameRoomFromGame, getGameById
};
