import CookieBase from '../CookieBase';

class VisitorCookie extends CookieBase {
    cookieName = 'hnct-visitor';
    spec = {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'strict'
    };
}

export default new VisitorCookie();
