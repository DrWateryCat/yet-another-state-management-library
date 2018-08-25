export interface StateMutationNotification<State, Payload = void> {
    name: string;
    payload?: Payload;
    newState: State;
}