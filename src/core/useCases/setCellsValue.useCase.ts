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
 * 2. Determine if an error message needs to be added for values flagged with a star.
 * 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *  3.2. If the selected cell is a sensory cell and the value is not a motor value, we stop. Nothing gets updated.
 *  3.3. Get the range of cells to update.
 *  3.4. Call `appStoreProvider.setCellsValue` with the range of cells and the value.
 * 4. If there is more than one cell selected or `propagateDown` is ignored:
 *  4.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
 * 5. If there are no cells to update, we stop. Nothing gets updated.
 * 6. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
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

  // 2. Determine if an error message needs to be added for values flagged with a star.
  const starErrorMessage = /\*/.test(value)
    ? 'Please indicate if the value should be considered normal or not normal.'
    : undefined;

  // 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
  if (selectedCells.length === 1 && propagateDown) {
    // 3.2. If the selected cell is a sensory cell and the value is not a motor value, we stop. Nothing gets updated.
    if (sensoryCellRegex.test(selectedCells[0].name) && !isSensoryValue) {
      return;
    }

    // 3.3. Get the range of cells to update.
    const {motorRange, sensoryRange} = getCellRange(
      getCellPosition(selectedCells[0].name),
      null,
      gridModel,
      true,
    );

    // 3.4. Call `appStoreProvider.setCellsValue` with the range of cells and the value.
    appStoreProvider.setCellsValue(
      motorRange.concat(sensoryRange),
      value,
      starErrorMessage,
      undefined,
      undefined,
    );
    return;
  }

  // 4. If there is more than one cell selected or `propagateDown` is ignored:
  const cellsToUpdate: Cell[] = [];

  // 4.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
  selectedCells.forEach((selectedCell) => {
    if (isSensoryValue || motorCellRegex.test(selectedCell.name)) {
      cellsToUpdate.push(selectedCell);
    }
  });

  // 5. If there are no cells to update, we stop. Nothing gets updated.
  if (cellsToUpdate.length === 0) {
    return;
  }

  // 6. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
  appStoreProvider.setCellsValue(
    cellsToUpdate,
    value,
    starErrorMessage,
    undefined,
    undefined,
  );
};
