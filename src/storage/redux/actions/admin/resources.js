import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminFetchResourcesListStarted = (benefit) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESOURCES_LIST_STARTED,
        benefit: benefit
    };
};

export const adminFetchResourcesListFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESOURCES_LIST_FAILED,
        error: error
    };
};

export const adminFetchResourcesListSucceeded = (data, benefit) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESOURCES_LIST_SUCCEEDED,
        data: data,
        benefit: benefit
    };
};

export const adminRequestResourceDelete = (candidate) => {
    return {
        type: actionTypes.ADMIN_REQUEST_RESOURCE_DELETE,
        candidate: candidate
    };
};

export const adminCancelResourceDelete = () => {
    return {
        type: actionTypes.ADMIN_CANCEL_RESOURCE_DELETE
    };
};

export const adminDeleteResourceStarted = () => {
    return {
        type: actionTypes.ADMIN_DELETE_RESOURCE_STARTED
    };
};

export const adminDeleteResourceFailed = (error) => {
    return {
        type: actionTypes.ADMIN_DELETE_RESOURCE_FAILED,
        error: error
    };
};

export const adminDeleteResourceSucceeded = () => {
    return {
        type: actionTypes.ADMIN_DELETE_RESOURCE_SUCCEEDED
    };
};

export const adminDismissDeleteResourceMessage = () => {
    return {
        type: actionTypes.ADMIN_DISMISS_DELETE_RESOURCE_MESSAGE
    };
};

export const adminFetchResourceStarted = (id) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESOURCE_STARTED,
        id: id
    };
};

export const adminFetchResourceFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESOURCE_FAILED,
        error: error
    };
};

export const adminFetchResourceSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESOURCE_SUCCEEDED,
        data: data
    };
};

export const adminSaveResourceStarted = () => {
    return {
        type: actionTypes.ADMIN_SAVE_RESOURCE_STARTED
    };
};

export const adminSaveResourceFailed = (error) => {
    return {
        type: actionTypes.ADMIN_SAVE_RESOURCE_FAILED,
        error: error
    };
};

export const adminSaveResourceSucceeded = (id) => {
    return {
        type: actionTypes.ADMIN_SAVE_RESOURCE_SUCCEEDED,
        id: id
    };
};

export const adminSaveResourceMsgDismissed = () => {
    return {
        type: actionTypes.ADMIN_SAVE_RESOURCE_MSG_DISMISSED
    };
};

export const loadResourcesList = (benefit) => {
    return (dispatch, getState) => {
        dispatch(adminFetchResourcesListStarted(benefit));
        const data = { token: getState().admin.auth.token };
        Api.getResources(data, benefit)
            .then((response) => {
                const resources = response.data.resources ? response.data.resources : [];
                dispatch(adminFetchResourcesListSucceeded(resources, benefit));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchResourcesListFailed, '56AE',
                    'Could not fetch resources list');
            });
    };
};

export const deleteResource = () => {
    return (dispatch, getState) => {
        dispatch(adminDeleteResourceStarted());
        const data = { token: getState().admin.auth.token, id: getState().admin.resources.delete.candidate.id };
        Api.deleteResource(data)
            .then((response) => {
                dispatch(adminDeleteResourceSucceeded());
                dispatch(loadResourcesList());
            })
            .catch((error) => {
                handleAdminApiError(dispatch, error, adminDeleteResourceFailed, '87B7',
                    'Could not delete resource');
            });
    };
};

export const loadResourceInfo = (id) => {
    return (dispatch, getState) => {
        dispatch(adminFetchResourceStarted(id));
        const data = { token: getState().admin.auth.token };
        Api.getResource(id, data)
            .then((response) => {
                const resource = response.data.resource ? response.data.resource : {};
                dispatch(adminFetchResourceSucceeded(resource));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchResourceFailed, 'BEA2',
                    'Could not fetch resource');
            });
    };
};

export const saveResource = (old, benefits, form) => {
    return (dispatch, getState) => {
        dispatch(adminSaveResourceStarted());

        const data = { token: getState().admin.auth.token, info: {} };
        if (old) {
            data.info.id = old.id;
            data.info.code = old.code;
            data.info.lang_key_text = old.lang_key_text;
            data.info.lang_key_desc = old.lang_key_desc;
        }
        data.info.benefit = null;
        data.info.en_text = form.en_text;
        data.info.en_desc = form.en_desc;
        data.info.links = { en: form.link_en };
        const form_id = form.benefit_id ? parseInt(form.benefit_id) : NaN;
        if (!isNaN(form_id)) {
            for (var b of benefits) {
                if (b.id === form_id) {
                    data.info.benefit = { ...b };
                    break;
                }
            }
        }

        Api.saveResource(data)
            .then((response) => {
                if (old) {
                    dispatch(adminSaveResourceSucceeded(null));
                } else {
                    dispatch(adminSaveResourceSucceeded(response.data.id));
                }
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminSaveResourceFailed, '9DDF',
                    'Could not save resource');
            });
    };
};

