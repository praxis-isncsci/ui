import {IAppState} from '@core/boundaries';
import {Totals} from '@core/domain';

import {IActionWithPayload} from './';

export class Actions {
  public static UPDATE_STATUS = 'UPDATE_STATUS';
  public static SET_SELECTED_POINT = 'SET_SELECTED_POINT';
  public static SET_GRID_MODEL = 'SET_GRID_MODEL';
  public static SET_TOTALS = 'SET_TOTALS';
}

const gridModel = (
  state: IAppState,
  action: IActionWithPayload<Array<any>>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_GRID_MODEL:
      return Object.assign({}, state, {gridModel: action.payload});
    default:
      return state;
  }
};

const selectedPoint = (
  state: IAppState,
  action: IActionWithPayload<string | null>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_SELECTED_POINT:
      return Object.assign({}, state, {selectedPoint: action.payload});
    default:
      return state;
  }
};

const status = (
  state: IAppState,
  action: IActionWithPayload<number>,
): IAppState => {
  switch (action.type) {
    case Actions.UPDATE_STATUS:
      return Object.assign({}, state, {status: action.payload});
    default:
      return state;
  }
};

const totals = (
  state: IAppState,
  action: IActionWithPayload<Totals>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_TOTALS:
      return Object.assign({}, state, {totals: action.payload});
    default:
      return state;
  }
};

export {gridModel, selectedPoint, status, totals};

export default [gridModel, selectedPoint, status, totals];
