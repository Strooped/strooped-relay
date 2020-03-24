const router = require('express').Router();

const gameModeController = require('../controller/gameModeController');

router.get('/', gameModeController.gameModeList);

router.get('/develop', gameModeController.generateGameModes);

module.exports = router;
