import { combineReducers } from 'redux';
import { SET_AUTH } from '../actions/types';

export const defaultCredState = {
    user:{
        username:"",
        password:""
    },
    tokens:{
        accessToken:"",
        refreshToken:""
    }
}

function credReducer(state = defaultCredState, action) {
    switch (action.type) {
        case SET_AUTH:
            return action.cred;
        default:
            return state;
    }
}

export default combineReducers({
    credentials:credReducer
})