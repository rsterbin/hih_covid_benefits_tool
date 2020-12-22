
// Benefits Tool
export const TOOL_COOKIES_LOADED = 'TOOL_COOKIES_LOADED';
export const TOOL_COOKIES_LOAD_FAILED = 'TOOL_COOKIES_LOAD_FAILED';
export const ANSWERS_CLEAR = 'ANSWERS_CLEAR';
export const QUESTION_INIT = 'QUESTION_INIT';
export const ANSWERS_UPDATE_STARTED = 'ANSWERS_UPDATE_STARTED';
export const ANSWERS_UPDATE_COMPLETED = 'ANSWERS_UPDATE_COMPLETED';
export const ANSWERS_UPDATE_FAILED = 'ANSWERS_UPDATE_FAILED';
export const ANSWERS_PUSH_STARTED = 'ANSWERS_PUSH_STARTED';
export const ANSWERS_PUSH_COMPLETED = 'ANSWERS_PUSH_COMPLETED';
export const ANSWERS_PUSH_FAILED = 'ANSWERS_PUSH_FAILED';
export const VISITOR_PREFS_STORED = 'VISITOR_PREFS_STORED';

// Prelaunch Login
export const PRELAUNCH_LOGIN_CHECK_STARTED = 'PRELAUNCH_LOGIN_CHECK_STARTED';
export const PRELAUNCH_LOGIN_STARTED = 'PRELAUNCH_LOGIN_STARTED';
export const PRELAUNCH_LOGIN_FAILED = 'PRELAUNCH_LOGIN_FAILED';
export const PRELAUNCH_LOGIN_SUCCEEDED = 'PRELAUNCH_LOGIN_SUCCEEDED';
export const PRELAUNCH_LOGOUT = 'PRELAUNCH_LOGOUT';

// Admin: Auth
export const ADMIN_LOGIN_CHECK_STARTED = 'ADMIN_LOGIN_CHECK_STARTED';
export const ADMIN_LOGIN_STARTED = 'ADMIN_LOGIN_STARTED';
export const ADMIN_LOGIN_FAILED = 'ADMIN_LOGIN_FAILED';
export const ADMIN_LOGIN_SUCCEEDED = 'ADMIN_LOGIN_SUCCEEDED';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';

// Admin: Contacts
export const ADMIN_FETCH_CONTACTS_RAW_STARTED = 'ADMIN_FETCH_CONTACTS_RAW_STARTED';
export const ADMIN_FETCH_CONTACTS_RAW_FAILED = 'ADMIN_FETCH_CONTACTS_RAW_FAILED';
export const ADMIN_FETCH_CONTACTS_RAW_SUCCEEDED = 'ADMIN_FETCH_CONTACTS_RAW_SUCCEEDED';

// Admin: Dashboard
export const ADMIN_DASH_RESPONSES_STARTED = 'ADMIN_DASH_RESPONSES_STARTED';
export const ADMIN_DASH_RESPONSES_FAILED = 'ADMIN_DASH_RESPONSES_FAILED';
export const ADMIN_DASH_RESPONSES_SUCCEEDED = 'ADMIN_DASH_RESPONSES_SUCCEEDED';
export const ADMIN_DASH_CONTACTS_STARTED = 'ADMIN_DASH_CONTACTS_STARTED';
export const ADMIN_DASH_CONTACTS_FAILED = 'ADMIN_DASH_CONTACTS_FAILED';
export const ADMIN_DASH_CONTACTS_SUCCEEDED = 'ADMIN_DASH_CONTACTS_SUCCEEDED';

