import { DateTime } from 'luxon';
import { shuffle } from '../../../../utils/utils';

import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import Logger from '../../../../utils/Logger';

export const adminDashResponsesStarted = () => {
    return {
        type: actionTypes.ADMIN_DASH_RESPONSES_STARTED
    };
};

export const adminDashResponsesFailed = (error) => {
    return {
        type: actionTypes.ADMIN_DASH_RESPONSES_FAILED,
        error: error
    };
}

export const adminDashResponsesSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_DASH_RESPONSES_SUCCEEDED,
        data: data
    };
}

export const loadDashboardResponses = () => {
    return (dispatch, getState) => {
        dispatch(adminDashResponsesStarted());
        const data = { token: getState().admin.auth.token };
        Api.getRecentResponses(data)
            .then((response) => {
                const found = response.data.recent ? response.data.recent : [];
                const recent = found.map((row) => {
                    let dt = DateTime.fromISO(row.submitted);
                    let formatted = dt.toFormat('LLL dd');
                    return { ...row, date: formatted };
                });
                dispatch(adminDashResponsesSucceeded(recent));
            })
            .catch(error => {
                const msg = 'Could not fetch recent responses';
                if (!error.isAxiosError) {
                    const lcode = '89C8';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    Logger.alert(msg, { api_error: Api.parseAxiosError(error) });
                }
                dispatch(adminDashResponsesFailed(msg));
            });
    };
};

export const adminDashContactsStarted = () => {
    return {
        type: actionTypes.ADMIN_DASH_CONTACTS_STARTED
    };
};

export const adminDashContactsFailed = (error) => {
    return {
        type: actionTypes.ADMIN_DASH_CONTACTS_FAILED,
        error: error
    };
}

export const adminDashContactsSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_DASH_CONTACTS_SUCCEEDED,
        data: data
    };
}

export const adminDashStatsStarted = (key) => {
    return {
        type: actionTypes.ADMIN_DASH_STATS_STARTED,
        key: key
    };
}

export const adminDashStatsFailed = (key, error) => {
    return {
        type: actionTypes.ADMIN_DASH_STATS_FAILED,
        key: key,
        error: error
    };
}

export const adminDashStatsSucceeded = (key, data) => {
    return {
        type: actionTypes.ADMIN_DASH_STATS_SUCCEEDED,
        key: key,
        data: data
    };
}

export const loadDashboardContacts = () => {
    return (dispatch, getState) => {
        dispatch(adminDashContactsStarted());
        const data = { token: getState().admin.auth.token };
        Api.getRecentContacts(data)
            .then((response) => {
                const found = response.data.recent ? response.data.recent : [];
                // I promised not to associate contact info with response data,
                // but at low volume and in order, it's fairly obvious, so
                // shuffle before displaying
                const recent = shuffle(found.map(row => {
                    return {
                        email: row.email,
                        zip: row.zip_code
                    };
                }));
                dispatch(adminDashContactsSucceeded(recent));
            })
            .catch(error => {
                const msg = 'Could not fetch recent contacts';
                if (!error.isAxiosError) {
                    const lcode = '4EC9';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    Logger.alert(msg, { api_error: Api.parseAxiosError(error) });
                }
                dispatch(adminDashContactsFailed(msg));
            });
    };
};

export const loadDashboardStats = (key) => {
    return (dispatch, getState) => {
        dispatch(adminDashStatsStarted(key));
        const data = { token: getState().admin.auth.token };
        Api.getStats(key, data)
            .then((response) => {
                const stats = response.data.stats ? response.data.stats : {};
                dispatch(adminDashStatsSucceeded(key, stats));
            })
            .catch(error => {
                const msg = 'Could not fetch "' + key + '" stats';
                if (!error.isAxiosError) {
                    const lcode = '12C4';
                    Logger.alert('Unknown error', { location_code: lcode, error: error });
                } else {
                    Logger.alert(msg, { api_error: Api.parseAxiosError(error) });
                }
                dispatch(adminDashStatsFailed(key, msg));
            });
    };
};

