import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        list: {
            loaded: false,
            error: null,
            data: null
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

