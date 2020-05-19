import axios from 'axios';

import IdentifierCookie from './cookies/IdentifierCookie';
import Logger from '../utils/Logger';

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

    bumpSession(visitor_id, on_success, on_error) {
        let token = IdentifierCookie.get();
        if (token) {
            this.checkToken({ visitor_id: visitor_id, token: token })
                .then(response => {
                    IdentifierCookie.set(token); // re-up on the expiration
                    if (typeof on_success === 'function') {
                        on_success();
                    }
                })
                .catch(error => {
                    if (!error.isAxiosError) {
                        throw error;
                    }
                    const parsed = this.parseAxiosError(error);
                    if (parsed.code !== 'TOKEN_INVALID') {
                        Logger.alert('Session check failed', { api_error: parsed });
                        if (typeof on_error === 'function') {
                            on_error();
                        }
                    }
                    this.bumpSessionInit(visitor_id, on_success, on_error);
                });
        } else {
            this.bumpSessionInit(visitor_id, on_success, on_error);
        }
    }

    bumpSessionInit(visitor_id, on_success, on_error) {
        this.initSession({ visitor_id: visitor_id })
            .then(response => {
                if (response.data.token) {
                    IdentifierCookie.set(response.data.token);
                    if (typeof on_success === 'function') {
                        on_success();
                    }
                } else {
                    Logger.alert('Session init succeeded without returning a token', { returned: response.data });
                    if (typeof on_error === 'function') {
                        on_error();
                    }
                }
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                const parsed = this.parseAxiosError(error);
                Logger.alert('Session init failed', { api_error: parsed });
                if (typeof on_error === 'function') {
                    on_error();
                }
            });
    }

    initSession(data) {
        return this.getAxios().post('/session/init', data);
    }

    checkToken(data) {
        return this.getAxios().post('/session/check', data);
    }

    recordResponse(data) {
        return this.getAxios().post('/response/record', data);
    }

    checkPrelaunchLogin(data) {
        return this.getAxios().post('/prelaunch/login', data);
    }

    checkPrelaunchToken(data) {
        return this.getAxios().post('/prelaunch/check', data);
    }
}

export default new Api();
