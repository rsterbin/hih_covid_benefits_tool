import CookieBase from '../CookieBase';

const visitorCookie = new CookieBase(
    'hnct-visitor', // name
    {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'Strict'
    } // spec
);

export default visitorCookie;
