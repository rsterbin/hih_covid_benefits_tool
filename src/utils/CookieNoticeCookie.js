import CookieManager from './CookieManager';

const COOKIE_NOTICE_COOKIE = 'hnct-cookienotice';

const cookieNoticeCookie = {

    get: () => {
        return CookieManager.get(COOKIE_NOTICE_COOKIE);
    },

    set: (accepted) => {
        return CookieManager.set(COOKIE_NOTICE_COOKIE, accepted, {
            path: '/',
            maxAge: 60 * 60 * 24 * 14,
            sameSite: 'strict'
        });
    }

};

export default cookieNoticeCookie;
