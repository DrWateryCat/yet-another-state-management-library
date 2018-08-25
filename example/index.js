import { Store } from '../dist';

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return {...state, number: state.number + 1};
        default:
            return {...state};
    }
}

const store = new Store(reducer);
store.dispatch({ type: 'INCREMENT' });
store.dispatch(({ dispatch, getState }) => {
    dispatch({ type: 'INCREMENT' });
})