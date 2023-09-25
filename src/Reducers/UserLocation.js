export const initialState = null
const SET_ADDRESS = 'SET_ADDRESS';

export function locationReducer(state, action) {
    switch (action.type) {
        case SET_ADDRESS:
            return {
                ...state,
                address: action.payload,
            };
        default:
            return state;
    }
}


//where do we use this?

