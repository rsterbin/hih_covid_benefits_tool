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

    parseAxiosError(error) {
        const info = error.toJSON();
        let context = {
            message: info.message,
            request_url: info.config.baseURL,
            request_data: info.config.data
        };
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            context.status = error.response.status;
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                context: context
            };
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            return {
                code: 'NETWORK_FAILURE',
                message: context.message,
                context: context
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            return {
                code: 'UNKNOWN',
                message: error.message,
                context: context
            };
        }
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
