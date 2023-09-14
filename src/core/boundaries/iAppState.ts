import {Cell, Totals} from '@core/domain';

export class StatusCodes {
  public static Initializing: number = 2;
  public static NotInitialized: number = 0;
  public static Ready: number = 1;
}

export interface IAppState {
  gridModel: Array<Cell | null>[];
  status: number;
  totals: Totals;
}
