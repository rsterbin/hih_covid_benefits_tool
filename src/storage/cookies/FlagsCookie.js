import CookieBase from '../CookieBase';

class FlagsCookie extends CookieBase {
    cookieName = 'hnct-flags';
    spec = {
        path: '/',
        sameSite: 'strict'
    };

    get() {
        let cookiestring = super.get();
        if (typeof cookiestring === 'undefined') {
            return {};
        }
        const cookieobj = this.expandData(cookiestring);
        return cookieobj === null ? {} : cookieobj;
    }

    set(val) {
        let cookiestring = super.contractData(val);
        super.set(cookiestring);
    }
}

export default new FlagsCookie();
