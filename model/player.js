const { Model, DataTypes } = require('sequelize');
const { getDbLazy } = require('../repository/database');

const sequelize = getDbLazy();

class Player extends Model {}

Player.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username: DataTypes.STRING,
  socket: DataTypes.STRING,
  score: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { sequelize, modelName: 'player' });

module.exports = Player;
