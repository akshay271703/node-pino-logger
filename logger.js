const pino = require('pino');
const moment = require('moment');
const log = pino({});

log.customError = (error, details = '', LogLevel = process.env.LOG_LEVEL) => {
  const req = global.reqInfo;
  const e = new Error(error);
  const frame = e.stack.split('\n')[2];
  const functionName = frame.split(' ')[5];
  const lineNumber = frame.split(':').reverse()[1];
  const errorInfo = {
    reqInfo: req
      ? {
          req: {
            req: req.method,
            path: req.path,
            body: req.body,
            query: req.query,
          },
          user: req.user
            ? {
                id: req.user.id,
                name: req.user.name,
              }
            : null,
          server: {
            ip: req.ip,
            servertime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        }
      : null,
    functionName,
    lineNumber,
    errorType: 'application error',
    stack: error.stack || e.stack,
    message: error.message || e.message,
    env: process.env.NODE_ENV,
    logLevel: LogLevel,
    process: details,
  };
  switch (LogLevel) {
    case 'info':
      log.info(errorInfo);
      break;
    case 'debug':
      log.debug(errorInfo);
      break;
    case 'warn':
      log.warn(errorInfo);
      break;
    case 'error':
      log.error(errorInfo);
      break;
    default:
      log.error(errorInfo);
  }
};

module.exports = {
  log,
};
