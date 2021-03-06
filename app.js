const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initLogger, createExpressLogger, createExpressErrorLogger } = require('./utils/logger');
const { getDbLazy } = require('./repository/database');
const { synchronizeTables, populateDatabase } = require('./repository/migrate');

const sequelize = getDbLazy();
synchronizeTables(sequelize)
  // .then(() => truncateTables(sequelize))
  .then(() => populateDatabase(sequelize));

const indexRouter = require('./routes/index');
const gameModeRouter = require('./routes/gameMode');
const gameRoomRouter = require('./routes/gameRoom');

const app = express();

const logger = initLogger(module);
logger.info('Application running in environment', { environment: process.env.NODE_ENV });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Allow access from browsers
app.use(cors());

app.use(createExpressLogger(logger));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/v1/game-modes', gameModeRouter);
app.use('/v1/game-rooms', gameRoomRouter);

/**
 * Liveness endpoint for kubernetes health checks
 * */
app.use('/actuator/health', (req, res, next) => {
  // Just a simple query to ensure we can connect to the database
  sequelize.query('SELECT 1')
    .then(() => res.send('OK'))
    .catch((err) => next(err));
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use(createExpressErrorLogger(logger));

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
