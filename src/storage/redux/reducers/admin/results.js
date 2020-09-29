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
        },
        info: {
            loaded: false,
            error: null,
            benefit: null,
            scenario: null
        },
        save: {
            processing: false,
            error: null,
            saved: false
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

export const adminFetchScenarioStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        results: updateObject(state.results, {
            info: updateObject(state.results.info, {
                loaded: false,
                error: null,
                benefit: null,
                scenario: null
            })
        })
    }), true);
};

export const adminFetchScenarioFailed = (state, action) => {
    return updateObject(state, {
        results: updateObject(state.results, {
            info: updateObject(state.results.info, {
                loaded: false,
                error: action.error,
                benefit: null,
                scenario: null
            })
        })
    });
};

export const adminFetchScenarioSucceeded = (state, action) => {
    return updateObject(state, {
        results: updateObject(state.results, {
            info: updateObject(state.results.info, {
                loaded: true,
                error: null,
                benefit: action.benefit,
                scenario: action.scenario
            })
        })
    });
};

export const adminSaveScenarioStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        results: updateObject(state.results, {
            save: updateObject(state.results.save, {
                processing: true,
                error: null,
                saved: false
            })
        })
    }), true);
};

export const adminSaveScenarioFailed = (state, action) => {
    return updateObject(state, {
        results: updateObject(state.results, {
            save: updateObject(state.results.save, {
                processing: false,
                error: action.error,
                saved: false
            })
        })
    });
};

export const adminSaveScenarioSucceeded = (state, action) => {
    return updateObject(state, {
        results: updateObject(state.results, {
            save: updateObject(state.results.save, {
                processing: false,
                error: null,
                saved: true
            })
        })
    });
};

