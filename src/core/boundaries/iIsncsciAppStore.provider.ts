import {Cell, Totals} from '@core/domain';

export interface IIsncsciAppStoreProvider {
  setGridModel(gridModel: Array<Cell | null>[]): Promise<void>;
  setSelectedPoint(name: string | null): Promise<void>;
  setTotals(totals: Totals): Promise<void>;
  // clearDermatomeSelection(): Promise<void>;
  // setDermatomeValue(dermatomeName: string, value: string): Promise<void>;
  // setTotals(totals: IsncsciTotals): Promise<void>;
  // updateDermatomesInRange(dermatomeNames: string[], value: string): Promise<void>;
  updateStatus(status: number): Promise<void>;
}
