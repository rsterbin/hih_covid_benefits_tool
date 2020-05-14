import CookieBase from '../CookieBase';

const cookieNoticeCookie = new CookieBase(
    'hnct-cookienotice', // name
    {
        path: '/',
        maxAge: 60 * 60 * 24 * 14,
        sameSite: 'Strict'
    } // spec
);

export default cookieNoticeCookie;
