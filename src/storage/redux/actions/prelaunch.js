import { DateTime, Interval } from 'luxon';

import * as actionTypes from './actionTypes';
import PreLaunchCookie from '../../cookies/PreLaunchCookie';
import Api from '../../Api';
import Logger from '../../../utils/Logger';

const AUTH_STANDARD_USERNAME = 'prelaunch';

// Synchronous action creators

export const prelaunchLoginCheckStarted = () => {
    return {
        type: actionTypes.PRELAUNCH_LOGIN_CHECK_STARTED
    };
};

export const prelaunchLoginStarted = () => {
    return {
        type: actionTypes.PRELAUNCH_LOGIN_STARTED
    };
};

export const prelaunchLoginFailed = (error) => {
    return {
        type: actionTypes.PRELAUNCH_LOGIN_FAILED,
        error: error
    };
};

export const prelaunchLoginSucceeded = (username, token) => {
    return {
        type: actionTypes.PRELAUNCH_LOGIN_SUCCEEDED,
        username: username,
        token: token
    };
};

export const prelaunchLogout = () => {
    return {
        type: actionTypes.PRELAUNCH_LOGOUT
    };
};

// Asynchronous action creators

export const checkPrelaunchAuthState = () => {
    return (dispatch, getState) => {
        dispatch(prelaunchLoginCheckStarted());

        let auth = PreLaunchCookie.get();

        // No cookie? We're logged out
        if (!auth) {
            dispatch(prelaunchLogout(false));
            return;
        }

        // Not expired? We're logged in
        const exp = auth.exp_date ? DateTime.fromISO(auth.exp_date) : null;
        const now = DateTime.local();
        if (exp !== null && exp > now) {
            dispatch(prelaunchLoginSucceeded(auth.username, auth.token));
            const remaining = Interval.fromDateTimes(now, exp);
            dispatch(delayedLogout(remaining.length('milliseconds')));
            return;
        }

        // Otherwise, logout
        dispatch(prelaunchLogout());
    };
};

export const delayedLogout = (remaining) => {
    return (dispatch, getState) => {
        setTimeout(() => {
            dispatch(prelaunchLogout());
        }, remaining);
    };
};

export const authenticatePrelaunch = (username, password) => {
    return dispatch => {
        dispatch(prelaunchLoginStarted());
        const data = { username: username, password: password };
        Api.checkPrelaunchLogin(data)
            .then(response => {
                const new_exp = DateTime.fromISO(response.data.expires);
                if (response.data.token && new_exp.isValid) {
                    PreLaunchCookie.set({
                        username: AUTH_STANDARD_USERNAME,
                        token: response.data.token,
                        exp_date: new_exp
                    });
                    dispatch(prelaunchLoginSucceeded(AUTH_STANDARD_USERNAME, response.data.token));
                    const now = DateTime.local();
                    const remaining = Interval.fromDateTimes(now, new_exp);
                    dispatch(delayedLogout(remaining.length('milliseconds')));
                } else if (!new_exp.isValid) {
                    Logger.alert('Prelaunch login is not returning a valid expiration date', {
                        invalid_code: new_exp.invalidReason,
                        invalid_msg: new_exp.invalidExplanation,
                        response_data: response.data
                    });
                    dispatch(prelaunchLoginFailed('Prelaunch login is not returning a valid expiration date'));
                } else {
                    Logger.alert('Prelaunch login succeeded without returning a token', { returned: response.data });
                    dispatch(prelaunchLoginFailed('Prelaunch login is not returning a token'));
                }
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    const lcode = 'A86F';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    const parsed = Api.parseAxiosError(error);
                    if (parsed.code !== 'LOGIN_INCORRECT' &&
                        parsed.code !== 'USERNAME_REQUIRED' &&
                        parsed.code !== 'PASSWORD_REQUIRED') {
                        Logger.alert('Prelaunch login failed', { api_error: parsed });
                    }
                }
                dispatch(prelaunchLoginFailed('Prelaunch login failed'));
            });
    };
};

export const manualPrelaunchLogout = () => {
    return (dispatch, getState) => {
        Api.prelaunchLogout({ token: getState().prelaunch.auth.token })
            .then(response => {
                dispatch(prelaunchLogout(false));
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    const lcode = 'A263';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    const parsed = Api.parseAxiosError(error);
                    Logger.alert('Prelaunch logout failed', { api_error: parsed });
                }
                dispatch(prelaunchLogout(false));
            })
    };
};

