import CookieBase from '../CookieBase';

import QUESTIONS from '../data/questions.json';

class AnswersCookie extends CookieBase {
    cookieName = 'hnct-answers';
    spec = {
        path: '/',
        sameSite: 'strict'
    };

    get() {
        let cookiestring = super.get();
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
    }

    set(val) {
        let cookiestring = super.contractData(val);
        super.set(cookiestring);
    }
}

export default new AnswersCookie();
