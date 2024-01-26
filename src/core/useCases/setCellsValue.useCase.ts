import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {BinaryObservation, Cell, MotorLevel} from '@core/domain';
import {
  getCellPosition,
  getCellRange,
  motorValueRegex,
  motorCellRegex,
  sensoryCellRegex,
  sensoryValueRegex,
  getExamDataFromGridModel,
} from '@core/helpers';
import {getEmptyTotals} from '@core/helpers/examData.helper';

/*
 * 1. Test value to make sure it is valid.
 * 2. Determine if an error message needs to be added for values flagged with a star.
 * 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *  3.1. If the selected cell is a sensory cell and the value is a motor value, we stop. Nothing gets updated.
 *  3.2. Get the range of cells to update.
 * 4. If there is more than one cell selected or `propagateDown` is ignored:
 *  4.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
 * 5. If there are no cells to update, we stop. Nothing gets updated.
 * 6. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
 * 7. Clear the totals
 * 8. Update external listeners
 */
export const setCellsValueUseCase = async (
  value: string,
  selectedCells: Cell[],
  gridModel: Array<Cell | null>[],
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  rightLowestNonKeyMuscle: MotorLevel | null,
  leftLowestNonKeyMuscle: MotorLevel | null,
  comments: string,
  propagateDown: boolean,
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  // 1. Test value to make sure it is valid
  // Motor values are the superset of valid values
  if (!motorValueRegex.test(value)) {
    throw new Error(`Invalid value: ${value}`);
  }

  const isSensoryValue = sensoryValueRegex.test(value);
  let cellsToUpdate: Cell[] = [];

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

    cellsToUpdate = motorRange.concat(sensoryRange);
  } else {
    // 4. If there is more than one cell selected or `propagateDown` is ignored:
    // 4.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
    selectedCells.forEach((selectedCell) => {
      if (isSensoryValue || motorCellRegex.test(selectedCell.name)) {
        cellsToUpdate.push(selectedCell);
      }
    });
  }

  // 5. If there are no cells to update, we stop. Nothing gets updated.
  if (cellsToUpdate.length === 0) {
    return;
  }

  // 6. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
  await appStoreProvider.setCellsValue(
    cellsToUpdate,
    value,
    value.replace('**', '*'),
    starErrorMessage,
    undefined,
    undefined,
  );

  // 7. Clear the totals
  await appStoreProvider.setTotals(getEmptyTotals());

  // 8. Update external listeners
  const {examData} = getExamDataFromGridModel(
    gridModel,
    vac,
    dap,
    rightLowestNonKeyMuscle,
    leftLowestNonKeyMuscle,
    comments,
  );

  await externalMessageProvider.sendOutExamData(examData);
};
