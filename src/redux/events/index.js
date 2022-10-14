import { Map } from 'immutable';
import {ADD_EVENT_DATA, SET_EVENT_DATA, REMOVE_EVENT_DATA, RESET_EVENT_DATA} from './types';

export const setEventData = (data) => ({
    type: SET_EVENT_DATA,
    payload: data
});

export const addEventData = (data) => ({
    type: ADD_EVENT_DATA,
    payload: data
});

export const removeEventData = (id) => ({
    type: REMOVE_EVENT_DATA,
    payload: id
});

export const resetEventData = () => ({
    type: RESET_EVENT_DATA
})

const initialState = {
    data: [],
    isLoading: false
}

export default function reducer(state = initialState, action){
    switch(action.type) {
        case SET_EVENT_DATA:
            return {
                data: action.payload
            }
        case ADD_EVENT_DATA:
                return {
                    data: [...state.data, action.payload]
                }
        case REMOVE_EVENT_DATA:
            return {
                data: state.data.filter(item => item.id !== action.payload)
            }
        case RESET_EVENT_DATA:
            return {
                ...state,
                data: []
            }
        default:
            return state
    }
}


export const getEventData = state => state.get("data").toObject()