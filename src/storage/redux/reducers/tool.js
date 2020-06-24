import * as actionTypes from '../actions/actionTypes';
import { updateObject} from '../utility';

const initialState = {
    visitor_id: null,
    answers: null,
    loaded: false,
    visitor_id_loaded: false,
    answers_loaded: false,
    error: null
};

const setLoaded = (state) => {
    console.log('[setLoaded/before]', state);
    let newState = state;
    if (state.visitor_id_loaded && state.answers_loaded) {
        newState = updateObject(state, { loaded: true });
    } else {
        newState = updateObject(state, { loaded: false });
    }
    console.log('[setLoaded/after]', newState);
    return newState;
};

const visitorFetchStarted = (state, action) => {
    return setLoaded(updateObject(state, { visitor_id_loaded: false }));
};

const visitorFetchComplete = (state, action) => {
    console.log('[visitorFetchComplete/before]', state);
    let newState = updateObject(state, {
        visitor_id_loaded: true,
        visitor_id: action.visitor_id
    });
    console.log('[visitorFetchComplete/after]', newState);
    return setLoaded(newState);
};

const visitorFetchFailed = (state, action) => {
    return setLoaded(updateObject(state, {
        visitor_id_loaded: true,
        error: action.error
    }));
};

const answersFetchStarted = (state, action) => {
    return setLoaded(updateObject(state, { answers_loaded: false }));
};

const answersFetchComplete = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers: action.answers
    }));
};

const answersFetchFailed = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        error: action.error
    }));
};

const answersClear = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers: {}
    }));
};

const answersUpdateStarted = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: false
    }));
};

const answersUpdateCompleted = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers: action.answers
    }));
};

const reducer = (state = initialState, action) => {
    console.log('[reducer/before]', state);
    switch (action.type) {
        case actionTypes.VISITOR_FETCH_STARTED: return visitorFetchStarted(state, action);
        case actionTypes.VISITOR_FETCH_COMPLETE: return visitorFetchComplete(state, action);
        case actionTypes.VISITOR_FETCH_FAILED: return visitorFetchFailed(state, action);
        case actionTypes.ANSWERS_FETCH_STARTED: return answersFetchStarted(state, action);
        case actionTypes.ANSWERS_FETCH_COMPLETE: return answersFetchComplete(state, action);
        case actionTypes.ANSWERS_FETCH_FAILED: return answersFetchFailed(state, action);
        case actionTypes.ANSWERS_CLEAR: return answersClear(state, action);
        case actionTypes.ANSWERS_UPDATE_STARTED: return answersUpdateStarted(state, action);
        case actionTypes.ANSWERS_UPDATE_COMPLETED: return answersUpdateCompleted(state, action);
        default: return state;
    }
};

export default reducer;
