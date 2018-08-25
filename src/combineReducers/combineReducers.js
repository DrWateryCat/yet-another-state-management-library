/**
 * @param {Object} reducers: An object corresponding to different reducers for different states
 * @returns {Function}: A reducer function that invokes every function within the reducers for each action
 */

 export default function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};

    reducerKeys
        .filter(k => typeof reducers[k] === 'function')
        .forEach(k => finalReducers[k] = reducers[k]);

    const finalReducerKeys = Object.keys(finalReducers);

    return function combinedReducer(state = {}, action) {
        let hasChanged = false;
        const nextState = {};

        finalReducerKeys.forEach(key => {
            const reducer = finalReducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        })

        return hasChanged ? nextState : state;
    }
 }