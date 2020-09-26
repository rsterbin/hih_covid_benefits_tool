import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        filter: {
            loaded: false,
            error: null,
            benefit: null,
            conditions: null,
            scenarios: null,
            filters: null
        }
    };
};

export const adminFetchResultsListStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        results: updateObject(state.results, {
            filter: updateObject(state.results.filter, {
                loaded: false,
                error: null,
                benefit: null,
                conditions: null,
                scenarios: null,
                filters: null
            })
        })
    }), true);
};

export const adminFetchResultsListFailed = (state, action) => {
    return updateObject(state, {
        results: updateObject(state.results, {
            filter: updateObject(state.results.filter, {
                loaded: false,
                error: action.error,
                benefit: null,
                conditions: null,
                scenarios: null,
                filters: null
            })
        })
    });
};

export const adminFetchResultsListSucceeded = (state, action) => {
    return updateObject(state, {
        results: updateObject(state.results, {
            filter: updateObject(state.results.filter, {
                loaded: true,
                error: null,
                benefit: action.benefit,
                conditions: action.conditions,
                scenarios: action.scenarios,
                filters: action.filters
            })
        })
    });
};

export const adminChangeResultsFilter = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        results: updateObject(state.results, {
            filter: updateObject(state.results.filter, {
                filters: updateObject(state.results.filter.filters, {
                    [action.condition]: action.letter ? action.letter : null
                })
            })
        })
    }), true);
};

