import { DateTime } from 'luxon';

export const updateObject = (base, change) => {
    return {
        ...base,
        ...change
    };
};

export const updateAdminActivity = (state, doUpdate) => {
    return updateObject(state, {
        last_active: doUpdate ? DateTime.local() : state.last_active
    });
};

