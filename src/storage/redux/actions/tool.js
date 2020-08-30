import * as actionTypes from './actionTypes';
import { updateObject} from '../utility';
import AnswersCookie from '../../cookies/AnswersCookie';
import Questions from '../../../logic/Questions';
import VisitorPrefs from '../../../logic/VisitorPrefs';
import Logger from '../../../utils/Logger';

export const toolCookiesLoaded = (visitorId, prefs, answers) => {
    return {
        type: actionTypes.TOOL_COOKIES_LOADED,
        visitor_id: visitorId,
        visitor_prefs: prefs,
        answers: answers
    };
};

export const toolCookiesLoadFailed = (error) => {
    return {
        type: actionTypes.TOOL_COOKIES_LOAD_FAILED,
        error: error
    };
};

export const loadToolData = () => {
    return dispatch => {
        let found = VisitorPrefs.fetchFromCookie();
        if (found.error) {
            dispatch(toolCookiesLoadFailed(found.error));
        } else {
            let answers = AnswersCookie.get();
            if (!answers) {
                answers = {};
            }
            dispatch(toolCookiesLoaded(found.id, found.prefs, answers));
        }
    };
};

export const answersClear = () => {
    AnswersCookie.set({});
    return {
        type: actionTypes.ANSWERS_CLEAR
    };
};

export const questionInit = (step) => {
    return {
        type: actionTypes.QUESTION_INIT,
        step: step
    };
};

export const answersPushStarted = () => {
    return {
        type: actionTypes.ANSWERS_PUSH_STARTED
    };
};

export const answersPushCompleted = (answers) => {
    return {
        type: actionTypes.ANSWERS_PUSH_COMPLETED,
        answers: answers
    };
};

export const answersPushFailed = () => {
    return {
        type: actionTypes.ANSWERS_PUSH_FAILED
    };
};

export const answerPush = (qcode, letter) => {
    if (!Questions.validAnswer(qcode, letter)) {
        Logger.warn('Request to push unknown question/answer pair ' + qcode + '/' + letter);
        return (dispatch, getState) => {
            dispatch(answersPushFailed());
        };
    }
    return (dispatch, getState) => {
        dispatch(answersPushStarted());
        let newAnswers = updateObject(getState().answers, { [qcode]: letter });
        AnswersCookie.set(newAnswers);
        dispatch(answersPushCompleted(newAnswers));
    };
};

export const answersUpdateStarted = () => {
    return {
        type: actionTypes.ANSWERS_UPDATE_STARTED
    };
};

export const answersUpdateCompleted = (answers) => {
    return {
        type: actionTypes.ANSWERS_UPDATE_COMPLETED,
        answers: answers
    };
};

export const answersUpdateFailed = () => {
    return {
        type: actionTypes.ANSWERS_UPDATE_FAILED
    };
};

export const answerSave = (qcode, letter) => {
    if (!Questions.validAnswer(qcode, letter)) {
        Logger.warn('Request to save unknown question/answer pair ' + qcode + '/' + letter);
        return (dispatch, getState) => {
            dispatch(answersUpdateFailed());
        };
    }
    return (dispatch, getState) => {
        dispatch(answersUpdateStarted());
        let newAnswers = updateObject(getState().answers, { [qcode]: letter });
        AnswersCookie.set(newAnswers);
        dispatch(answersUpdateCompleted(newAnswers));
    };
};

export const visitorPrefsStored = (prefs) => {
    return {
        type: actionTypes.VISITOR_PREFS_STORED,
        visitor_prefs: prefs
    };
};

export const cookiePrefsSave = (prefs) => {
    return dispatch => {
        let stored = VisitorPrefs.save(prefs);
        dispatch(visitorPrefsStored(stored));
    };
};

