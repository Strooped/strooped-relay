const router = require('express').Router();

const gameRoomController = require('../controller/gameRoomController');

router.get('/', gameRoomController.gameRoomList);
router.post('/', gameRoomController.createGameRoomFromGame);
router.get('/develop', gameRoomController.generateGameRooms);
router.get('/:roomId', gameRoomController.getGameById);

module.exports = router;
