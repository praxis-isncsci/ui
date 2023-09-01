import {ActionWithPayload} from './actionWithPayload';

export interface IDataStore<T> {
    state: T;
    subscribe(handler: Function): Function;
    getState(): T;
    dispatch(action: ActionWithPayload<any>): void;
}
