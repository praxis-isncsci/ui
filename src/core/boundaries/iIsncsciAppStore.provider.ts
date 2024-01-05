import {Cell, MotorLevel, Totals} from '@core/domain';
import {BinaryObservation} from '@core/domain';

export interface IIsncsciAppStoreProvider {
  setActiveCell(cell: Cell | null): Promise<void>;
  setCellsValue(
    cells: Cell[],
    value: string,
    label: string,
    error: string | undefined,
    reasonImpairmentNotDueToSci: string | undefined,
    reasonImpairmentNotDueToSciSpecify: string | undefined,
  ): Promise<void>;
  setExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    comments: string,
  ): Promise<void>;
  setGridModel(gridModel: Array<Cell | null>[]): Promise<void>;
  setReadonly(readonly: boolean): Promise<void>;
  setSelectedCells(cells: Cell[]): Promise<void>;
  setTotals(totals: Totals): Promise<void>;
  setVacDap(
    vac: BinaryObservation | null,
    dap: BinaryObservation | null,
  ): Promise<void>;
  updateStatus(status: number): Promise<void>;
}
