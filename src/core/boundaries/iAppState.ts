import {BinaryObservation, Cell, MotorLevel, Totals} from '@core/domain';

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
  readonly: boolean;
  selectedPoint: string | null;
  selectedCells: Cell[];
  status: number;
  totals: Totals;
  updatedCells: Cell[];
  vac: BinaryObservation | null;
}
