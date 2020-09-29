import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        listraw: {
            loaded: false,
            error: null,
            data: null
        }
    };
};

export const adminFetchContactsRawStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        contacts: updateObject(state.contacts, {
            listraw: updateObject(state.contacts.listraw, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminFetchContactsRawFailed = (state, action) => {
    return updateObject(state, {
        contacts: updateObject(state.contacts, {
            listraw: updateObject(state.contacts.listraw, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchContactsRawSucceeded = (state, action) => {
    return updateObject(state, {
        contacts: updateObject(state.contacts, {
            listraw: updateObject(state.contacts.listraw, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

