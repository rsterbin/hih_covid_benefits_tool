import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminFetchContactsRawStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_CONTACTS_RAW_STARTED
    };
};

export const adminFetchContactsRawFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_CONTACTS_RAW_FAILED,
        error: error
    };
};

export const adminFetchContactsRawSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_FETCH_CONTACTS_RAW_SUCCEEDED,
        data: data
    };
};

export const loadContactsRaw = () => {
    return (dispatch, getState) => {
        dispatch(adminFetchContactsRawStarted());
        const data = { token: getState().admin.auth.token };
        Api.getRawContacts(data)
            .then((response) => {
                const contacts = response.data.contacts ? response.data.contacts : [];
                dispatch(adminFetchContactsRawSucceeded(contacts));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchContactsRawFailed, 'EED1',
                    'Could not fetch raw contacts list');
            });
    };
};

