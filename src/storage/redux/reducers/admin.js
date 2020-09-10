import * as actionTypes from '../actions/actionTypes';
import * as auth from './admin/auth';
import * as dashboard from './admin/dashboard';
import * as responses from './admin/responses';

const initialState = {
    auth: auth.getInitialState(),
    dashboard: dashboard.getInitialState(),
    responses: responses.getInitialState(),
    lastActive: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADMIN_LOGIN_CHECK_STARTED: return auth.adminLoginCheckStarted(state, action);
        case actionTypes.ADMIN_LOGIN_STARTED: return auth.adminLoginStarted(state, action);
        case actionTypes.ADMIN_LOGIN_FAILED: return auth.adminLoginFailed(state, action);
        case actionTypes.ADMIN_LOGIN_SUCCEEDED: return auth.adminLoginSucceeded(state, action);
        case actionTypes.ADMIN_LOGOUT: return auth.adminLogout(state, action);
        case actionTypes.ADMIN_DASH_RESPONSES_STARTED: return dashboard.adminDashResponsesStarted(state, action);
        case actionTypes.ADMIN_DASH_RESPONSES_FAILED: return dashboard.adminDashResponsesFailed(state, action);
        case actionTypes.ADMIN_DASH_RESPONSES_SUCCEEDED: return dashboard.adminDashResponsesSucceeded(state, action);
        case actionTypes.ADMIN_DASH_CONTACTS_STARTED: return dashboard.adminDashContactsStarted(state, action);
        case actionTypes.ADMIN_DASH_CONTACTS_FAILED: return dashboard.adminDashContactsFailed(state, action);
        case actionTypes.ADMIN_DASH_CONTACTS_SUCCEEDED: return dashboard.adminDashContactsSucceeded(state, action);
        case actionTypes.ADMIN_RESPONSES_STARTED: return responses.adminResponsesStarted(state, action);
        case actionTypes.ADMIN_RESPONSES_FAILED: return responses.adminResponsesFailed(state, action);
        case actionTypes.ADMIN_RESPONSES_SUCCEEDED: return responses.adminResponsesSucceeded(state, action);
        default: return state;
    }
};

export default reducer;
