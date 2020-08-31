import { SET_AUTH, HARDWARE_INFO } from './types';

// AUTHENTICATION ACTIONS

export const setAuthCred = (cred) => dispatch => {
    dispatch({
        type: SET_AUTH,
        cred
    })
}

export const setHardwareInfo = (info) => dispatch => {
    dispatch({
        type: HARDWARE_INFO,
        info
    })
}

