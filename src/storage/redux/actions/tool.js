import { v4 as uuidv4 } from 'uuid';

import * as actionTypes from './actionTypes';
import { updateObject} from '../utility';
import VisitorCookie from '../../cookies/VisitorCookie';
import AnswersCookie from '../../cookies/AnswersCookie';
import Questions from '../../../logic/Questions';
import Logger from '../../../utils/Logger';

export const visitorFetchStarted = () => {
    return { type: actionTypes.VISITOR_FETCH_STARTED };
};

export const visitorFetchComplete = (visitor_id) => {
    console.log('in visitorFetchComplete', visitor_id);
    return {
        type: actionTypes.VISITOR_FETCH_COMPLETE,
        visitor_id: visitor_id
    };
};

export const visitorFetchFailed = (error) => {
    return {
        type: actionTypes.VISITOR_FETCH_FAILED,
        error: error
    };
};

export const visitorFetch = () => {
    return dispatch => {
        dispatch(visitorFetchStarted());
        let visitor_id = VisitorCookie.get();
        if (visitor_id) {
            dispatch(visitorFetchComplete(visitor_id));
        } else {
            visitor_id = uuidv4();
            if (visitor_id) {
                VisitorCookie.set(visitor_id);
                dispatch(visitorFetchComplete(visitor_id));
            } else {
                dispatch(visitorFetchFailed('Could not create a visitor ID'));
            }
        }
    };
};

export const answersFetchStarted = () => {
    return { type: actionTypes.ANSWERS_FETCH_STARTED };
};

export const answersFetchComplete = (answers) => {
    return {
        type: actionTypes.ANSWERS_FETCH_COMPLETE,
        answers: answers
    };
};

export const answersFetchFailed = (error) => {
    return {
        type: actionTypes.ANSWERS_FETCH_FAILED,
        error: error
    };
};

export const answersFetch = () => {
    return dispatch => {
        dispatch(answersFetchStarted());
        let answers = AnswersCookie.get();
        if (answers) {
            dispatch(answersFetchComplete(answers));
        } else {
            dispatch(answersFetchComplete({}));
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

