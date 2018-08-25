import { Action } from "./action";

export type Reducer = <State>(state: State, action: Action) => State;
export type StateMutation<State> = (state: State) => State;

export type ReducersMap<S = any> = {
    [K in keyof S]: Reducer;
}