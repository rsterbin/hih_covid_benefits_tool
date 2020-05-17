import CookieBase from '../CookieBase';

import Questions from '../../logic/Questions';

let answersCookieFilter = (cookieobj) => {
    return Questions.filterAnswers(cookieobj);
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
