require('dotenv').config();
const { log } = require('./logger');
const printMyError = () => {
  const error = new Error('A custom error is generated generated');
  log.customError(error, 'This was my custom message');
};
printMyError();
