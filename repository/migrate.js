const { initLogger } = require('../utils/logger');
const { shuffle } = require('../utils/arrayUtil');

const allColors = require('../public/colors.json');
const basicColors = require('../public/basiccolors.json');
const tertiaryColors = require('../public/tertiarycolors.json');

const Game = require('../model/game');
const GameRoom = require('../model/gameRoom');
const GameMode = require('../model/gameMode');
const Round = require('../model/round');
const Task = require('../model/task');
const Player = require('../model/player');

const { buildColorTask } = require('../utils/color');

const logger = initLogger(module);

/**
 * Does not technically do a migrations, but rather a synchronization
 * (CREATE TABLE IF NOT EXISTS ...)
 * */
const synchronizeTables = async (sequelize) => {
  logger.info('Migrating database tables...');

  return sequelize
    .sync()
    .then(() => {
      logger.info('Migration completed');
    })
    .catch((err) => {
      logger.error('Failed to migrate database', err);
    });
};

const truncateTables = async () => {
  await GameRoom.destroy({ where: {} });
  await GameMode.destroy({ where: {} });
  await Game.destroy({ where: {} });
  await Round.destroy({ where: {} });
  await Task.destroy({ where: {} });
  await Player.destroy({ where: {} });
};

const generateTasksFromColorList = async (colorList) => {
  const tasks = new Array(15)
    .fill(null)
    .map(() => buildColorTask(colorList));

  return Promise.all(tasks.map((task) => task.save())).then((value) => value);
};

const generateRoundsFromDifficulty = async (difficulty) => {
  let colors;
  switch (difficulty) {
    case 1:
      colors = basicColors;
      break;
    case 2:
      colors = [...basicColors, ...tertiaryColors];
      break;
    case 3:
      colors = allColors;
      break;
    default:
      colors = allColors;
      break;
  }
  const rounds = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i of [...Array(difficulty).keys()]) {
    // eslint-disable-next-line no-await-in-loop
    const tasks = await generateTasksFromColorList(colors);
    // eslint-disable-next-line no-await-in-loop
    const round = await new Round({
      name: `Round ${i}`
    }).save();
    // eslint-disable-next-line no-await-in-loop
    await round.setTasks(shuffle(tasks).map((task) => task.id));
    rounds.push(round);
    logger.info('Round generated', { round });
  }
  logger.info('Rounds generated', { rounds });
  return rounds;
};

const populateDatabase = async () => {
  if (process.env.SECONDARY) {
    logger.info('Secondary server, skipping population');
    return;
  }
  const existingGames = await Game.findAll();
  if (existingGames.length > 0) {
    logger.info('Game exists already');
    return;
  }

  const games = await Promise.all(
    [
      new Game({
        title: 'Strooped!',
        description: 'A game based on the psychological consept of the stroop effects'
      })
    ].map((game) => game.save())
  );

  const gameModes = await Promise.all(
    [
      new GameMode({
        title: 'Strooped basic',
        description: 'Strooped but with only primary and secondary colors, this is the easiest version.',
        difficulty: 1
      }),
      new GameMode({
        title: 'Strooped tertiary',
        description: 'Like Strooped basic, but with tertiary colors included, this is version is more difficult.',
        difficulty: 2
      }),
      new GameMode({
        title: 'Strooped classic',
        description: 'Standard strooped where you select the name of the color of the font',
        difficulty: 3
      })
    ].map((gameMode) => gameMode.save())
  );
  await gameModes.forEach((gameMode) => {
    gameMode.setGame(games.map((game) => game.id));
    generateRoundsFromDifficulty(gameMode.difficulty).then((rounds) => {
      gameMode.setRounds(rounds.map((round) => round.id));
      gameMode.save();
    });
  });
};

module.exports = {
  synchronizeTables,
  populateDatabase,
  truncateTables
};
