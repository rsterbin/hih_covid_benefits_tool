import * as actionTypes from '../actions/actionTypes';

import * as auth from './admin/auth';
import * as dashboard from './admin/dashboard';
import * as deploys from './admin/deploys';
import * as contacts from './admin/contacts';
import * as language from './admin/language';
import * as resources from './admin/resources';
import * as responses from './admin/responses';
import * as results from './admin/results';
import * as shared from './admin/shared';

const initialState = {
    auth: auth.getInitialState(),
    contacts: contacts.getInitialState(),
    dashboard: dashboard.getInitialState(),
    deploys: deploys.getInitialState(),
    language: language.getInitialState(),
    resources: resources.getInitialState(),
    responses: responses.getInitialState(),
    results: results.getInitialState(),
    shared: shared.getInitialState(),
    lastActive: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        // Auth
        case actionTypes.ADMIN_LOGIN_CHECK_STARTED: return auth.adminLoginCheckStarted(state, action);
        case actionTypes.ADMIN_LOGIN_STARTED: return auth.adminLoginStarted(state, action);
        case actionTypes.ADMIN_LOGIN_FAILED: return auth.adminLoginFailed(state, action);
        case actionTypes.ADMIN_LOGIN_SUCCEEDED: return auth.adminLoginSucceeded(state, action);
        case actionTypes.ADMIN_LOGOUT: return auth.adminLogout(state, action);

        // Contacts
        case actionTypes.ADMIN_FETCH_CONTACTS_RAW_STARTED: return contacts.adminFetchContactsRawStarted(state, action);
        case actionTypes.ADMIN_FETCH_CONTACTS_RAW_FAILED: return contacts.adminFetchContactsRawFailed(state, action);
        case actionTypes.ADMIN_FETCH_CONTACTS_RAW_SUCCEEDED: return contacts.adminFetchContactsRawSucceeded(state, action);

        // Dashboard
        case actionTypes.ADMIN_DASH_RESPONSES_STARTED: return dashboard.adminDashResponsesStarted(state, action);
        case actionTypes.ADMIN_DASH_RESPONSES_FAILED: return dashboard.adminDashResponsesFailed(state, action);
        case actionTypes.ADMIN_DASH_RESPONSES_SUCCEEDED: return dashboard.adminDashResponsesSucceeded(state, action);
        case actionTypes.ADMIN_DASH_CONTACTS_STARTED: return dashboard.adminDashContactsStarted(state, action);
        case actionTypes.ADMIN_DASH_CONTACTS_FAILED: return dashboard.adminDashContactsFailed(state, action);
        case actionTypes.ADMIN_DASH_CONTACTS_SUCCEEDED: return dashboard.adminDashContactsSucceeded(state, action);

        // Deploys
        case actionTypes.ADMIN_FETCH_DEPLOYMENTS_STARTED: return deploys.adminFetchDeploymentsStarted(state, action);
        case actionTypes.ADMIN_FETCH_DEPLOYMENTS_FAILED: return deploys.adminFetchDeploymentsFailed(state, action);
        case actionTypes.ADMIN_FETCH_DEPLOYMENTS_SUCCEEDED: return deploys.adminFetchDeploymentsSucceeded(state, action);
        case actionTypes.ADMIN_FETCH_DEPLOYMENT_STARTED: return deploys.adminFetchDeploymentStarted(state, action);
        case actionTypes.ADMIN_FETCH_DEPLOYMENT_FAILED: return deploys.adminFetchDeploymentFailed(state, action);
        case actionTypes.ADMIN_FETCH_DEPLOYMENT_SUCCEEDED: return deploys.adminFetchDeploymentSucceeded(state, action);
        case actionTypes.ADMIN_OVERLOAD_DEPLOYMENT_STARTED: return deploys.adminOverloadDeploymentStarted(state, action);
        case actionTypes.ADMIN_OVERLOAD_DEPLOYMENT_FAILED: return deploys.adminOverloadDeploymentFailed(state, action);
        case actionTypes.ADMIN_OVERLOAD_DEPLOYMENT_SUCCEEDED: return deploys.adminOverloadDeploymentSucceeded(state, action);
        case actionTypes.ADMIN_REPLACE_WITH_DEPLOYMENT_STARTED: return deploys.adminReplaceWithDeploymentStarted(state, action);
        case actionTypes.ADMIN_REPLACE_WITH_DEPLOYMENT_FAILED: return deploys.adminReplaceWithDeploymentFailed(state, action);
        case actionTypes.ADMIN_REPLACE_WITH_DEPLOYMENT_SUCCEEDED: return deploys.adminReplaceWithDeploymentSucceeded(state, action);
        case actionTypes.ADMIN_SAVE_NEW_DEPLOYMENT_STARTED: return deploys.adminSaveNewDeploymentStarted(state, action);
        case actionTypes.ADMIN_SAVE_NEW_DEPLOYMENT_FAILED: return deploys.adminSaveNewDeploymentFailed(state, action);
        case actionTypes.ADMIN_SAVE_NEW_DEPLOYMENT_SUCCEEDED: return deploys.adminSaveNewDeploymentSucceeded(state, action);

        // Language
        case actionTypes.ADMIN_FETCH_LANG_LIST_STARTED: return language.adminFetchLangListStarted(state, action);
        case actionTypes.ADMIN_FETCH_LANG_LIST_FAILED: return language.adminFetchLangListFailed(state, action);
        case actionTypes.ADMIN_FETCH_LANG_LIST_SUCCEEDED: return language.adminFetchLangListSucceeded(state, action);
        case actionTypes.ADMIN_FETCH_LANG_INFO_STARTED: return language.adminFetchLangInfoStarted(state, action);
        case actionTypes.ADMIN_FETCH_LANG_INFO_FAILED: return language.adminFetchLangInfoFailed(state, action);
        case actionTypes.ADMIN_FETCH_LANG_INFO_SUCCEEDED: return language.adminFetchLangInfoSucceeded(state, action);
        case actionTypes.ADMIN_SAVE_LANG_INFO_STARTED: return language.adminSaveLangInfoStarted(state, action);
        case actionTypes.ADMIN_SAVE_LANG_INFO_FAILED: return language.adminSaveLangInfoFailed(state, action);
        case actionTypes.ADMIN_SAVE_LANG_INFO_SUCCEEDED: return language.adminSaveLangInfoSucceeded(state, action);

        // Responses
        case actionTypes.ADMIN_RESPONSES_STARTED: return responses.adminResponsesStarted(state, action);
        case actionTypes.ADMIN_RESPONSES_FAILED: return responses.adminResponsesFailed(state, action);
        case actionTypes.ADMIN_RESPONSES_SUCCEEDED: return responses.adminResponsesSucceeded(state, action);

        // Resources
        case actionTypes.ADMIN_FETCH_RESOURCES_LIST_STARTED: return resources.adminFetchResourcesListStarted(state, action);
        case actionTypes.ADMIN_FETCH_RESOURCES_LIST_FAILED: return resources.adminFetchResourcesListFailed(state, action);
        case actionTypes.ADMIN_FETCH_RESOURCES_LIST_SUCCEEDED: return resources.adminFetchResourcesListSucceeded(state, action);
        case actionTypes.ADMIN_REQUEST_RESOURCE_DELETE: return resources.adminRequestResourceDelete(state, action);
        case actionTypes.ADMIN_CANCEL_RESOURCE_DELETE: return resources.adminCancelResourceDelete(state, action);
        case actionTypes.ADMIN_DELETE_RESOURCE_STARTED: return resources.adminDeleteResourceStarted(state, action);
        case actionTypes.ADMIN_DELETE_RESOURCE_FAILED: return resources.adminDeleteResourceFailed(state, action);
        case actionTypes.ADMIN_DELETE_RESOURCE_SUCCEEDED: return resources.adminDeleteResourceSucceeded(state, action);
        case actionTypes.ADMIN_DISMISS_DELETE_RESOURCE_MESSAGE: return resources.adminDismissDeleteResourceMessage(state, action);
        case actionTypes.ADMIN_FETCH_RESOURCE_STARTED: return resources.adminFetchResourceStarted(state, action);
        case actionTypes.ADMIN_FETCH_RESOURCE_FAILED: return resources.adminFetchResourceFailed(state, action);
        case actionTypes.ADMIN_FETCH_RESOURCE_SUCCEEDED: return resources.adminFetchResourceSucceeded(state, action);
        case actionTypes.ADMIN_SAVE_RESOURCE_STARTED: return resources.adminSaveResourceStarted(state, action);
        case actionTypes.ADMIN_SAVE_RESOURCE_FAILED: return resources.adminSaveResourceFailed(state, action);
        case actionTypes.ADMIN_SAVE_RESOURCE_SUCCEEDED: return resources.adminSaveResourceSucceeded(state, action);
        case actionTypes.ADMIN_SAVE_RESOURCE_MSG_DISMISSED: return resources.adminSaveResourceMsgDismissed(state, action);

        // Results
        case actionTypes.ADMIN_FETCH_RESULTS_LIST_STARTED: return results.adminFetchResultsListStarted(state, action);
        case actionTypes.ADMIN_FETCH_RESULTS_LIST_FAILED: return results.adminFetchResultsListFailed(state, action);
        case actionTypes.ADMIN_FETCH_RESULTS_LIST_SUCCEEDED: return results.adminFetchResultsListSucceeded(state, action);
        case actionTypes.ADMIN_CHANGE_RESULTS_FILTER: return results.adminChangeResultsFilter(state, action);
        case actionTypes.ADMIN_FETCH_SCENARIO_STARTED: return results.adminFetchScenarioStarted(state, action);
        case actionTypes.ADMIN_FETCH_SCENARIO_FAILED: return results.adminFetchScenarioFailed(state, action);
        case actionTypes.ADMIN_FETCH_SCENARIO_SUCCEEDED: return results.adminFetchScenarioSucceeded(state, action);
        case actionTypes.ADMIN_SAVE_SCENARIO_STARTED: return results.adminSaveScenarioStarted(state, action);
        case actionTypes.ADMIN_SAVE_SCENARIO_FAILED: return results.adminSaveScenarioFailed(state, action);
        case actionTypes.ADMIN_SAVE_SCENARIO_SUCCEEDED: return results.adminSaveScenarioSucceeded(state, action);

        // Shared
        case actionTypes.ADMIN_FETCH_BENEFIT_STARTED: return shared.adminFetchBenefitStarted(state, action);
        case actionTypes.ADMIN_FETCH_BENEFIT_FAILED: return shared.adminFetchBenefitFailed(state, action);
        case actionTypes.ADMIN_FETCH_BENEFIT_SUCCEEDED: return shared.adminFetchBenefitSucceeded(state, action);
        case actionTypes.ADMIN_FETCH_BENEFITS_LIST_STARTED: return shared.adminFetchBenefitsListStarted(state, action);
        case actionTypes.ADMIN_FETCH_BENEFITS_LIST_FAILED: return shared.adminFetchBenefitsListFailed(state, action);
        case actionTypes.ADMIN_FETCH_BENEFITS_LIST_SUCCEEDED: return shared.adminFetchBenefitsListSucceeded(state, action);

        default: return state;
    }
};

export default reducer;
