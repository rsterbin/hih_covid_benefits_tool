import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminResponsesStarted = () => {
    return {
        type: actionTypes.ADMIN_RESPONSES_STARTED
    };
};

export const adminResponsesFailed = (error) => {
    return {
        type: actionTypes.ADMIN_RESPONSES_FAILED,
        error: error
    };
}

export const adminResponsesSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_RESPONSES_SUCCEEDED,
        data: data
    };
}

export const loadResponses = () => {
    return (dispatch, getState) => {
        dispatch(adminResponsesStarted());
        const data = { token: getState().admin.auth.token };
        Api.getAllResponses(data)
            .then((response) => {
                const all = response.data.all ? response.data.all : [];
                dispatch(adminResponsesSucceeded(all));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminResponsesFailed, 'AE50',
                    'Could not fetch responses');
            });
    };
};

