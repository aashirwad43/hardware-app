import { combineReducers } from 'redux';
import { SET_AUTH } from '../actions/types';

export const defaultCredState = {
    user:{
        id:"",
        username:""
    },
    tokens:{
        expiry:undefined,
        accessToken:"",
        refreshToken:""
    }
}



function credReducer(state = defaultCredState, action) {
    switch (action.type) {
        case SET_AUTH:
            // console.log(action.cred)
            return action.cred;
        default:
            return state;
    }
}

export default combineReducers({
    credentials:credReducer
})