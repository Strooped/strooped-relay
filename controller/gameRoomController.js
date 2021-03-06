const gameRoomService = require('../service/gameRoomService');

async function listGameRoom(req, res) {
  const gameRoom = await gameRoomService.findAll();
  res.json(gameRoom);
}

async function generateGameRooms(req, res) {
  const gameRoom = await gameRoomService.create();
  res.status(201).json(gameRoom);
}

async function createGameRoomFromGame(req, res) {
  const gameRoom = await gameRoomService.createFromGame(req.body.mode);
  res.status(201).json(gameRoom);
}

async function getGameById(req, res) {
  const gameRoom = await gameRoomService.findById(req.params.roomId);
  res.status(200).json(gameRoom);
}

async function updateGameMode(req, res, next) {
  gameRoomService.findById(req.params.roomId).then((gameRoom) => {
    gameRoom.update({ gameModeId: req.body.mode }).then((value) => {
      value.reload().then((updatedRoom) => {
        res.status(200).json(updatedRoom);
      });
    });
  })
    .catch(next);
}

module.exports = {
  listGameRoom, generateGameRooms, createGameRoomFromGame, getGameById, updateGameMode
};
