import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

function loadFromLocalStorage() {
    // const now = new Date();
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) {
            return undefined;
        } else {
            let state = JSON.parse(serializedState);
            return state;
            // if (now.getTime() > state.expiry) {
            //     localStorage.removeItem('state');
            //     return undefined;
            // } else {
            //     return state;
            // }
        }
    }
    catch (e) {
        console.log(e)
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();

export const store = createStore(
    rootReducer,
    persistedState,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)

export default store