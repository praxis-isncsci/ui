import {Cell, MotorLevel, Totals} from '@core/domain';
import {BinaryObservation} from '@core/domain';

export interface IIsncsciAppStoreProvider {
  setActiveCell(cell: Cell | null): Promise<void>;
  setCellsValue(cells: Cell[], value: string): Promise<void>;
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
  // clearDermatomeSelection(): Promise<void>;
  // setDermatomeValue(dermatomeName: string, value: string): Promise<void>;
  // setTotals(totals: IsncsciTotals): Promise<void>;
  // updateDermatomesInRange(dermatomeNames: string[], value: string): Promise<void>;
  updateStatus(status: number): Promise<void>;
}
