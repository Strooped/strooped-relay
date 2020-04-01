const router = require('express').Router();

const gameRoomController = require('../controller/gameRoomController');

router.get('/', gameRoomController.gameRoomList);

router.get('/develop', gameRoomController.generateGameRooms);

module.exports = router;
