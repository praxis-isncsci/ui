import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {BinaryObservation, Cell, MotorLevel} from '@core/domain';
import {getCellColumn, getCellRow} from '@core/helpers';
import {cellsMatch} from '@core/helpers/cellHelper';
import {
  getEmptyTotals,
  getExamDataFromGridModel,
} from '@core/helpers/examData.helper';

const getDownPropagationCellRange = (
  cell: Cell,
  gridModel: Array<Cell | null>[],
) => {
  const column = getCellColumn(cell.name);
  let continueDown = true;
  let rowIndex = getCellRow(cell.name) + 1;
  const range = [cell];

  while (continueDown && rowIndex < gridModel.length) {
    const nextCell = gridModel[rowIndex][column];
    rowIndex++;

    if (!nextCell) {
      continue;
    }

    if (cellsMatch(nextCell, cell)) {
      range.push(nextCell);
    } else {
      continueDown = false;
    }
  }

  return range;
};

/*
 * 1. Check that at least a cell was selected.
 * 2. Check that the value was flagged with a star.
 * 3. Check if all selected cells have the same value.
 *  3.1. If there are mismatch, we throw an error.
 * 4. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *    We use the selected cells if a multiple are selected or `propagateDown` is set to `false`.
 * 5. Call `appStoreProvider.setCellsValue` with the selected cells and the values.
 * 6. Clear the totals and errors
 * 7. Update external listeners
 */
export const setStarDetailsUseCase = async (
  considerNormal: boolean | null,
  reason: string | null,
  details: string | null,
  reasonImpairmentNotDueToSciSpecify: string | null,
  selectedCells: Cell[],
  gridModel: Array<Cell | null>[],
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  comments: string,
  cellComments: string | null,
  propagateDown: boolean,
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  // 1. Check that at least a cell was selected.
  if (selectedCells.length === 0) {
    throw new Error('`selectedCells` must contain at least one cell');
  }

  // 2. Check that the value was flagged with a star.
  const referenceCell = selectedCells[0];

  if (!/\*$/.test(referenceCell.value)) {
    throw new Error(
      'In order to indicate impairment not due to an SCI, the cells must be flagged with a star',
    );
  }

  const value =
    referenceCell.value.replace(/\*/g, '') + (considerNormal ? '**' : '*');
  const label = value.replace('**', '*');
  const error =
    considerNormal === null
      ? 'Please indicate if the value should be considered normal or not normal.'
      : null;

  // 3. We check if all selected cells have the same value.
  const mismatch = selectedCells.find(
    (selectedCell) => !cellsMatch(selectedCell, referenceCell),
  );

  if (mismatch) {
    // 3.1. If there are mismatch, we throw an error.
    throw new Error(
      'All cells must have the same value, considered normal or not normal, reasonImpairmentNotDueToSci, and reasonImpairmentNotDueToSciSpecify',
    );
  }

  // 4. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
  //    We use the selected cells if a multiple are selected or `propagateDown` is set to `false`.
  const range =
    selectedCells.length === 1 && propagateDown
      ? getDownPropagationCellRange(referenceCell, gridModel)
      : selectedCells.slice();

  // 5. Call `appStoreProvider.setCellsValue` with the selected cells and the values.
  await appStoreProvider.setCellsValue(
    range,
    value,
    label,
    error,
    considerNormal,
    reason,
    details,
  );

  try {
    // 6. Clear the totals and errors
    await appStoreProvider.clearTotalsAndErrors();

    // 7. Update external listeners
    const {examData} = getExamDataFromGridModel(
      gridModel,
      vac,
      dap,
      rightLowestNonKeyMuscleWithMotorFunction,
      leftLowestNonKeyMuscleWithMotorFunction,
      comments,
      cellComments,
    );

    await externalMessageProvider.sendOutExamData(examData);
  } catch (error) {
    console.error(error);
  }
};