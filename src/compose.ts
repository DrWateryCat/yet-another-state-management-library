export type ComposableFunction<I, R> = (input: I) => R;

export const compose = (...functions: Function[]): Function => {
    if (functions.length === 0) {
        return (arg: any) => arg;
    }

    if (functions.length === 1) {
        return functions[0];
    }

    return functions.reduce((a, b) => (...args: any[]) => a(b(...args)));
}