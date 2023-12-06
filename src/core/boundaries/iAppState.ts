import {Cell, MotorLevel, Totals} from '@core/domain';
import {BinaryObservation} from 'isncsci/cjs/interfaces';

export class StatusCodes {
  public static Initializing: number = 2;
  public static NotInitialized: number = 0;
  public static Ready: number = 1;
}

export interface IAppState {
  activeCell: Cell | null;
  comments: string;
  dap: BinaryObservation | null;
  gridModel: Array<Cell | null>[];
  leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null;
  rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null;
  selectedPoint: string | null;
  selectedCells: Cell[];
  status: number;
  totals: Totals;
  updatedCells: Cell[];
  vac: BinaryObservation | null;
}
