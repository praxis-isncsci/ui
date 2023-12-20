import {IAppState} from '@core/boundaries';
import {BinaryObservation, Cell, Totals} from '@core/domain';

import {IActionWithPayload} from './';

export class Actions {
  public static SET_ACTIVE_CELL = 'SET_ACTIVE_CELL';
  public static SET_CELLS_VALUE = 'SET_CELLS_VALUE';
  public static SET_EXTRA_INPUTS = 'SET_EXTRA_INPUTS';
  public static SET_GRID_MODEL = 'SET_GRID_MODEL';
  public static SET_READONLY = 'SET_READONLY';
  public static SET_SELECTED_CELLS = 'SET_SELECTED_CELLS';
  public static SET_TOTALS = 'SET_TOTALS';
  public static SET_VAC_DAP = 'SET_VAC_DAP';
  public static UPDATE_STATUS = 'UPDATE_STATUS';
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

const activeCell = (
  state: IAppState,
  action: IActionWithPayload<Cell | null>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_ACTIVE_CELL:
      return Object.assign({}, state, {activeCell: action.payload});
    default:
      return state;
  }
};

const extraInputs = (
  state: IAppState,
  action: IActionWithPayload<{
    rightLowestNonKeyMuscleWithMotorFunction: string | null;
    leftLowestNonKeyMuscleWithMotorFunction: string | null;
    comments: string;
  }>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_EXTRA_INPUTS:
      return Object.assign({}, state, {
        rightLowestNonKeyMuscleWithMotorFunction:
          action.payload.rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction:
          action.payload.leftLowestNonKeyMuscleWithMotorFunction,
        comments: action.payload.comments,
      });
    default:
      return state;
  }
};

const readonly = (
  state: IAppState,
  action: IActionWithPayload<boolean>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_READONLY:
      return Object.assign({}, state, {readonly: action.payload});
    default:
      return state;
  }
};

const selectedCells = (
  state: IAppState,
  action: IActionWithPayload<Cell[]>,
): IAppState => {
  switch (action.type) {
    case Actions.SET_SELECTED_CELLS:
      return Object.assign({}, state, {selectedCells: action.payload});
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

const vacDap = (
  state: IAppState,
  action: IActionWithPayload<{
    vac: BinaryObservation | null;
    dap: BinaryObservation | null;
  }>,
) => {
  switch (action.type) {
    case Actions.SET_VAC_DAP:
      return Object.assign({}, state, {
        vac: action.payload.vac,
        dap: action.payload.dap,
      });
    default:
      return state;
  }
};

const values = (
  state: IAppState,
  action: IActionWithPayload<{
    cellsToUpdate: Cell[];
    value: string;
    error: string | undefined;
    reasonImpairmentNotDueToSci: string | undefined;
    reasonImpairmentNotDueToSciSpecify: string | undefined;
  }>,
) => {
  switch (action.type) {
    case Actions.SET_CELLS_VALUE:
      const cellsToUpdate = action.payload.cellsToUpdate.slice();
      cellsToUpdate.forEach((cell) => {
        cell.value = action.payload.value;
        cell.error = action.payload.error;
        cell.reasonImpairmentNotDueToSci =
          action.payload.reasonImpairmentNotDueToSci;
        cell.reasonImpairmentNotDueToSciSpecify =
          action.payload.reasonImpairmentNotDueToSciSpecify;
      });
      return Object.assign({}, state, {updatedCells: cellsToUpdate.slice()});
    default:
      return state;
  }
};

export {
  activeCell,
  extraInputs,
  gridModel,
  readonly,
  selectedCells,
  status,
  totals,
  vacDap,
  values,
};

export default [
  activeCell,
  extraInputs,
  gridModel,
  readonly,
  selectedCells,
  status,
  totals,
  vacDap,
  values,
];
