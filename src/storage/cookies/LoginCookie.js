import CookieBase from '../CookieBase';

const loginCookie = new CookieBase(
    'hnct-login', // name
    {
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'Strict'
    } // spec
);

export default loginCookie;
