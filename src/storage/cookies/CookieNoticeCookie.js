import CookieBase from '../CookieBase';

class CookieNoticeCookie extends CookieBase {
    cookieName = 'hnct-cookienotice';
    spec = {
        path: '/',
        maxAge: 60 * 60 * 24 * 14,
        sameSite: 'strict'
    };
}

export default new CookieNoticeCookie();
