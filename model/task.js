const { Model, DataTypes } = require('sequelize');
const { getDbLazy } = require('../repository/database');
const Round = require('./round');
const TaskType = require('./enum/taskTypes');

const sequelize = getDbLazy();

class Task extends Model {}

Task.init({
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.values(TaskType)]
    }
  },
  buttons: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  correctAnswer: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'task' });

Task.belongsToMany(Round, { through: 'taskRound' });
Round.belongsToMany(Task, { through: 'taskRound' });

module.exports = Task;
