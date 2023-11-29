import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell} from '@core/domain';
import {
  getCellPosition,
  getCellRange,
  motorValueRegex,
  motorCellRegex,
  sensoryCellRegex,
  sensoryValueRegex,
} from '@core/helpers';

/*
 * 1. Test value to make sure it is valid.
 * 2. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *  2.2. If the selected cell is a sensory cell and the value is not a motor value, we stop. Nothing gets updated.
 *  2.3. Get the range of cells to update.
 *  2.4. Call `appStoreProvider.setCellsValue` with the range of cells and the value.
 * 3. If there is more than one cell selected or `propagateDown` is ignored:
 *  3.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
 * 4. If there are no cells to update, we stop. Nothing gets updated.
 * 5. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
 */
export const setCellsValueUseCase = async (
  value: string,
  selectedCells: Cell[],
  gridModel: Array<Cell | null>[],
  propagateDown: boolean,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  // 1. Test value to make sure it is valid
  // Motor values are the superset of valid values
  if (!motorValueRegex.test(value)) {
    throw new Error(`Invalid value: ${value}`);
  }

  const isSensoryValue = sensoryValueRegex.test(value);

  // 2. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
  if (selectedCells.length === 1 && propagateDown) {
    // 2.2. If the selected cell is a sensory cell and the value is not a motor value, we stop. Nothing gets updated.
    if (sensoryCellRegex.test(selectedCells[0].name) && !isSensoryValue) {
      return;
    }

    // 2.3. Get the range of cells to update.
    const {motorRange, sensoryRange} = getCellRange(
      getCellPosition(selectedCells[0].name),
      null,
      gridModel,
      true,
    );

    // 2.4. Call `appStoreProvider.setCellsValue` with the range of cells and the value.
    appStoreProvider.setCellsValue(motorRange.concat(sensoryRange), value);
    return;
  }

  // 3. If there is more than one cell selected or `propagateDown` is ignored:
  const cellsToUpdate: Cell[] = [];

  // 3.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
  selectedCells.forEach((selectedCell) => {
    if (isSensoryValue || motorCellRegex.test(selectedCell.name)) {
      cellsToUpdate.push(selectedCell);
    }
  });

  // 4. If there are no cells to update, we stop. Nothing gets updated.
  if (cellsToUpdate.length === 0) {
    return;
  }

  // 5. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
  appStoreProvider.setCellsValue(cellsToUpdate, value);
};
