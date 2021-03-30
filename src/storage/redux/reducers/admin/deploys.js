import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        list: {
            loaded: false,
            error: null,
            data: null
        },
        fetch: {
            loaded: false,
            error: null,
            data: null
        },
        overload: {
            processing: false,
            data: null,
            error: null
        },
        replace: {
            processing: false,
            data: null,
            error: null
        },
        save: {
            processing: false,
            data: null,
            info: null,
            error: null
        },
        compare: {
            avnum: null,
            bvnum: null,
            processing: false,
            error: null,
            data: null,
        }
    };
};

export const adminFetchDeploymentsStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            list: updateObject(state.deploys.list, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminFetchDeploymentsFailed = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            list: updateObject(state.deploys.list, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchDeploymentsSucceeded = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            list: updateObject(state.deploys.list, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminFetchDeploymentStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            fetch: updateObject(state.deploys.fetch, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminFetchDeploymentFailed = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            fetch: updateObject(state.deploys.fetch, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchDeploymentSucceeded = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            fetch: updateObject(state.deploys.fetch, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminOverloadDeploymentStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            overload: updateObject(state.deploys.overload, {
                processing: true,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminOverloadDeploymentFailed = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            overload: updateObject(state.deploys.overload, {
                processing: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminOverloadDeploymentSucceeded = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            overload: updateObject(state.deploys.overload, {
                processing: false,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminReplaceWithDeploymentStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            replace: updateObject(state.deploys.replace, {
                processing: true,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminReplaceWithDeploymentFailed = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            replace: updateObject(state.deploys.replace, {
                processing: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminReplaceWithDeploymentSucceeded = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            replace: updateObject(state.deploys.replace, {
                processing: false,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminSaveNewDeploymentStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            save: updateObject(state.deploys.save, {
                processing: true,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminSaveNewDeploymentFailed = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            save: updateObject(state.deploys.save, {
                processing: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminSaveNewDeploymentSucceeded = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            save: updateObject(state.deploys.save, {
                processing: false,
                error: null,
                data: action.data,
                info: action.info
            })
        })
    });
};

export const adminCompareDeploymentsStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            compare: updateObject(state.deploys.compare, {
                avnum: action.avnum,
                bvnum: action.bvnum,
                processing: true,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminCompareDeploymentsFailed = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            compare: updateObject(state.deploys.compare, {
                processing: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminCompareDeploymentsSucceeded = (state, action) => {
    return updateObject(state, {
        deploys: updateObject(state.deploys, {
            compare: updateObject(state.deploys.compare, {
                processing: false,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminCompareDeploymentsReset = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        deploys: updateObject(state.deploys, {
            compare: updateObject(state.deploys.compare, {
                avnum: null,
                bvnum: null,
                processing: false,
                error: null,
                data: null
            })
        })
    }), true);
};

