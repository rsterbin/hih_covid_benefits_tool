import CookieBase from '../CookieBase';

const identifierCookie = new CookieBase(
    'hnct-sessionid', // name
    {
        path: '/',
        maxAge: 60 * 10,
        sameSite: 'Strict'
    } // spec
);

export default identifierCookie;
