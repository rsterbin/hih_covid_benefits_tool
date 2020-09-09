import { DateTime, Interval, Duration } from 'luxon';

import * as actionTypes from '../actionTypes';
import LoginCookie from '../../../cookies/LoginCookie';
import Api from '../../../Api';
import Logger from '../../../../utils/Logger';

const AUTH_STANDARD_USERNAME = 'admin';
const AUTH_REFRESH_ACTIVITY_WINDOW_MINUTES = 5;
const AUTH_TIMEOUT_SAFETY_WINDOW = { seconds: 10 };

// Synchronous action creators

export const adminLoginCheckStarted = () => {
    return {
        type: actionTypes.ADMIN_LOGIN_CHECK_STARTED
    };
};

export const adminLoginStarted = () => {
    return {
        type: actionTypes.ADMIN_LOGIN_STARTED
    };
};

export const adminLoginFailed = (error) => {
    return {
        type: actionTypes.ADMIN_LOGIN_FAILED,
        error: error
    };
};

export const adminLoginSucceeded = (username, token) => {
    return {
        type: actionTypes.ADMIN_LOGIN_SUCCEEDED,
        username: username,
        token: token
    };
};

export const adminLogout = (auto) => {
    return {
        type: actionTypes.ADMIN_LOGOUT,
        timed_logout: auto
    };
};

// Asynchronous action creators

export const checkAdminAuthState = () => {
    return (dispatch, getState) => {
        dispatch(adminLoginCheckStarted());

        let auth = LoginCookie.get();

        // No cookie? We're logged out
        if (!auth) {
            dispatch(adminLogout(false));
            return;
        }

        // Not expired? We're logged in
        const exp = auth.exp_date ? DateTime.fromISO(auth.exp_date) : null;
        const now = DateTime.local();
        if (exp !== null && exp > now) {
            dispatch(adminLoginSucceeded(auth.username, auth.token));
            const remaining = Interval.fromDateTimes(now, exp);
            dispatch(delayedAuthCheck(remaining.length('milliseconds'), auth.refresh_token));
            return;
        }

        // Has the user been active in the last five minutes? If so, try a refresh
        const activity = getState().admin.last_active;
        const i = Interval.fromDateTimes(activity, now);
        if (i.length('minutes') <= AUTH_REFRESH_ACTIVITY_WINDOW_MINUTES) {
            dispatch(refreshAdminSession(auth.refresh_token));
            return;
        }

        // Otherwise, timed-logout
        dispatch(adminLogout(true));
    };
};

export const delayedAuthCheck = (remaining, refresh_token) => {
    return (dispatch, getState) => {
        setTimeout(() => {
            // Has the user been active in the last five minutes? If so, try a refresh
            const now = DateTime.local();
            const activity = getState().admin.last_active;
            const i = Interval.fromDateTimes(activity, now);
            if (i.length('minutes') <= AUTH_REFRESH_ACTIVITY_WINDOW_MINUTES) {
                dispatch(refreshAdminSession(refresh_token));
                return;
            }
            // Otherwise, timed-logout
            dispatch(adminLogout(true));
        }, remaining);
    };
};

export const refreshAdminSession = (refresh_token) => {
    return (dispatch) => {
        Api.checkAdminToken({ token: refresh_token })
            .then(response => {
                const new_exp = DateTime.fromISO(response.data.expires);
                if (new_exp.isValid) {
                    LoginCookie.set({
                        username: AUTH_STANDARD_USERNAME,
                        token: refresh_token,
                        refresh_token: refresh_token,
                        exp_date: new_exp.minus(Duration.fromObject(AUTH_TIMEOUT_SAFETY_WINDOW))
                    });
                    dispatch(adminLoginSucceeded(AUTH_STANDARD_USERNAME, refresh_token));
                } else {
                    Logger.alert('Admin auth check is not returning a valid expiration date', {
                        invalid_code: new_exp.invalidReason,
                        invalid_msg: new_exp.invalidExplanation,
                        response_data: response.data
                    });
                    dispatch(adminLogout(true));
                }
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    const lcode = '48D1';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    const parsed = Api.parseAxiosError(error);
                    if (parsed.code !== 'TOKEN_INVALID') {
                        Logger.alert('Admin session check failed', { api_error: parsed });
                    }
                }
                dispatch(adminLogout(true));
            });
    };
};

export const authenticateAdmin = (username, password) => {
    return dispatch => {
        dispatch(adminLoginStarted());
        const data = { username: username, password: password };
        Api.checkAdminLogin(data)
            .then(response => {
                const new_exp = DateTime.fromISO(response.data.expires);
                if (response.data.token && new_exp.isValid) {
                    LoginCookie.set({
                        username: AUTH_STANDARD_USERNAME,
                        token: response.data.token,
                        refresh_token: response.data.token,
                        exp_date: new_exp.minus(Duration.fromObject(AUTH_TIMEOUT_SAFETY_WINDOW))
                    });
                    dispatch(adminLoginSucceeded(AUTH_STANDARD_USERNAME, response.data.token));
                } else if (!new_exp.isValid) {
                    Logger.alert('Admin login is not returning a valid expiration date', {
                        invalid_code: new_exp.invalidReason,
                        invalid_msg: new_exp.invalidExplanation,
                        response_data: response.data
                    });
                    dispatch(adminLoginFailed('Admin login is not returning a valid expiration date'));
                } else {
                    Logger.alert('Admin login succeeded without returning a token', { returned: response.data });
                    dispatch(adminLoginFailed('Admin login is not returning a token'));
                }
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    const lcode = '2B25';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    const parsed = Api.parseAxiosError(error);
                    if (parsed.code !== 'LOGIN_INCORRECT' &&
                        parsed.code !== 'USERNAME_REQUIRED' &&
                        parsed.code !== 'PASSWORD_REQUIRED') {
                        Logger.alert('Admin login failed', { api_error: parsed });
                    }
                }
                dispatch(adminLoginFailed('Admin login failed'));
            });
    };
};

export const manualAdminLogout = () => {
    return (dispatch, getState) => {
        Api.adminLogout({ token: getState().admin.auth.token })
            .then(response => {
                dispatch(adminLogout(false));
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    const lcode = '2B25';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    const parsed = Api.parseAxiosError(error);
                    Logger.alert('Admin logout failed', { api_error: parsed });
                }
                dispatch(adminLogout(false));
            })
    };
};

