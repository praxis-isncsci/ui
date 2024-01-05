import {Actions, IDataStore} from '@app/store';
import {IAppState, IIsncsciAppStoreProvider} from '@core/boundaries';
import {BinaryObservation, Cell, MotorLevel, Totals} from '@core/domain';

export class AppStoreProvider implements IIsncsciAppStoreProvider {
  public constructor(private appStore: IDataStore<IAppState>) {}

  public setActiveCell(cell: Cell | null): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_ACTIVE_CELL, payload: cell});
    return Promise.resolve();
  }

  public setCellsValue(
    cellsToUpdate: Cell[],
    value: string,
    label: string,
    error: string | undefined,
    reasonImpairmentNotDueToSci: string | undefined,
    reasonImpairmentNotDueToSciSpecify: string | undefined,
  ): Promise<void> {
    this.appStore.dispatch({
      type: Actions.SET_CELLS_VALUE,
      payload: {
        cellsToUpdate,
        value,
        label,
        error,
        reasonImpairmentNotDueToSci,
        reasonImpairmentNotDueToSciSpecify,
      },
    });
    return Promise.resolve();
  }

  public setExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    comments: string,
  ): Promise<void> {
    this.appStore.dispatch({
      type: Actions.SET_EXTRA_INPUTS,
      payload: {
        rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction,
        comments,
      },
    });
    return Promise.resolve();
  }

  public setGridModel(gridModel: Array<any>): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_GRID_MODEL, payload: gridModel});
    return Promise.resolve();
  }

  public setReadonly(readonly: boolean): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_READONLY, payload: readonly});
    return Promise.resolve();
  }

  public setSelectedCells(cells: Cell[]): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_SELECTED_CELLS, payload: cells});
    return Promise.resolve();
  }

  public setTotals(totals: Totals): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_TOTALS, payload: totals});
    return Promise.resolve();
  }

  public setVacDap(
    vac: BinaryObservation | null,
    dap: BinaryObservation | null,
  ): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_VAC_DAP, payload: {vac, dap}});
    return Promise.resolve();
  }

  public updateStatus(status: number): Promise<void> {
    this.appStore.dispatch({type: Actions.UPDATE_STATUS, payload: status});
    return Promise.resolve();
  }
}
