import path from 'path';
import bunyan from 'bunyan';

const level = process.env.NODE_LOGGING_LEVEL;

const infoLog = bunyan.createLogger({
    name: 'itutor-app-info',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level,
            path: path.resolve(__dirname, '..', '..', '..', 'info.json')
        }
    ]
});

const debLog = bunyan.createLogger({
    name: 'itutor-app-debug',
    streams: [
        {
            level: 'debug',
            path: path.resolve(__dirname, '..', '..', '..', 'debug.json')
        }
    ]
});
  
const errLog = bunyan.createLogger({
    name: 'itutor-app-error',
    streams: [
        {
            level: 'error',
            path: path.resolve(__dirname, '..', '..', '..', 'error.json')
        }
    ]
});
  
debLog.debug('DEBUG LOG STARTED');
errLog.error('ERROR LOG STARTED');

export {
    infoLog,
    debLog,
    errLog,
};