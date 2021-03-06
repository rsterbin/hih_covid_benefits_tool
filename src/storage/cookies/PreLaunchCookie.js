import CookieBase from '../CookieBase';

const preLaunchCookie = new CookieBase(
    'hnct-prelaunch', // name
    {
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'Strict'
    }, // spec
    true // compressed
);

export default preLaunchCookie;
