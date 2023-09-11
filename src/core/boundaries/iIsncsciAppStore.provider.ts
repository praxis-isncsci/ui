import {Exam} from 'isncsci';

import {Cell} from '@core/domain';

export interface IIsncsciAppStoreProvider {
  setGridModel(gridModel: Array<Cell | null>[]): Promise<void>;
  // clearDermatomeSelection(): Promise<void>;
  selectDermatome(dermatomeName: string): Promise<void>;
  // setDermatomeValue(dermatomeName: string, value: string): Promise<void>;
  // setTotals(totals: IsncsciTotals): Promise<void>;
  // updateDermatomesInRange(dermatomeNames: string[], value: string): Promise<void>;
  updateStatus(status: number): Promise<void>;
}
