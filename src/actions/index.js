import { SET_AUTH } from './types';

// AUTHENTICATION ACTIONS

export const setAuthCred = (cred) => dispatch => {
    dispatch({
        type: SET_AUTH,
        cred
    })
}

