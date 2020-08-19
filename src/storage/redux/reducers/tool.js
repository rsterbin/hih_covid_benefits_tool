import * as actionTypes from '../actions/actionTypes';
import { updateObject} from '../utility';

const initialState = {
    visitor_id: null,
    visitor_prefs: null,
    answers: null,
    visitor_id_loaded: false,
    visitor_fetch_error: null,
    answers_loaded: false,
    answers_fetch_error: null,
    answers_push_error: false,
    step_saved: false,
    answers_update_error: false,
    loaded: false,
    error: null
};

const setLoaded = (state) => {
    let newState = state;
    if (state.visitor_id_loaded && state.answers_loaded) {
        newState = updateObject(state, { loaded: true });
    } else {
        newState = updateObject(state, { loaded: false });
    }
    return newState;
};

const visitorFetchStarted = (state, action) => {
    return setLoaded(updateObject(state, { visitor_id_loaded: false }));
};

const visitorFetchComplete = (state, action) => {
    let newState = updateObject(state, {
        visitor_id_loaded: true,
        visitor_id: action.visitor_id,
        visitor_prefs: action.visitor_prefs
    });
    return setLoaded(newState);
};

const visitorFetchFailed = (state, action) => {
    return setLoaded(updateObject(state, {
        visitor_id_loaded: true,
        visitor_fetch_error: action.error
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
        answers_fetch_error: action.error
    }));
};

const answersClear = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers: {}
    }));
};

const questionInit = (state, action) => {
    // The action includes the current step in its payload, but I don't think we actually need that
    return updateObject(state, {
        step_saved: false,
        answers_push_error: false
    });
};

const answersPushStarted = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: false,
        answers_push_error: false,
        step_saved: false
    }));
};

const answersPushCompleted = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers_push_error: false,
        answers: action.answers,
        step_saved: true
    }));
};

const answersPushFailed = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers_push_error: true,
        step_saved: false
    }));
};

const answersUpdateStarted = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: false,
        answers_update_error: false
    }));
};

const answersUpdateCompleted = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers_update_error: false,
        answers: action.answers
    }));
};

const answersUpdateFailed = (state, action) => {
    return setLoaded(updateObject(state, {
        answers_loaded: true,
        answers_update_error: true
    }));
};

const visitorPrefsStored = (state, action) => {
    return updateObject(state, {
        visitor_prefs: action.visitor_prefs
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.VISITOR_FETCH_STARTED: return visitorFetchStarted(state, action);
        case actionTypes.VISITOR_FETCH_COMPLETE: return visitorFetchComplete(state, action);
        case actionTypes.VISITOR_FETCH_FAILED: return visitorFetchFailed(state, action);
        case actionTypes.ANSWERS_FETCH_STARTED: return answersFetchStarted(state, action);
        case actionTypes.ANSWERS_FETCH_COMPLETE: return answersFetchComplete(state, action);
        case actionTypes.ANSWERS_FETCH_FAILED: return answersFetchFailed(state, action);
        case actionTypes.ANSWERS_CLEAR: return answersClear(state, action);
        case actionTypes.QUESTION_INIT: return questionInit(state, action);
        case actionTypes.ANSWERS_PUSH_STARTED: return answersPushStarted(state, action);
        case actionTypes.ANSWERS_PUSH_COMPLETED: return answersPushCompleted(state, action);
        case actionTypes.ANSWERS_PUSH_FAILED: return answersPushFailed(state, action);
        case actionTypes.ANSWERS_UPDATE_STARTED: return answersUpdateStarted(state, action);
        case actionTypes.ANSWERS_UPDATE_COMPLETED: return answersUpdateCompleted(state, action);
        case actionTypes.ANSWERS_UPDATE_FAILED: return answersUpdateFailed(state, action);
        case actionTypes.VISITOR_PREFS_STORED: return visitorPrefsStored(state, action);
        default: return state;
    }
};

export default reducer;
