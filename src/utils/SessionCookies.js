import CookieManager from './CookieManager';

import QUESTIONS from '../data/questions.json';

const ANSWERS_COOKIE = 'hnct-answers';
const FLAGS_COOKIE = 'hnct-flags';
const STEP_COOKIE = 'hnct-step';

class SessionCookies {

    get(key) {
        if (key === 'answers') {
            const cookiestring = CookieManager.get(ANSWERS_COOKIE);
            if (typeof cookiestring === 'undefined') {
                return {};
            }
            const cookieobj = this.expandData(cookiestring);
            let answers = {};
            if (cookieobj !== null) {
                for (const key of Object.keys(QUESTIONS.spec)) {
                    if (cookieobj[key] in QUESTIONS.spec[key].a) {
                        answers[key] = cookieobj[key];
                    }
                }
            }
            return answers;

        } else if (key === 'flags') {
            const cookiestring = CookieManager.get(FLAGS_COOKIE);
            if (typeof cookiestring === 'undefined') {
                return {};
            }
            const cookieobj = this.expandData(cookiestring);
            return cookieobj === null ? {} : cookieobj;

        } else if (key === 'current_step') {
            const val = CookieManager.get(STEP_COOKIE);
            return val;
        }

        return null;
    }

    set(key, val) {
        let cookiename = null;
        let cookiestring = null;
        if (key === 'answers') {
            cookiename = ANSWERS_COOKIE;
            cookiestring = this.contractData(val);
        } else if (key === 'flags') {
            cookiename = FLAGS_COOKIE;
            cookiestring = this.contractData(val);
        } else if (key === 'current_step') {
            cookiename = STEP_COOKIE;
            cookiestring = val;
        }
        if (cookiename !== null) {
            CookieManager.set(cookiename, cookiestring, {
                path: '/',
                sameSite: 'strict'
            });
        }
    }

    expandData(cookiestring) {
        let cookieobj = {};
        try {
            let buff = new Buffer(cookiestring, 'base64');
            let text = buff.toString('utf8');
            cookieobj = JSON.parse(text);
        } catch (e) {
            console.log('Cookie value was not valid json; starting over');
            return null;
        }
        return cookieobj;
    }

    contractData(cookieobj) {
        const text = JSON.stringify(cookieobj);
        let buff = new Buffer(text);
        return buff.toString('base64');
    }

};

export default new SessionCookies();
