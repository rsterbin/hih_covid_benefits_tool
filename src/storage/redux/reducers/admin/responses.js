import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        loaded: false,
        error: null,
        data: null
    };
};

export const adminResponsesStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        responses: updateObject(state.responses, {
            loaded: false,
            error: null,
            data: null
        })
    }), true);
};

export const adminResponsesFailed = (state, action) => {
    return updateObject(state, {
        responses: updateObject(state.responses, {
            loaded: false,
            error: action.error,
            data: null
        })
    });
};

export const adminResponsesSucceeded = (state, action) => {
    return updateObject(state, {
        responses: updateObject(state.responses, {
            loaded: true,
            error: null,
            data: action.data
        })
    });
};

