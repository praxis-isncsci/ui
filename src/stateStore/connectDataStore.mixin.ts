/*
  Mixin for connecting an element to a data store; implements the
  basic store-connection boilerplate.
  Based on Polymer's pwa-helpers/connect-mixin.js
  Sample use:
  import { connect } from './connect-mixin';
  class MyElement extends connect(store)(HTMLElement) {
    // ...
    _stateChanged(state) {
      this.count = state.data.count;
    }
  }
*/

import {IDataStore} from '.';

type Constructor<T = any> = new (...args: any[]) => T;

export const connectDataStore = (store: IDataStore<{}>) =>
    <base extends Constructor>(baseElement: base) => class extends baseElement {
    public __storeUnsubscribe: any;

    public connectedCallback(): void {
        // Connect the element to the store.
        this.__storeUnsubscribe = store.subscribe((state: {}, actionType: string) => this.stateChanged(state, actionType));
        this.stateChanged(store.getState(), 'first-call');

        if (super.connectedCallback) {
            super.connectedCallback();
        }
    }

    public disconnectedCallback(): void {
        this.__storeUnsubscribe();

        if (super.disconnectedCallback) {
            super.disconnectedCallback();
        }
    }

    // This is called every time something is updated in the store.
    public stateChanged(state: {}, actionType: string): void {
        throw new Error('stateChanged() not implemented');
    }
};
