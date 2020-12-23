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

export const adminFetchScenarioStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_SCENARIO_STARTED
    };
};

export const adminFetchScenarioFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_SCENARIO_FAILED,
        error: error
    };
};

export const adminFetchScenarioSucceeded = (benefit, scenario) => {
    return {
        type: actionTypes.ADMIN_FETCH_SCENARIO_SUCCEEDED,
        benefit: benefit,
        scenario: scenario
    };
};

export const adminSaveScenarioStarted = () => {
    return {
        type: actionTypes.ADMIN_SAVE_SCENARIO_STARTED
    };
};

export const adminSaveScenarioFailed = (error) => {
    return {
        type: actionTypes.ADMIN_SAVE_SCENARIO_FAILED,
        error: error
    };
};

export const adminSaveScenarioSucceeded = () => {
    return {
        type: actionTypes.ADMIN_SAVE_SCENARIO_SUCCEEDED
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

export const loadScenario = (benefit, id) => {
    return (dispatch, getState) => {
        dispatch(adminFetchScenarioStarted());
        const data = { token: getState().admin.auth.token };
        Api.getScenario(benefit, id, data)
            .then((response) => {
                if (!response.data.benefit || !response.data.scenario) {
                    dispatch(adminFetchScenarioFailed('That scenario is unknown'));
                } else {
                    const benefit = response.data.benefit;
                    const scenario = response.data.scenario;
                    dispatch(adminFetchScenarioSucceeded(benefit, scenario));
                }
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchScenarioFailed, 'B029',
                    'Could not fetch scenario');
            });
    };
};

export const saveScenario = (benefit, id, form) => {
    return (dispatch, getState) => {
        dispatch(adminSaveScenarioStarted());
        const data = { ...form, token: getState().admin.auth.token };
        Api.saveScenario(benefit, id, data)
            .then((response) => {
                dispatch(adminSaveScenarioSucceeded());
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminSaveScenarioFailed, '1229',
                    'Could not save scenario');
            });
    };
};

