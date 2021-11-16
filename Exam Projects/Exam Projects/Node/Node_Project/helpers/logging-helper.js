const log4js = require('log4js');
log4js.configure({
    appenders: {
      stdout: { type: 'stdout' },
      stderr: { type: 'stderr' },
      errors: { type: 'file', filename: 'errors.log' },
      fileFilter: { type: 'logLevelFilter', appender: 'errors', level: 'ERROR' },
      stderrFilter: { type: 'logLevelFilter', appender: 'stderr', level: 'ERROR'}

    }, 
    categories: {
      default: { appenders: [ 'fileFilter', 'stderrFilter', 'stdout' ], level: 'DEBUG' }
    }
  });


var logger = log4js.getLogger();

function getLogger()
{
    const applicationLogLevel = process.env.APPLICATION_LOG_LEVEL || '';
    switch(applicationLogLevel.toLowerCase())
    {
        case 'fatal':
        case 'error':
        case 'warn':
        case 'info':
        case 'debug':
        case 'trace':
            logger.level = applicationLogLevel; 
        break;

    }
    return logger;
}




let httpContext = require('express-http-context');
// Wrap Winston logger to print reqId in each log
let formatMessage = function(message) {
    var reqId = httpContext.get('reqId');
	var uname = httpContext.get('user') ? httpContext.get('user') : 'NoName';
    message = `${reqId ? reqId + " " : ""}${uname ? uname + " " : ""}${message}`;
    return message;
};
let logr = {
    log: function(level, message) {
        getLogger().log(level, formatMessage(message));
    },
    error: function(message) {
        getLogger().error(formatMessage(message));
    },
    warn: function(message) {
        getLogger().warn(formatMessage(message));
    },
    info: function(message) {
        getLogger().info(formatMessage(message));
    },
    debug: function(message) {
        getLogger().debug(formatMessage(message));
    },
    trace: function(message) {
        getLogger().trace(formatMessage(message));
    }
};
module.exports = {
	logger: logr
};