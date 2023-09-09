import {Exam} from 'isncsci';

import {Actions, IDataStore} from '@app/store';
import {IAppState, IIsncsciAppStoreProvider} from '@core/boundaries';

export class AppStoreProvider implements IIsncsciAppStoreProvider {
  public constructor(private appStore: IDataStore<IAppState>) {}

  public setExam(exam: Exam): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public selectDermatome(dermatomeName: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setGridModel(gridModel: Array<any>): Promise<void> {
    this.appStore.dispatch({type: Actions.SET_GRID_MODEL, payload: gridModel});
    return Promise.resolve();
  }

  public updateStatus(status: number): Promise<void> {
    this.appStore.dispatch({type: Actions.UPDATE_STATUS, payload: status});
    return Promise.resolve();
  }
}
