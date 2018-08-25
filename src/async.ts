import { Action } from "./action";

export type Dispatch = <T>(action: Action<T>) => void;
export type GetState<S> = () => S;

export type AsyncAction = <S>(dispatch: Dispatch, getState: GetState<S>) => void;
export const isAsync = (action: Action | AsyncAction): action is AsyncAction => {
    return (<Action>action).type === undefined && typeof action === 'function';
}