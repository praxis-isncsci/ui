export interface IActionWithPayload<T> {
    payload: T;
    type: string;
}

export interface IDataStore<T> {
    subscribe(handler: Function): Function;
    getState(): T;
    dispatch(action: IActionWithPayload<any>): void;
}
