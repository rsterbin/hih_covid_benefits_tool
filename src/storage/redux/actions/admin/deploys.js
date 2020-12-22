import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

import DeployData from '../../../../data/deployment.json';
import BenefitsData from '../../../../data/benefits.json';
import ConditionsData from '../../../../data/conditions.json';
import CtaData from '../../../../data/cta.json';
import LangEnData from '../../../../data/lang_en.json';
import LangKeysData from '../../../../data/lang_keys.json';
import ResourcesData from '../../../../data/resources.json';
import ScenariosData from '../../../../data/scenarios.json';

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

export const adminReplaceWithDeploymentStarted = () => {
    return {
        type: actionTypes.ADMIN_REPLACE_WITH_DEPLOYMENT_STARTED
    };
};

export const adminReplaceWithDeploymentFailed = (error) => {
    return {
        type: actionTypes.ADMIN_REPLACE_WITH_DEPLOYMENT_FAILED,
        error: error
    };
};

export const adminReplaceWithDeploymentSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_REPLACE_WITH_DEPLOYMENT_SUCCEEDED,
        data: data
    };
};

export const adminSaveNewDeploymentStarted = () => {
    return {
        type: actionTypes.ADMIN_SAVE_NEW_DEPLOYMENT_STARTED
    };
};

export const adminSaveNewDeploymentFailed = (error) => {
    return {
        type: actionTypes.ADMIN_SAVE_NEW_DEPLOYMENT_FAILED,
        error: error
    };
};

export const adminSaveNewDeploymentSucceeded = (data, info) => {
    return {
        type: actionTypes.ADMIN_SAVE_NEW_DEPLOYMENT_SUCCEEDED,
        data: data,
        info: info
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

export const replaceDatabaseWithCurrentDeployment = () => {
    return (dispatch, getState) => {
        dispatch(adminReplaceWithDeploymentStarted());
        const data = {
            token: getState().admin.auth.token,
            deployment: DeployData,
            alldata: {
                benefits: BenefitsData,
                conditions: ConditionsData,
                cta: CtaData,
                lang_en: LangEnData,
                lang_keys: LangKeysData,
                resources: ResourcesData,
                scenarios: ScenariosData
            }
        };
        Api.replaceAdmin(data)
            .then(response => {
                const json = JSON.stringify(response.data);
                dispatch(adminReplaceWithDeploymentSucceeded(json));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminReplaceWithDeploymentFailed, 'A13F',
                    'Could not replace database with current deployment');
            });
    };
};

export const saveNewDeployment = () => {
    return (dispatch, getState) => {
        dispatch(adminSaveNewDeploymentStarted());
        const data = { token: getState().admin.auth.token };
        Api.deployAdmin(data)
            .then(response => {
                const json = JSON.stringify(response.data);
                const download_info = response.data;
                dispatch(adminSaveNewDeploymentSucceeded(json, download_info));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminSaveNewDeploymentFailed, '53A8',
                    'Could not replace save new deployment');
            });
    };
};

