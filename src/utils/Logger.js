import Api from '../storage/Api';

const LEVELS = [
    'EMERG',   // Emergency: system is unusable
    'ALERT',   // Alert: action must be taken immediately
    'CRIT',    // Critical: critical conditions
    'ERR',     // Error: error conditions
    'WARN',    // Warning: warning conditions
    'NOTICE',  // Notice: normal but significant condition
    'INFO',    // Informational: informational messages
    'DEBUG'    // Debug: debug messages
];

class Logger {

    cutoffLevel = 0;
    cutoffLevelConsole = 0;
    cutoffLevelApi = 0;

    constructor(level, options) {
        this.cutoffLevel = this.getLevelRank(level ? level : 'WARN');
        let clevel = 'DEBUG';
        if (options && 'console_level' in options) {
            clevel = options.console_level;
        }
        this.cutoffLevelConsole = this.getLevelRank(clevel);
        let alevel = 'ALERT';
        if (options && 'api_level' in options) {
            alevel = options.api_level;
        }
        this.cutoffLevelApi = this.getLevelRank(alevel);
    }

    getLevelRank(level) {
        const levelNum = LEVELS.indexOf[level];
        if (levelNum < 0) {
            this.writeToConsole('WARN', 'Log level ' + level + ' unknown');
        }
        return levelNum;
    }

    emerg(message, context) { this.log('EMERG', message, context); }
    alert(message, context) { this.log('ALERT', message, context); }
    crit(message, context) { this.log('CRIT', message, context); }
    err(message, context) { this.log('ERR', message, context); }
    warn(message, context) { this.log('WARN', message, context); }
    notice(message, context) { this.log('NOTICE', message, context); }
    info(message, context) { this.log('INFO', message, context); }
    debug(message, context) { this.log('DEBUG', message, context); }

    log(level, message, context) {
        if (this.getLevelRank(level) > this.cutoffLevel) {
            return;
        }
        this.writeToConsole(level, message, context);
    }

    writeToConsole(level, message, context) {
        if (this.getLevelRank(level) > this.cutoffLevelConsole) {
            return;
        }
        console.log('[' + level + '] ' + message);
        if (context) {
            console.log(context);
        }
    }

    writeToApi(level, message, context) {
        if (this.getLevelRank(level) > this.cutoffLevelApi) {
            return;
        }
        const data = {
            level: level,
            message: message,
            context: context
        };
        Api.trackError(data)
            .then(response => {
                // Log the response, but ignore it otherwise
                console.log(response);
            })
            .catch(error => {
                // Log the error, but ignore it otherwise
                console.log(error);
            });
    }

}

let logger_settings = {};
if (process.env.NODE_ENV === 'production') {
    logger_settings = {
        level: 'NOTICE',
        options: null
    };
} else {
    logger_settings = {
        level: 'DEBUG',
        options: {
            console_level: 'DEBUG'
        }
    };
}

export default new Logger(logger_settings.level, logger_settings.options);
