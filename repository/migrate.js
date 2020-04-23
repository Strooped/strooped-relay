const { initLogger } = require('../utils/logger');
const { shuffle } = require('../utils/arrayUtil');

const Game = require('../model/game');
const GameRoom = require('../model/gameRoom');
const GameMode = require('../model/gameMode');
const Round = require('../model/round');
const Task = require('../model/task');
const Player = require('../model/player');

const TaskType = require('../model/enum/taskTypes');
const { getRandomSelection } = require('../utils/color');

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


const buildColorTask = () => {
  const buttons = getRandomSelection(4)
    .map(({ color }) => color);

  return new Task({
    buttons,
    type: TaskType.COLOR,
    correctAnswer: shuffle(buttons)[0]
  });
};

const populateDatabase = async () => {
  const existingGames = await Game.findAll();
  if (existingGames.length > 0) {
    logger.info('Game exists already');
    return;
  }

  const tasks = new Array(40)
    .fill(null)
    .map(() => buildColorTask());

  await Promise.all(tasks.map((task) => task.save()));

  const rounds = await Promise.all(
    [
      new Round({
        name: 'Easy peasy'
      }),
      new Round({
        name: 'Somewhat difficult'
      })
    ].map((round) => round.save())
  );

  await Promise.all(rounds.map((round) => {
    round.setTasks(shuffle(tasks)
      .map((task) => task.id));
    return round;
  })
    .map((round) => round.save()));

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
        title: 'Strooped classic',
        description: 'Standard strooped where you select the name of the color of the font',
        difficulty: 1
      })
    ].map((gameMode) => gameMode.save())
  );

  await gameModes[0].setRounds(rounds.map((round) => round.id));
  await gameModes[0].setGame(games.map((game) => game.id));
  await gameModes[0].save();

  const gameRooms = await Promise.all(
    [
      new GameRoom({
        joinPin: '1133456'
      })
    ].map((room) => room.save())
  );

  await gameRooms[0].setGameMode(gameModes.map((gameMode) => gameMode.id));
  await gameRooms[0].save();
};

module.exports = {
  synchronizeTables,
  populateDatabase,
  truncateTables
};
