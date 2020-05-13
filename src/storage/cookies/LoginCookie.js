import CookieBase from '../CookieBase';

class LoginCookie extends CookieBase {
    cookieName = 'hnct-prelaunch';
    spec = {
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'strict'
    };
}

export default new LoginCookie();
