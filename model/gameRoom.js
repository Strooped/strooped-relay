const { Model, DataTypes } = require('sequelize');
const GameMode = require('./gameMode');
const Player = require('./player');
const { getDbLazy } = require('../repository/database');

const sequelize = getDbLazy();

class GameRoom extends Model {}

GameRoom.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  joinPin: DataTypes.STRING,
  gameMasterID: DataTypes.STRING,
}, { sequelize, modelName: 'GameRoom' });

GameRoom.belongsTo(GameMode);
GameMode.hasMany(GameRoom);
Player.belongsTo(GameRoom);
GameRoom.hasMany(Player);

module.exports = GameRoom;