// Admin: Deploys
export const ADMIN_FETCH_DEPLOYMENTS_STARTED = 'ADMIN_FETCH_DEPLOYMENTS_STARTED';
export const ADMIN_FETCH_DEPLOYMENTS_FAILED = 'ADMIN_FETCH_DEPLOYMENTS_FAILED';
export const ADMIN_FETCH_DEPLOYMENTS_SUCCEEDED = 'ADMIN_FETCH_DEPLOYMENTS_SUCCEEDED';
export const ADMIN_FETCH_DEPLOYMENT_STARTED = 'ADMIN_FETCH_DEPLOYMENT_STARTED';
export const ADMIN_FETCH_DEPLOYMENT_FAILED = 'ADMIN_FETCH_DEPLOYMENT_FAILED';
export const ADMIN_FETCH_DEPLOYMENT_SUCCEEDED = 'ADMIN_FETCH_DEPLOYMENT_SUCCEEDED';
export const ADMIN_OVERLOAD_DEPLOYMENT_STARTED = 'ADMIN_OVERLOAD_DEPLOYMENT_STARTED';
export const ADMIN_OVERLOAD_DEPLOYMENT_FAILED = 'ADMIN_OVERLOAD_DEPLOYMENT_FAILED';
export const ADMIN_OVERLOAD_DEPLOYMENT_SUCCEEDED = 'ADMIN_OVERLOAD_DEPLOYMENT_SUCCEEDED';
export const ADMIN_REPLACE_WITH_DEPLOYMENT_STARTED = 'ADMIN_REPLACE_WITH_DEPLOYMENT_STARTED';
export const ADMIN_REPLACE_WITH_DEPLOYMENT_FAILED = 'ADMIN_REPLACE_WITH_DEPLOYMENT_FAILED';
export const ADMIN_REPLACE_WITH_DEPLOYMENT_SUCCEEDED = 'ADMIN_REPLACE_WITH_DEPLOYMENT_SUCCEEDED';
export const ADMIN_SAVE_NEW_DEPLOYMENT_STARTED = 'ADMIN_SAVE_NEW_DEPLOYMENT_STARTED';
export const ADMIN_SAVE_NEW_DEPLOYMENT_FAILED = 'ADMIN_SAVE_NEW_DEPLOYMENT_FAILED';
export const ADMIN_SAVE_NEW_DEPLOYMENT_SUCCEEDED = 'ADMIN_SAVE_NEW_DEPLOYMENT_SUCCEEDED';

// Admin: Language
export const ADMIN_FETCH_LANG_LIST_STARTED = 'ADMIN_FETCH_LANG_LIST_STARTED';
export const ADMIN_FETCH_LANG_LIST_FAILED = 'ADMIN_FETCH_LANG_LIST_FAILED';
export const ADMIN_FETCH_LANG_LIST_SUCCEEDED = 'ADMIN_FETCH_LANG_LIST_SUCCEEDED';
export const ADMIN_FETCH_LANG_INFO_STARTED = 'ADMIN_FETCH_LANG_INFO_STARTED';
export const ADMIN_FETCH_LANG_INFO_FAILED = 'ADMIN_FETCH_LANG_INFO_FAILED';
export const ADMIN_FETCH_LANG_INFO_SUCCEEDED = 'ADMIN_FETCH_LANG_INFO_SUCCEEDED';
export const ADMIN_HOLD_LANG_TRANSLATION = 'ADMIN_HOLD_LANG_TRANSLATION';
export const ADMIN_SAVE_LANG_INFO_STARTED = 'ADMIN_SAVE_LANG_INFO_STARTED';
export const ADMIN_SAVE_LANG_INFO_FAILED = 'ADMIN_SAVE_LANG_INFO_FAILED';
export const ADMIN_SAVE_LANG_INFO_SUCCEEDED = 'ADMIN_SAVE_LANG_INFO_SUCCEEDED';

// Admin: Responses
export const ADMIN_RESPONSES_STARTED = 'ADMIN_RESPONSES_STARTED';
export const ADMIN_RESPONSES_FAILED = 'ADMIN_RESPONSES_FAILED';
export const ADMIN_RESPONSES_SUCCEEDED = 'ADMIN_RESPONSES_SUCCEEDED';

