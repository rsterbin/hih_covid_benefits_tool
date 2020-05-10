import CookieManager from './CookieManager';

const VISITOR_COOKIE = 'hnct-visitor';

const visitorCookie = {

    get: () => {
        return CookieManager.get(VISITOR_COOKIE);
    },

    set: (visitor_id) => {
        return CookieManager.set(VISITOR_COOKIE, visitor_id, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'strict'
        });
    }

};

export default visitorCookie;
