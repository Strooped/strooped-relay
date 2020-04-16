const { Model, DataTypes } = require('sequelize');
const GameMode = require('./gameMode');
const { getDbLazy } = require('../repository/database');

const sequelize = getDbLazy();

class Round extends Model {}

Round.init({
  name: DataTypes.STRING,
}, { sequelize, modelName: 'round' });

// Define our many to many relations
Round.belongsToMany(GameMode, { through: 'GameRound' });
GameMode.belongsToMany(Round, { through: 'GameRound' });

module.exports = Round;
