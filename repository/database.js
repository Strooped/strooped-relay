const Sequelize = require('sequelize');

const initDb = () => {
  const sequelize = new Sequelize(process.env.POSTGRES_DB, 'postgres', process.env.POSTGRES_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  });

  return sequelize;
};

let databaseConnection = null;

const getDbLazy = () => {
  if (!databaseConnection) {
    databaseConnection = initDb();
  }

  return databaseConnection;
};

module.exports = { getDbLazy };
