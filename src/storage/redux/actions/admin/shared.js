import * as actionTypes from '../actionTypes';
import Api from '../../../Api';
import { handleAdminApiError } from '../../utility';

export const adminFetchBenefitStarted = (code) => {
    return {
        type: actionTypes.ADMIN_FETCH_BENEFIT_STARTED,
        code: code
    };
};

export const adminFetchBenefitFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_BENEFIT_FAILED,
        error: error
    };
}

export const adminFetchBenefitSucceeded = (data, code) => {
    return {
        type: actionTypes.ADMIN_FETCH_BENEFIT_SUCCEEDED,
        data: data,
        code: code
    };
}

export const adminFetchBenefitsListStarted = () => {
    return {
        type: actionTypes.ADMIN_FETCH_BENEFITS_LIST_STARTED
    };
};

export const adminFetchBenefitsListFailed = (error) => {
    return {
        type: actionTypes.ADMIN_FETCH_BENEFITS_LIST_FAILED,
        error: error
    };
};

export const adminFetchBenefitsListSucceeded = (data) => {
    return {
        type: actionTypes.ADMIN_FETCH_BENEFITS_LIST_SUCCEEDED,
        data: data
    };
};

export const loadBenefit = (code) => {
    return (dispatch, getState) => {
        dispatch(adminFetchBenefitStarted(code));
        const data = { token: getState().admin.auth.token };
        Api.getBenefitInfo(code, data)
            .then((response) => {
                if (!response.data.benefit) {
                    dispatch(adminFetchBenefitFailed('That benefit is unknown'));
                } else {
                    dispatch(adminFetchBenefitSucceeded(response.data.benefit, code));
                }
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchBenefitFailed, '40E9',
                    'Could not fetch benefit ' + code);
            });
    };
};

export const loadBenefitsList = () => {
    return (dispatch, getState) => {
        dispatch(adminFetchBenefitsListStarted());
        const data = { token: getState().admin.auth.token };
        Api.getBenefits(data)
            .then((response) => {
                const benefits = response.data.benefits ? response.data.benefits : [];
                dispatch(adminFetchBenefitsListSucceeded(benefits));
            })
            .catch(error => {
                handleAdminApiError(dispatch, error, adminFetchBenefitsListFailed, '8D10',
                    'Could not fetch benefits list');
            });
    };
};

