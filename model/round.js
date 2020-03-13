const { Model, DataTypes } = require('sequelize');
const Game = require('./game');
const { getDbLazy } = require('../repository/database');

const sequelize = getDbLazy();

class Round extends Model {}

Round.init({
  name: DataTypes.STRING,
}, { sequelize, modelName: 'round' });

// Define our many to many relations
Round.belongsToMany(Game, { through: 'GameRound' });
Game.belongsToMany(Round, { through: 'GameRound' });

module.exports = Round;
