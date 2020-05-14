import CookieBase from '../CookieBase';

const flagsCookie = new CookieBase(
    'hnct-flags', // name
    {
        path: '/',
        sameSite: 'Strict'
    }, // spec
    true // compressed
);

export default flagsCookie;
