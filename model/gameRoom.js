const { Model, DataTypes } = require('sequelize');
const Game = require('./game');
const { getDbLazy } = require('../repository/database');

const sequelize = getDbLazy();

class GameRoom extends Model {}

GameRoom.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  joinPin: DataTypes.STRING,
  gameMasterID: DataTypes.STRING,
}, { sequelize, modelName: 'gameroom' });

GameRoom.belongsToMany(Game, { through: 'GameRoomGame' });
Game.belongsToMany(GameRoom, { through: 'GameRoomGame' });

module.exports = GameRoom;
