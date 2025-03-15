// Se utiliza Chalk considerando la exportación default si existe
const chalkImport = require('chalk');
const chalkInstance = chalkImport.default ? chalkImport.default : chalkImport;
const { blue, red, green } = chalkInstance;

const getTimestamp = () => new Date().toISOString();

const logger = {
  info: (message) =>
    console.log(blue(`[INFO ${getTimestamp()}]`), message),
  error: (message) =>
    console.error(red(`[ERROR ${getTimestamp()}]`), message),
  debug: (message) =>
    console.debug(green(`[DEBUG ${getTimestamp()}]`), message),
};

module.exports = logger;