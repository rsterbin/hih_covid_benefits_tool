import * as actionTypes from '../actions/actionTypes';
import { updateObject} from '../utility';

const initialState = {
    username: null,
    processing: false,
    token: null,
    error: null
};

const prelaunchLoginStarted = (state, action) => {
    return updateObject(state, {
        username: null,
        processing: false,
        token: null,
        error: null,
    });
};

const prelaunchLoginFailed = (state, action) => {
    return updateObject(state, {
        username: null,
        processing: false,
        token: null,
        error: action.error
    });
};

const prelaunchLoginSucceeded = (state, action) => {
    return updateObject(state, {
        username: action.username,
        processing: false,
        token: action.token,
        error: null
    });
};

const prelaunchLogout = (state, action) => {
    return updateObject(state, {
        username: null,
        processing: false,
        token: null,
        error: null,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PRELAUNCH_LOGIN_STARTED: return prelaunchLoginStarted(state, action);
        case actionTypes.PRELAUNCH_LOGIN_FAILED: return prelaunchLoginFailed(state, action);
        case actionTypes.PRELAUNCH_LOGIN_SUCCEEDED: return prelaunchLoginSucceeded(state, action);
        case actionTypes.PRELAUNCH_LOGOUT: return prelaunchLogout(state, action);
        default: return state;
    }
};

export default reducer;
