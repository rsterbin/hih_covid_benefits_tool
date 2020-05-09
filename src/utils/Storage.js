import axios from 'axios';
import Cookies from 'universal-cookie';

const VISITOR_COOKIE = 'hnct-visitor';
const STATE_COOKIE = 'hnct-state';
const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/v1.0' : 'http://localhost2:3001/api/v1.0';

class Storage {

    // This will be created when it's needed
    cookies = null;

    // This will be created when it's needed
    axiosInstance = null;

    getCookies() {
        if (this.cookies === null) {
            this.cookies = new Cookies();
        }
        return this.cookies;
    }

    loadState(allowedAnswers) {

        // Grab cookie values
        let visitor_id = this.getCookies().get(VISITOR_COOKIE);
        if (!visitor_id) {
            return null;
        }
        let cookiestring = this.getCookies().get(STATE_COOKIE);
        if (!cookiestring) {
            return { visitor_id: visitor_id };
        }

        // Parse and sanity check
        let cookiestate = {};
        try {
            let buff = new Buffer(cookiestring, 'base64');
            let text = buff.toString('utf8');
            cookiestate = JSON.parse(text);
        } catch (e) {
            console.log('Cookie value was not valid json; starting over');
            return null;
        }
        if (!cookiestate.visitor_id) {
            console.log('Cookie did not include a visitor ID; starting over');
            return null;
        }
        if (cookiestate.visitor_id !== visitor_id) {
            console.log('Mismatched visitor ID; starting over');
            return null;
        }

        // Clean individual values and return
        let newstate = { visitor_id: visitor_id };
        for (const key of [ 'started', 'completed', 'confirmed' ]) {
            if (typeof(cookiestate[key]) !== 'undefined') {
                newstate[key] = cookiestate[key] ? true : false;
            }
        }
        if (typeof(cookiestate.step) !== 'undefined' &&
            !isNaN(parseInt(cookiestate.step + '')) &&
            cookiestate.step >= 0 &&
            cookiestate.step < Object.keys(allowedAnswers).length) {
            newstate.step = parseInt(cookiestate.step + '');
        }
        if (typeof(cookiestate.answers) === 'object') {
            newstate.answers = {};
            for (const key of Object.keys(allowedAnswers)) {
                if (allowedAnswers[key].includes(cookiestate.answers[key])) {
                    newstate.answers[key] = cookiestate.answers[key];
                }
            }
        }

        return newstate;
    }

    saveState(oldstate) {
        this.getCookies().set(VISITOR_COOKIE, oldstate.visitor_id, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'strict'
        });
        const data = JSON.stringify(oldstate);
        let buff = new Buffer(data);
        const base64data = buff.toString('base64');
        this.getCookies().set(STATE_COOKIE, base64data, {
            path: '/',
            sameSite: 'strict'
        });
    }

    getAxios() {
        if (this.axiosInstance === null) {
            this.axiosInstance = axios.create({
                baseURL: BASE_URL,
            });
        }
        return this.axiosInstance;
    }

    recordResponse(data) {
        return this.getAxios().post('/record', data);
    }

    checkLogin(data) {
        return this.getAxios().post('/login', data);
    }
}

export default new Storage();
