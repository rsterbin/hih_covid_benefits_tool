import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        benefit: {
            loaded: false,
            error: null,
            data: null,
            code: null
        },
        benefits: {
            loaded: false,
            error: null,
            data: null
        }
    };
};

export const adminFetchBenefitStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        shared: updateObject(state.shared, {
            benefit: updateObject(state.shared.benefit, {
                loaded: false,
                error: null,
                data: null,
                code: action.code
            })
        })
    }), true);
};

export const adminFetchBenefitFailed = (state, action) => {
    return updateObject(state, {
        shared: updateObject(state.shared, {
            benefit: updateObject(state.shared.benefit, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchBenefitSucceeded = (state, action) => {
    return updateObject(state, {
        shared: updateObject(state.shared, {
            benefit: updateObject(state.shared.benefit, {
                loaded: true,
                error: null,
                data: action.data,
                code: action.code
            })
        })
    });
};


export const adminFetchBenefitsListStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        shared: updateObject(state.shared, {
            benefits: updateObject(state.shared.benefits, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminFetchBenefitsListFailed = (state, action) => {
    return updateObject(state, {
        shared: updateObject(state.shared, {
            benefits: updateObject(state.shared.benefits, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchBenefitsListSucceeded = (state, action) => {
    return updateObject(state, {
        shared: updateObject(state.shared, {
            benefits: updateObject(state.shared.benefits, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

