import {Cell, Totals} from '@core/domain';

export class StatusCodes {
  public static Initializing: number = 2;
  public static NotInitialized: number = 0;
  public static Ready: number = 1;
}

export interface IAppState {
  activeCell: Cell | null;
  gridModel: Array<Cell | null>[];
  selectedPoint: string | null;
  selectedCells: Cell[];
  status: number;
  totals: Totals;
  updatedCells: Cell[];
}
