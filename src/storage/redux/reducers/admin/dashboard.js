import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        responses: {
            loaded: false,
            error: null,
            data: null
        },
        contacts: {
            loaded: false,
            error: null,
            data: null
        },
        stats: {
            books: {
                loaded: false,
                error: null,
                data: null
            },
            type: {
                loaded: false,
                error: null,
                data: null
            }
        }
    };
};

export const adminDashResponsesStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            responses: updateObject(state.dashboard.responses, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminDashResponsesFailed = (state, action) => {
    return updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            responses: updateObject(state.dashboard.responses, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminDashResponsesSucceeded = (state, action) => {
    return updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            responses: updateObject(state.dashboard.responses, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminDashContactsStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            contacts: updateObject(state.dashboard.contacts, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminDashContactsFailed = (state, action) => {
    return updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            contacts: updateObject(state.dashboard.contacts, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminDashContactsSucceeded = (state, action) => {
    return updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            contacts: updateObject(state.dashboard.contacts, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminDashStatsStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            stats: updateObject(state.dashboard.stats, {
                [action.key]: updateObject(state.dashboard.stats[action.key], {
                    loaded: false,
                    error: null,
                    data: null
                })
            })
        })
    }), true);
};

export const adminDashStatsFailed = (state, action) => {
    return updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            stats: updateObject(state.dashboard.stats, {
                [action.key]: updateObject(state.dashboard.stats[action.key], {
                    loaded: false,
                    error: action.error,
                    data: null
                })
            })
        })
    });
};

export const adminDashStatsSucceeded = (state, action) => {
    return updateObject(state, {
        dashboard: updateObject(state.dashboard, {
            stats: updateObject(state.dashboard.stats, {
                [action.key]: updateObject(state.dashboard.stats[action.key], {
                    loaded: true,
                    error: null,
                    data: action.data
                })
            })
        })
    });
};

