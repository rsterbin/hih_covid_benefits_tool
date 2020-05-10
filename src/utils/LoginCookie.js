import CookieManager from './CookieManager';

const LOGIN_COOKIE = 'hnct-prelaunch';

const loginCookie = {

    get: () => {
        return CookieManager.get(LOGIN_COOKIE);
    },

    set: (session_id) => {
        return CookieManager.set(LOGIN_COOKIE, session_id, {
            path: '/',
            maxAge: 60 * 60,
            sameSite: 'strict'
        });
    }

};

export default loginCookie;
