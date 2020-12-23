import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        username: null,
        processing: false,
        token: null,
        error: null,
        timed_logout: false
    };
};

export const adminLoginCheckStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        auth: updateObject(state.auth, {
            timed_logout: false
        })
    }), true);
};

export const adminLoginStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        auth: updateObject(state.auth, {
            username: null,
            processing: false,
            token: null,
            error: null,
            timed_logout: false
        })
    }), true);
};

export const adminLoginFailed = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            username: null,
            processing: false,
            token: null,
            error: action.error
        })
    });
};

export const adminLoginSucceeded = (state, action) => {
    return updateObject(state, {
        auth: updateObject(state.auth, {
            username: action.username,
            processing: false,
            token: action.token,
            error: null
        })
    });
};

export const adminLogout = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        auth: updateObject(state.auth, {
            username: null,
            processing: false,
            token: null,
            error: null,
            timed_logout: action.timed_logout
        })
    }), !action.timed_logout);
};

