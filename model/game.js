const { Model, DataTypes } = require('sequelize');
const { getDbLazy } = require('../repository/database');
const GameMode = require('./gameMode');

const sequelize = getDbLazy();

class Game extends Model {}

Game.init({
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  type: DataTypes.STRING
}, { sequelize, modelName: 'game' });

Game.associate = function associate() {
  Game.hasMany(GameMode);
};

module.exports = Game;
