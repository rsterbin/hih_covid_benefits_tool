import Rollbar from 'rollbar';

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
    cutoffLevelDatabase = 0;
    rollbar = null;
    request = {};

    constructor(level, options) {
        this.cutoffLevel = this.getLevelRank(level ? level : 'WARN');
        let clevel = 'DEBUG';
        if (options && 'console_level' in options) {
            clevel = options.console_level;
        }
        this.cutoffLevelConsole = this.getLevelRank(clevel);
        let alevel = 'ERR';
        if (options && 'api_level' in options) {
            alevel = options.api_level;
        }
        this.cutoffLevelApi = this.getLevelRank(alevel);
        let dlevel = 'ALERT';
        if (options && 'database_level' in options) {
            dlevel = options.database_level;
        }
        this.cutoffLevelDatabase = this.getLevelRank(dlevel);
        this.rollbar = new Rollbar({
            accessToken: '3c1d54fceb0e496d9170a7100d56a69f',
            captureUncaught: true,
            captureUnhandledRejections: true,
            payload: {
                environment: process.env.NODE_ENV
            }
        });
        this.request = {
            url: window.location.pathname + window.location.search,
            method: 'GET',
            route: {
                path: 'No Component Loaded'
            }
        };
    }

    setComponent(component) {
        this.request.route.path = component;
    }

    getLevelRank(level) {
        const levelNum = LEVELS.indexOf(level);
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
        console.log('Logging!', this.request);
        if (this.getLevelRank(level) > this.cutoffLevel) {
            return;
        }
        this.writeToConsole(level, message, context);
        this.writeToApi(level, message, context);
    }

    writeToConsole(level, message, context) {
        if (this.getLevelRank(level) > this.cutoffLevelConsole) {
            return;
        }
        const msg = '[' + level + '] ' + message;
        if (context) {
            console.log(msg, context);
        } else {
            console.log(msg);
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
        if (this.getLevelRank(level) <= this.cutoffLevelDatabase) {
            data.store = true;
        }
        this.writeToRollbar(level, message, context); // TODO: Remove once we're confident local tracking is okay
        Api.trackError(data)
            .then(response => {
                // All is well; ignore
            })
            .catch(error => {
                // We can't handle this on our system; fallback to Rollbar
                console.log('track error failed', error);
                const new_context = { ...context, tracking_error: error };
                this.writeToRollbar(level, message, new_context);
            });
    }

    writeToRollbar(level, message, context) {
        // debug: DEBUG
        if (this.getLevelRank(level) > this.getLevelRank('NOTICE')) {
            this.rollbar.debug(message, this.request, context);
        // info: INFO, NOTICE
        } else if (this.getLevelRank(level) > this.getLevelRank('WARN')) {
            this.rollbar.info(message, this.request, context);
        // warning: WARN
        } else if (this.getLevelRank(level) > this.getLevelRank('ERR')) {
            this.rollbar.warning(message, this.request, context);
        // error: ERR
        } else if (this.getLevelRank(level) > this.getLevelRank('CRIT')) {
            this.rollbar.error(message, this.request, context);
        // critical: CRIT, ALERT, EMERG
        } else {
            this.rollbar.critical(message, this.request, context);
        }
    }

}

let logger_settings = {};
if (process.env.NODE_ENV === 'production') {
    logger_settings = {
        level: 'NOTICE',
        options: {
            console_level: 'NOTICE',
            api_level: 'NOTICE',
            database_level: 'ALERT'
        }
    };
} else {
    logger_settings = {
        level: 'DEBUG',
        options: {
            console_level: 'DEBUG',
            api_level: 'ERR',
            database_level: 'ERR'
        }
    };
}

export default new Logger(logger_settings.level, logger_settings.options);
