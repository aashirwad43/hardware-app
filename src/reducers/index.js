import { combineReducers } from 'redux';
import { SET_AUTH, HARDWARE_INFO } from '../actions/types';

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

const defaultHardwareInfoState = {
    today: 0,
    all_time: 0,
    by_you: {
        today: 0,
        all_time: 0
    }
}

function hardwareInfoReducer(state = defaultHardwareInfoState, action) {
    switch (action.type) {
        case HARDWARE_INFO:
            // console.log(action.cred)
            return action.info;
        default:
            return state;
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
    credentials: credReducer,
    hardwareInfo: hardwareInfoReducer
})