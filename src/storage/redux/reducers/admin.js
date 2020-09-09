import { DateTime } from 'luxon';

import * as actionTypes from '../actions/actionTypes';
import { updateObject} from '../utility';

const initialState = {
    auth: {
        username: null,
        processing: false,
        token: null,
        error: null,
        timed_logout: false
    },
    lastActive: null
};

const adminLoginCheckStarted = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            timed_logout: false
        }),
        last_active: DateTime.local()
    });
};

const adminLoginStarted = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            username: null,
            processing: false,
            token: null,
            error: null,
            timed_logout: false
        }),
        last_active: DateTime.local()
    });
};

const adminLoginFailed = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            username: null,
            processing: false,
            token: null,
            error: action.error
        }),
        last_active: DateTime.local()
    });
};

const adminLoginSucceeded = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            username: action.username,
            processing: false,
            token: action.token,
            error: null
        }),
        last_active: DateTime.local()
    });
};

const adminLogout = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            username: null,
            processing: false,
            token: null,
            error: null,
            timed_logout: action.timed_logout
        }),
        last_active: DateTime.local()
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADMIN_LOGIN_CHECK_STARTED: return adminLoginCheckStarted(state, action);
        case actionTypes.ADMIN_LOGIN_STARTED: return adminLoginStarted(state, action);
        case actionTypes.ADMIN_LOGIN_FAILED: return adminLoginFailed(state, action);
        case actionTypes.ADMIN_LOGIN_SUCCEEDED: return adminLoginSucceeded(state, action);
        case actionTypes.ADMIN_LOGOUT: return adminLogout(state, action);
        default: return state;
    }
};

export default reducer;
