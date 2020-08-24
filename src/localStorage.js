export function loadFromLocalStorage() {
    try {
        let serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        } else {
            return JSON.parse(serializedState);
        }
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}

export function saveToLocalStorage(state) {
    // console.trace()
    try {
        let serializedState = JSON.stringify(state);
        
        let existingState = localStorage.getItem('state');

        if (existingState) {
            localStorage.removeItem('state');
        }

        localStorage.setItem('state', serializedState);
    }
    catch (e) {
        console.log(e);
    }
}