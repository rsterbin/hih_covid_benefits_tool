import { v4 as uuidv4 } from 'uuid';

import * as actionTypes from './actionTypes';

import AnswersCookie from '../../cookies/AnswersCookie';
import VisitorCookie from '../../cookies/VisitorCookie';

export const loaded = (payload) => {
    return {type: actionTypes.BENEFITS_TOOL_LOADED, ...payload};
};

export const updateAnswers = (answers) => {
    return {type: actionTypes.BENEFITS_TOOL_UPDATE_ANSWERS, answers: answers};
};

export const startLoad = () => {
    return (dispatch) => {
        let prepped = {};
        // Fetch visitor ID from the cookie
        let visitor_id = VisitorCookie.get();
        if (!visitor_id) {
            visitor_id = uuidv4();
            VisitorCookie.set(visitor_id);
        }
        prepped.visitor_id = visitor_id;
        // Fetch answers from the cookie
        prepped.answers = AnswersCookie.get() || {};
        dispatch(loaded(prepped));
    };
};

export const requestClearAnswers = () => {
    return (dispatch) => {
        AnswersCookie.set({});
        dispatch(updateAnswers({}));
    };
};

export const requestSaveAnswer = (payload) => {
    return (dispatch) => {
        let newAnswers = { ...payload.answers };
        newAnswers[payload.qcode] = payload.letter;
        AnswersCookie.set(newAnswers);
        dispatch(updateAnswers(newAnswers));
    };
};

