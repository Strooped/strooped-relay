const { Model, DataTypes } = require('sequelize');
const { getDbLazy } = require('../repository/database');
const Game = require('./game');

const sequelize = getDbLazy();

class GameMode extends Model {}

GameMode.init({
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  difficulty: DataTypes.INTEGER
}, { sequelize, modelName: 'gameMode' });
GameMode.associate = function associate() {
  GameMode.belongsTo(Game);
};

module.exports = GameMode;
