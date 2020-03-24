const router = require('express').Router();

const gameModeController = require('../controller/gameModeController');

router.get('/', gameModeController.game_mode_list);

router.get('/develop', gameModeController.generate_gamemodes);

module.exports = router;
