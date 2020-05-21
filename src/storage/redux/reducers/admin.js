import * as actionTypes from '../actions';

const initialState = {
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_LOAD: return state;
        default: return state;
    }
};

export default reducer;
