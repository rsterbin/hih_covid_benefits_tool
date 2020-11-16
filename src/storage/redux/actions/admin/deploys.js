import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';
import DeployData from '../../../../data/deployment.json';

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

export const adminFetchDeploymentStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_DEPLOYMENT_STARTED
    };
};

export const adminFetchDeploymentFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_DEPLOYMENT_FAILED,
        error: error
    };
};

export const adminFetchDeploymentSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_FETCH_DEPLOYMENT_SUCCEEDED,
        data: data
    };
};

export const adminOverloadDeploymentStarted = () => {
    return {
        type: actionTypes.ADMIN_OVERLOAD_DEPLOYMENT_STARTED
    };
};

export const adminOverloadDeploymentFailed = (error) => {
    return {
        type: actionTypes.ADMIN_OVERLOAD_DEPLOYMENT_FAILED,
        error: error
    };
};

export const adminOverloadDeploymentSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_OVERLOAD_DEPLOYMENT_SUCCEEDED,
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

export const loadDeployment = (id) => {
    return (dispatch, getState) => {
        if (!id) {
            dispatch(adminFetchDeploymentSucceeded(DeployData));
            return;
        }
        dispatch(adminFetchDeploymentStarted());
        const data = { token: getState().admin.auth.token, id: id };
        Api.getDeploymentInfo(data)
            .then((response) => {
                dispatch(adminFetchDeploymentSucceeded(response.data.deployment));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchDeploymentFailed, '2661',
                    'Could not fetch deployment info');
            });
    };
};

export const overloadDeployment = (id) => {
    return (dispatch, getState) => {
        dispatch(adminOverloadDeploymentStarted());
        const data = { token: getState().admin.auth.token, id: id };

        Api.revertAdmin(data)
            .then(response => {
                const json = JSON.stringify(response.data);
                dispatch(adminOverloadDeploymentSucceeded(json));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminOverloadDeploymentFailed, 'B374',
                    'Could not install deployment');
            });
    };
};

