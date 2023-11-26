import {Actions, IDataStore} from '@app/store';
import {IAppState, IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell, Totals} from '@core/domain';

export class AppStoreProvider implements IIsncsciAppStoreProvider {
  public constructor(private appStore: IDataStore<IAppState>) {}

  public setActiveCell(cell: Cell | null): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_ACTIVE_CELL, payload: cell});
    return Promise.resolve();
  }

  public setGridModel(gridModel: Array<any>): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_GRID_MODEL, payload: gridModel});
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

  public updateStatus(status: number): Promise<void> {
    this.appStore.dispatch({type: Actions.UPDATE_STATUS, payload: status});
    return Promise.resolve();
  }
}
