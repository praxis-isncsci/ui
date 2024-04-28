import {Cell, MotorLevel, Totals} from '@core/domain';
import {BinaryObservation} from '@core/domain';

export interface IIsncsciAppStoreProvider {
  clearTotalsAndErrors(): Promise<void>;
  setActiveCell(cell: Cell | null, selectedCells: Cell[]): Promise<void>;
  setCalculationError(error: string): Promise<void>;
  setCellsValue(
    cells: Cell[],
    value: string,
    label: string,
    error: string | null,
    considerNormal: boolean | null,
    reasonImpairmentNotDueToSci: string | null,
    reasonImpairmentNotDueToSciSpecify: string | null,
  ): Promise<void>;
  setExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    comments: string,
  ): Promise<void>;
  setGridModel(gridModel: Array<Cell | null>[]): Promise<void>;
  setReadonly(readonly: boolean): Promise<void>;
  setTotals(totals: Totals): Promise<void>;
  setVacDap(
    vac: BinaryObservation | null,
    dap: BinaryObservation | null,
  ): Promise<void>;
  updateStatus(status: number): Promise<void>;
}
