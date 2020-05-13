import CookieBase from '../CookieBase';

class StepCookie extends CookieBase {
    cookieName = 'hnct-step';
    spec = {
        path: '/',
        sameSite: 'strict'
    };
}

export default new StepCookie();
