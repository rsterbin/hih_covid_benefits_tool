import * as actionTypes from '../actions/actionTypes';

const initialState = {
    visitor_id: null,
    token: null,
    answers: {},
    loaded: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.BENEFITS_TOOL_LOADED:
            return { ...state,
                started_load: false,
                loaded: true,
                visitor_id: action.visitor_id,
                token: action.token,
                answers: action.answers
            };
        case actionTypes.BENEFITS_TOOL_ERROR_ON_LOADING:
            return { ...state,
                started_load: false,
                loaded: false,
                loading_error: action.error,
                visitor_id: null,
                token: null,
                answers: {}
            };
        case actionTypes.BENEFITS_TOOL_UPDATE_ANSWERS:
            return { ...state, answers: action.answers };
        default: return state;
    }
};

export default reducer;
