import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminFetchLangListStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_LANG_LIST_STARTED
    };
};

export const adminFetchLangListFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_LANG_LIST_FAILED,
        error: error
    };
}

export const adminFetchLangListSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_FETCH_LANG_LIST_SUCCEEDED,
        data: data
    };
}

export const adminFetchLangInfoStarted = (key) => {
    return {
        type: actionTypes.ADMIN_FETCH_LANG_INFO_STARTED,
        key: key
    };
};

export const adminFetchLangInfoFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_LANG_INFO_FAILED,
        error: error
    };
};

export const adminFetchLangInfoSucceeded = (data, text) => {
    return {
        type: actionTypes.ADMIN_FETCH_LANG_INFO_SUCCEEDED,
        data: data,
        text: text
    };
};

export const adminHoldLangEditingText = (text) => {
    return {
        type: actionTypes.ADMIN_HOLD_LANG_TRANSLATION,
        text: text
    };
};

export const adminSaveLangInfoStarted = () => {
    return {
        type: actionTypes.ADMIN_SAVE_LANG_INFO_STARTED
    };
};

export const adminSaveLangInfoFailed = (error) => {
    return {
        type: actionTypes.ADMIN_SAVE_LANG_INFO_FAILED,
        error: error
    };
};

export const adminSaveLangInfoSucceeded = () => {
    return {
        type: actionTypes.ADMIN_SAVE_LANG_INFO_SUCCEEDED
    };
};

export const loadLangList = () => {
    return (dispatch, getState) => {
        dispatch(adminFetchLangListStarted());
        const data = { token: getState().admin.auth.token };
        Api.getAllLanguage(data)
            .then((response) => {
                const all = response.data.all ? response.data.all : [];
                dispatch(adminFetchLangListSucceeded(all));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchLangListFailed, '4CBE',
                    'Could not fetch language list');
            });
    };
};

export const loadLangInfo = (key) => {
    return (dispatch, getState) => {
        dispatch(adminFetchLangInfoStarted(key));
        const data = { token: getState().admin.auth.token, key: key };
        Api.getLanguageInfo(data)
            .then((response) => {
                dispatch(adminFetchLangInfoSucceeded(response.data.info, response.data.en));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchLangInfoFailed, '9429',
                    'Could not fetch language info for ' + key);
            });
    };
};

export const saveLangInfo = () => {
    return (dispatch, getState) => {
        dispatch(adminSaveLangInfoStarted());
        const data = {
            token: getState().admin.auth.token,
            key: getState().admin.language.current.key,
            language: getState().admin.language.current.lang,
            translation: getState().admin.language.current.text
        };
        Api.saveTranslation(data)
            .then((response) => {
                dispatch(adminSaveLangInfoSucceeded());
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminSaveLangInfoFailed, '7FBD',
                    'Could not fetch save language');
            });
    };
};

