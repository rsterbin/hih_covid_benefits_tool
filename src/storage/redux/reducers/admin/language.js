import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        list: {
            loaded: false,
            error: null,
            data: null
        },
        info: {
            loaded: false,
            error: null,
            data: null,
        },
        current: {
            key: null,
            lang: 'en',
            text: null
        },
        save: {
            processing: false,
            error: null,
            saved: false
        }
    };
};

export const adminFetchLangListStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        language: updateObject(state.language, {
            list: updateObject(state.language.list, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }), true);
};

export const adminFetchLangListFailed = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            list: updateObject(state.language.list, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchLangListSucceeded = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            list: updateObject(state.language.list, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminFetchLangInfoStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        language: updateObject(state.language, {
            info: updateObject(state.language.info, {
                loaded: false,
                error: null,
                data: null,
            }),
            current: updateObject(state.language.current, {
                key: action.key,
                text: null
            })
        })
    }), true);
};

export const adminFetchLangInfoFailed = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            info: updateObject(state.language.info, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchLangInfoSucceeded = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            info: updateObject(state.language.info, {
                loaded: true,
                error: null,
                data: action.data,
            }),
            current: updateObject(state.language.current, {
                text: action.text
            })
        })
    });
};

export const adminHoldLangTranslation = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            current: updateObject(state.language.current, {
                text: action.text
            })
        })
    });
};

export const adminSaveLangInfoStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        language: updateObject(state.language, {
            save: updateObject(state.language.save, {
                processing: true,
                error: null,
                saved: false
            })
        })
    }), true);
};

export const adminSaveLangInfoFailed = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            save: updateObject(state.language.save, {
                processing: false,
                error: action.error,
                saved: false
            })
        })
    });
};

export const adminSaveLangInfoSucceeded = (state, action) => {
    return updateObject(state, {
        language: updateObject(state.language, {
            save: updateObject(state.language.save, {
                processing: false,
                error: null,
                saved: true
            })
        })
    });
};

