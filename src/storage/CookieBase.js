import CookieManager from '../utils/CookieManager';

class CookieBase {

    manager = CookieManager;
    name = null;
    specs = {};
    compressed = false;
    filter = null;

    constructor(name, specs, compressed, filter) {
        this.name = name;
        this.specs = typeof(specs) === 'object' ? specs : {};
        this.compressed = compressed ? true : false;
        this.filter = typeof(filter) === 'function' ? filter : null;
    }

    get() {
        let val = this.manager.get(this.name);
        if (this.compressed) {
            let cookieobj = this.expandData(val);
            if (cookieobj === null) {
                return {};
            }
            val = cookieobj;
        }
        if (this.filter) {
            return this.filter(val);
        }
        return val;
    }

    set(val) {
        if (this.filter) {
            val = this.filter(val);
        }
        if (this.compressed) {
            let cookiestring = this.contractData(val);
            if (cookiestring) {
                val = cookiestring;
            }
        }
        return this.manager.set(this.name, val, this.specs);
    }

    remove() {
        this.manager.remove(this.name);
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

