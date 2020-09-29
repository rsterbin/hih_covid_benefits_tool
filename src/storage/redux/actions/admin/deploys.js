import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminFetchDeploymentsStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_DEPLOYMENTS_STARTED
    };
};

export const adminFetchDeploymentsFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_DEPLOYMENTS_FAILED,
        error: error
    };
};

export const adminFetchDeploymentsSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_FETCH_DEPLOYMENTS_SUCCEEDED,
        data: data
    };
};

export const loadDeployments = () => {
    return (dispatch, getState) => {
        dispatch(adminFetchDeploymentsStarted());
        const data = { token: getState().admin.auth.token };
        Api.getAllDeploys(data)
            .then((response) => {
                const deploys = response.data.all ? response.data.all : [];
                dispatch(adminFetchDeploymentsSucceeded(deploys));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchDeploymentsFailed, 'BA7A',
                    'Could not fetch deployments list');
            });
    };
};

