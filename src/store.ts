import { Reducer } from "./reducer";
import { Action } from "./action";
import { AsyncAction, isAsync } from "./async";
import { Middleware } from "./middleware";
import { compose } from "./compose";

export class Store<State extends object> {
    private isDispatching = false;
    private currentState: State;
    private middlewares: Middleware[] = [];
    private subscribers: ((state: State) => void)[] = [];
    constructor(private reducer: Reducer, initialState?: State) {
        if (initialState) {
            this.currentState = initialState;
        } else {
            this.currentState = {} as State;
        }
    }

    public get state() {
        return this.currentState;
    }

    public replaceReducer(newReducer: Reducer) {
        this.reducer = newReducer;
    }

    public dispatch<T>(action: Action<T> | AsyncAction) {
        if (this.isDispatching) {
            throw new Error(`Don't dispatch within a reducer!`);
        }
        if (isAsync(<Action>action)) {
            const async = <AsyncAction>action;
            const getState = () => this.currentState;
            async(this.dispatchInternal, getState);
        } else {
            const notAsync = <Action>action;
            this.dispatchInternal(notAsync);
        }
    }

    public registerMiddleware<T>(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    public subscribe(listener: (state: State) => void): () => void {
        this.subscribers.push(listener);
        const index = this.subscribers.length - 1;

        return () => {
            this.subscribers.splice(index, 1);
        }
    }

    private runMiddleware(action: Action): Action {
        const composedMiddleware = compose(...this.middlewares);
        return composedMiddleware(action);
    }

    private dispatchInternal(action: Action) {
        try {
            this.isDispatching = true;
            const newAction = this.runMiddleware(action);
            const result = this.reducer<State>(this.currentState, newAction);
            if (result === undefined) {
                throw new Error('The result of a reducer cannot be undefined!');
            }
            this.subscribers.forEach(s => s(result));
            this.currentState = result;
        } finally {
            this.isDispatching = false;
        }
    }
}