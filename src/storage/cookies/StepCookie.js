import CookieBase from '../CookieBase';

const stepCookie = new CookieBase(
    'hnct-step', // name
    {
        path: '/',
        sameSite: 'Strict'
    } // spec
);

export default stepCookie;
