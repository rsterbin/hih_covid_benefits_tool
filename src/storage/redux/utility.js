import { DateTime } from 'luxon';

import Api from '../Api';
import Logger from '../../utils/Logger';
import * as authActions from './actions/admin/auth';

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

export const handleAdminApiError = (dispatch, error, action, lcode, msg) => {
    if (!error.isAxiosError) {
        Logger.alert('Unknown error', { location_code: lcode, error: error });
        dispatch(action(msg));
    } else {
        const parsed = Api.parseAxiosError(error);
        if (parsed.code === 'TOKEN_INVALID') {
            dispatch(authActions.adminLogout(true));
        } else {
            Logger.alert(msg, { api_error: parsed });
            dispatch(action(msg));
        }
    }
};

