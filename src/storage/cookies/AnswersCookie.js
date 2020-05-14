import CookieBase from '../CookieBase';

import QUESTIONS from '../../data/questions.json';

let answersCookieFilter = (cookieobj) => {
    let answers = {};
    if (cookieobj !== null) {
        for (const key of Object.keys(QUESTIONS.spec)) {
            if (cookieobj[key] in QUESTIONS.spec[key].a) {
                answers[key] = cookieobj[key];
            }
        }
    }
    return answers;
};

const answersCookie = new CookieBase(
    'hnct-answers', // name
    {
        path: '/',
        sameSite: 'Strict'
    }, // spec
    true, // compressed
    answersCookieFilter // filter function
);

export default answersCookie;
