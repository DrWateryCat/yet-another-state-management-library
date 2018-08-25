import { Action } from "./action";

export type Middleware = (action: Action) => Action;