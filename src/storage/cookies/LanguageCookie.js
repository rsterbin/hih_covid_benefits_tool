import CookieBase from '../CookieBase';

const languageCookie = new CookieBase(
    'hnct-language', // name
    {
        path: '/',
        sameSite: 'Strict'
    } // spec
);

export default languageCookie;
