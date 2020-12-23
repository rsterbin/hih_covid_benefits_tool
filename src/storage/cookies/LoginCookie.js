import CookieBase from '../CookieBase';

const loginCookie = new CookieBase(
    'hnct-login', // name
    {
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // keep for a week
        sameSite: 'Strict'
    }, // spec
    true // compressed
);

export default loginCookie;
