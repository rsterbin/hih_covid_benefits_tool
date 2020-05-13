import CookieManager from '../utils/CookieManager';

class CookieBase {

    manager = null;
    cookieName = null;
    specs = null;

    constructor() {
        this.manager = CookieManager;
    }

    get() {
        return this.manager.get(this.cookieName);
    }

    set(val) {
        return this.manager.set(this.cookieName, val, this.specs);
    }

    expandData(cookiestring) {
        let cookieobj = {};
        try {
            let buff = new Buffer(cookiestring, 'base64');
            let text = buff.toString('utf8');
            cookieobj = JSON.parse(text);
        } catch (e) {
            console.log('Cookie value was not valid json; starting over');
            return null;
        }
        return cookieobj;
    }

    contractData(cookieobj) {
        const text = JSON.stringify(cookieobj);
        let buff = new Buffer(text);
        return buff.toString('base64');
    }

};

export default CookieBase;

