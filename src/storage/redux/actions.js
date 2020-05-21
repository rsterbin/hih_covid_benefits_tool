import { v4 as uuidv4 } from 'uuid';

import AnswersCookie from '../cookies/AnswersCookie';
import VisitorCookie from '../cookies/VisitorCookie';

export const START_LOAD = 'START_LOAD';
export const LOADED = 'LOADED';
export const SAVE_ANSWER = 'SAVE_ANSWER';
export const CLEAR_ANSWERS = 'CLEAR_ANSWERS';
export const ERROR_ON_LOADING = 'ERROR_ON_LOADING';

export const saveAnswer = (payload) => {
    return {type: SAVE_ANSWER, qcode: payload.qcode, letter: payload.letter};
};

export const clearAnswers = () => {
    return {type: CLEAR_ANSWERS};
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

export const loaded = (payload) => {
    return {type: LOADED, ...payload};
};

