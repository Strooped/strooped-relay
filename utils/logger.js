const winston = require('winston');
const expressWinston = require('express-winston');

/**
 * Name of the file where some log is called is extremely
 * useful when debugging
 * */
const getModuleFilename = (module) => {
  const { filename } = module;

  // Path where the process is running is not interesting
  // to know in the application's context
  const pwd = process.cwd();
  let localPath = filename.replace(pwd, '');

  // We do not want to confuse reader by thinking that
  // the file is placed on the filesystem root
  if (localPath.startsWith('/')) {
    localPath = localPath.replace('/', '');
  }

  return localPath;
};

/**
 * Custom formatter which gives us the basic request data we want in the logs
 *
 * */
const customFormatter = (entry) => {
  const { url, method } = entry.req || {};
  const { statusCode } = entry.res || {};

  // eslint-disable-next-line no-param-reassign
  delete entry.req;
  // eslint-disable-next-line no-param-reassign
  delete entry.res;

  const newLogEntry = Object.assign(entry, {
    url,
    method
  });

  if (statusCode) {
    newLogEntry.status = statusCode;
  }

  return newLogEntry;
};

const initLogger = (module) => {
  const appName = process.env.SERVICE_NAME || null;

  return winston.createLogger({
    defaultMeta: {
      // These fields are also logged by other ibok services
      app: appName,
      file: getModuleFilename(module)
    },
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        stderrLevels: ['error']
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format(customFormatter)(),
      winston.format.json()
    )
  });
};

const createExpressLogger = (logger) => expressWinston.logger({
  winstonInstance: logger,
  transports: [
    new winston.transports.Console(),
  ],
  metaField: null,
  expressFormat: false,
  meta: true, // optional: control whether you want to log the metadata about the request
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}}',
  colorize: false
});

const createExpressErrorLogger = (logger) => expressWinston.errorLogger({
  winstonInstance: logger,
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    })
  ],
  metaField: null,
  expressFormat: true
});

module.exports = {
  initLogger,
  createExpressLogger,
  createExpressErrorLogger
};
