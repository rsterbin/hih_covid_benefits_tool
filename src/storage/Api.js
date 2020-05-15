import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/v1.0' : 'http://localhost2:3001/api/v1.0';

class Api {

    // This will be created when it's needed
    axiosInstance = null;

    getAxios() {
        if (this.axiosInstance === null) {
            this.axiosInstance = axios.create({
                baseURL: BASE_URL,
            });
        }
        return this.axiosInstance;
    }

    recordResponse(data) {
        return this.getAxios().post('/response/record', data);
    }

    checkLogin(data) {
        return this.getAxios().post('/prelaunch/login', data);
    }

    checkToken(data) {
        return this.getAxios().post('/prelaunch/check', data);
    }
}

export default new Api();