// Admin: Resources
export const ADMIN_FETCH_RESOURCES_LIST_STARTED = 'ADMIN_FETCH_RESOURCES_LIST_STARTED';
export const ADMIN_FETCH_RESOURCES_LIST_FAILED = 'ADMIN_FETCH_RESOURCES_LIST_FAILED';
export const ADMIN_FETCH_RESOURCES_LIST_SUCCEEDED = 'ADMIN_FETCH_RESOURCES_LIST_SUCCEEDED';
export const ADMIN_REQUEST_RESOURCE_DELETE = 'ADMIN_REQUEST_RESOURCE_DELETE';
export const ADMIN_CANCEL_RESOURCE_DELETE = 'ADMIN_CANCEL_RESOURCE_DELETE';
export const ADMIN_DELETE_RESOURCE_STARTED = 'ADMIN_DELETE_RESOURCE_STARTED';
export const ADMIN_DELETE_RESOURCE_FAILED = 'ADMIN_DELETE_RESOURCE_FAILED';
export const ADMIN_DELETE_RESOURCE_SUCCEEDED = 'ADMIN_DELETE_RESOURCE_SUCCEEDED';
export const ADMIN_DISMISS_DELETE_RESOURCE_MESSAGE = 'ADMIN_DISMISS_DELETE_RESOURCE_MESSAGE';
export const ADMIN_FETCH_RESOURCE_STARTED = 'ADMIN_FETCH_RESOURCE_STARTED';
export const ADMIN_FETCH_RESOURCE_FAILED = 'ADMIN_FETCH_RESOURCE_FAILED';
export const ADMIN_FETCH_RESOURCE_SUCCEEDED = 'ADMIN_FETCH_RESOURCE_SUCCEEDED';
export const ADMIN_SAVE_RESOURCE_STARTED = 'ADMIN_SAVE_RESOURCE_STARTED';
export const ADMIN_SAVE_RESOURCE_FAILED = 'ADMIN_SAVE_RESOURCE_FAILED';
export const ADMIN_SAVE_RESOURCE_SUCCEEDED = 'ADMIN_SAVE_RESOURCE_SUCCEEDED';
export const ADMIN_SAVE_RESOURCE_MSG_DISMISSED = 'ADMIN_SAVE_RESOURCE_MSG_DISMISSED';

// Admin: Results
export const ADMIN_FETCH_RESULTS_LIST_STARTED = 'ADMIN_FETCH_RESULTS_LIST_STARTED';
export const ADMIN_FETCH_RESULTS_LIST_FAILED = 'ADMIN_FETCH_RESULTS_LIST_FAILED';
export const ADMIN_FETCH_RESULTS_LIST_SUCCEEDED = 'ADMIN_FETCH_RESULTS_LIST_SUCCEEDED';
export const ADMIN_CHANGE_RESULTS_FILTER = 'ADMIN_CHANGE_RESULTS_FILTER';
export const ADMIN_FETCH_SCENARIO_STARTED = 'ADMIN_FETCH_SCENARIO_STARTED';
export const ADMIN_FETCH_SCENARIO_FAILED = 'ADMIN_FETCH_SCENARIO_FAILED';
export const ADMIN_FETCH_SCENARIO_SUCCEEDED = 'ADMIN_FETCH_SCENARIO_SUCCEEDED';
export const ADMIN_SAVE_SCENARIO_STARTED = 'ADMIN_SAVE_SCENARIO_STARTED';
export const ADMIN_SAVE_SCENARIO_FAILED = 'ADMIN_SAVE_SCENARIO_FAILED';
export const ADMIN_SAVE_SCENARIO_SUCCEEDED = 'ADMIN_SAVE_SCENARIO_SUCCEEDED';

// Admin: Shared
export const ADMIN_FETCH_BENEFIT_STARTED = 'ADMIN_FETCH_BENEFIT_STARTED';
export const ADMIN_FETCH_BENEFIT_FAILED = 'ADMIN_FETCH_BENEFIT_FAILED';
export const ADMIN_FETCH_BENEFIT_SUCCEEDED = 'ADMIN_FETCH_BENEFIT_SUCCEEDED';
export const ADMIN_FETCH_BENEFITS_LIST_STARTED = 'ADMIN_FETCH_BENEFITS_LIST_STARTED';
export const ADMIN_FETCH_BENEFITS_LIST_FAILED = 'ADMIN_FETCH_BENEFITS_LIST_FAILED';
export const ADMIN_FETCH_BENEFITS_LIST_SUCCEEDED = 'ADMIN_FETCH_BENEFITS_LIST_SUCCEEDED';

