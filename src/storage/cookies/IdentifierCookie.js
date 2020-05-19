import CookieBase from '../CookieBase';

const identifierCookie = new CookieBase(
    'hnct-sessionid', // name
    {
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'Strict'
    } // spec
);

export default identifierCookie;
