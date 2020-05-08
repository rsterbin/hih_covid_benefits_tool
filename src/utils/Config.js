class Config {

    constructor() {
        this.fetched = false;
        this.vals = {};
    }

    bootstrap() {
        if (this.fetched) {
            return;
        }
        if (typeof(process.env.STORAGE_BASE_URL) === 'undefined') {
            console.log('Storage endpoint is missing');
            return;
        }
        this.vals.storage_base_url = process.env.STORAGE_BASE_URL;
        this.vals.env_flag = process.env.HNCT_ENV;
        this.fetched = true;
    }

    get(key) {
        if (!this.fetched) {
            this.bootstrap();
        }
        return this.vals[key];
    }
}

export default new Config();
