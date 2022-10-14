import {SET_SOURCE_DATA, RESET_SOURCE_DATA} from './types';

export const setSourceData = (data) => ({
    type: SET_SOURCE_DATA,
    payload: data
});

export const resetSourceData = () => ({
    type: RESET_SOURCE_DATA
});

const initialState = {
    data: []
}

export default function reducer(state = initialState, action){
    switch(action.type) {
        case SET_SOURCE_DATA:
            return {
                ...state,
                data: action.payload
            }
        case RESET_SOURCE_DATA:
            return {
                ...state,
                data: []
            }
        default:
            return state
    }
}
