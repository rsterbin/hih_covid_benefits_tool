import { updateObject, updateAdminActivity } from '../../utility';

export const getInitialState = () => {
    return {
        list: {
            loaded: false,
            error: null,
            data: null,
            benefit: null
        },
        delete: {
            candidate: null,
            confirming: false,
            processing: false,
            deleted: false,
            error: null
        },
        info: {
            loaded: false,
            error: null,
            data: null
        },
        save: {
            processing: false,
            error: null,
            saved: false,
            reload_id: null
        }
    };
};

export const adminFetchResourcesListStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            list: updateObject(state.resources.list, {
                loaded: false,
                error: null,
                data: null,
                benefit: action.benefit
            })
        })
    }), true);
};

export const adminFetchResourcesListFailed = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            list: updateObject(state.resources.list, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchResourcesListSucceeded = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            list: updateObject(state.resources.list, {
                loaded: true,
                error: null,
                data: action.data,
                benefit: action.benefit
            })
        })
    });
};

export const adminRequestResourceDelete = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            delete: updateObject(state.resources.delete, {
                candidate: action.candidate,
                confirming: true,
                processing: false,
                deleted: false,
                error: null
            })
        })
    }));
};

export const adminCancelResourceDelete = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            delete: updateObject(state.resources.delete, {
                candidate: null,
                confirming: false,
                processing: false,
                deleted: false,
                error: null
            })
        })
    }));
};

export const adminDeleteResourceStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            delete: updateObject(state.resources.delete, {
                confirming: false,
                processing: true,
                deleted: false,
                error: null
            })
        })
    }));
};

export const adminDeleteResourceFailed = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            delete: updateObject(state.resources.delete, {
                candidate: null,
                confirming: false,
                processing: false,
                deleted: false,
                error: action.error
            })
        })
    });
};

export const adminDeleteResourceSucceeded = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            delete: updateObject(state.resources.delete, {
                candidate: null,
                confirming: false,
                processing: false,
                deleted: true,
                error: null
            })
        })
    });
};

export const adminDismissDeleteResourceMessage = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            delete: updateObject(state.resources.delete, {
                candidate: null,
                confirming: false,
                processing: false,
                deleted: false,
                error: null
            })
        })
    }));
};

export const adminFetchResourceStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            info: updateObject(state.resources.info, {
                loaded: false,
                error: null,
                data: null
            })
        })
    }));
};

export const adminFetchResourceFailed = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            info: updateObject(state.resources.info, {
                loaded: false,
                error: action.error,
                data: null
            })
        })
    });
};

export const adminFetchResourceSucceeded = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            info: updateObject(state.resources.info, {
                loaded: true,
                error: null,
                data: action.data
            })
        })
    });
};

export const adminSaveResourceStarted = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            save: updateObject(state.resources.save, {
                processing: true,
                error: null,
                saved: false,
                reload_id: null
            })
        })
    }));
};

export const adminSaveResourceFailed = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            save: updateObject(state.resources.save, {
                processing: false,
                error: action.error,
                saved: false,
                reload_id: null
            })
        })
    });
};

export const adminSaveResourceSucceeded = (state, action) => {
    return updateObject(state, {
        resources: updateObject(state.resources, {
            save: updateObject(state.resources.save, {
                processing: false,
                error: null,
                saved: true,
                reload_id: action.id
            })
        })
    });
};

export const adminSaveResourceMsgDismissed = (state, action) => {
    return updateAdminActivity(updateObject(state, {
        resources: updateObject(state.resources, {
            save: updateObject(state.resources.save, {
                saved: false,
                reload_id: null
            })
        })
    }));
};

