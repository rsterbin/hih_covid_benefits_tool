import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminFetchResultsListStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_RESULTS_LIST_STARTED
    };
};

export const adminFetchResultsListFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESULTS_LIST_FAILED,
        error: error
    };
};

export const adminFetchResultsListSucceeded = (benefit, conditions, scenarios, filters) => {
    return {
        type: actionTypes.ADMIN_FETCH_RESULTS_LIST_SUCCEEDED,
        benefit: benefit,
        conditions: conditions,
        scenarios: scenarios,
        filters: filters
    };
};

export const adminChangeResultsFilter = (condition, letter) => {
    return {
        type: actionTypes.ADMIN_CHANGE_RESULTS_FILTER,
        condition: condition,
        letter: letter
    };
};

export const loadResults = (code) => {
    return (dispatch, getState) => {
        dispatch(adminFetchResultsListStarted());
        const data = { token: getState().admin.auth.token };
        Api.getScenarios(code, data)
            .then((response) => {
                if (!response.data.benefit) {
                    dispatch(adminFetchResultsListFailed('That benefit is unknown'));
                } else {
                    const benefit = response.data.benefit;
                    const conditions = response.data.conditions ? response.data.conditions : [];
                    const scenarios = response.data.scenarios ? response.data.scenarios : [];
                    const filters = {};
                    for (const c of conditions) {
                        filters[c.key_name] = null;
                    }
                    dispatch(adminFetchResultsListSucceeded(benefit, conditions, scenarios, filters));
                }
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchResultsListFailed, '423D',
                    'Could not fetch results');
            });
    };
};

