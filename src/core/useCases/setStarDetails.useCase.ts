import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell} from '@core/domain';
import {getCellColumn, getCellRow} from '@core/helpers';

const cellsMatch = (a: Cell, b: Cell) => {
  return (
    a.value === b.value &&
    a.error === b.error &&
    a.reasonImpairmentNotDueToSci === b.reasonImpairmentNotDueToSci &&
    a.reasonImpairmentNotDueToSciSpecify ===
      b.reasonImpairmentNotDueToSciSpecify
  );
};

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

    if (!nextCell) {
      continue;
    }

    if (cellsMatch(nextCell, cell)) {
      range.push(nextCell);
    } else {
      continueDown = false;
    }

    rowIndex++;
  }

  return range;
};

/*
 * 1. Check that at least a cell was selected.
 * 2. Check that for star flag.
 * 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *  3.1. Get the range of cells to update.
 *  3.2. Call `appStoreProvider.setCellsValue` with the range of cells and the values.
 *  3.3. We stop.
 * 4. Check if all selected cells have the same value.
 *  4.1. If there are mismatch, we throw an error.
 * 5. Call `appStoreProvider.setCellsValue` with the selected cells and the values.
 */
export const setStarDetailsUseCase = (
  considerNormal: boolean | null,
  reason: string | undefined,
  details: string | undefined,
  selectedCells: Cell[],
  gridModel: Array<Cell | null>[],
  propagateDown: boolean,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  // 1. Check that at least a cell was selected.
  if (selectedCells.length === 0) {
    throw new Error('`selectedCells` must contain at least one cell');
  }

  // 2. Check that for star flag.
  const referenceCell = selectedCells[0];

  if (!/\*$/.test(referenceCell.value)) {
    throw new Error(
      'In order to indicate impairment not due to an SCI, the cells must be flagged with a star',
    );
  }

  const value =
    referenceCell.value.replace(/\*$/, '') + (considerNormal ? '**' : '*');
  const error =
    considerNormal === null
      ? 'Please indicate if the value should be considered normal or not normal.'
      : undefined;

  // 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
  if (selectedCells.length === 1 && propagateDown) {
    // 3.1. Get the range of cells to update.
    const range = getDownPropagationCellRange(referenceCell, gridModel);

    console.log(range);

    // 3.2. Call `appStoreProvider.setCellsValue` with the range of cells and the values.
    appStoreProvider.setCellsValue(range, value, error, reason, details);

    // 3.3. We stop.
    return;
  }

  // 4. We check if all selected cells have the same value.
  const mismatch = selectedCells.find(
    (selectedCell) => !cellsMatch(selectedCell, referenceCell),
  );

  if (mismatch) {
    // 4.1. If there are mismatch, we throw an error.
    throw new Error(
      'All cells must have the same value, considered normal or not normal, reasonImpairmentNotDueToSci, and reasonImpairmentNotDueToSciSpecify',
    );
  }

  // 5. Call `appStoreProvider.setCellsValue` with the selected cells and the values.
  appStoreProvider.setCellsValue(
    selectedCells.slice(),
    value,
    error,
    reason,
    details,
  );
};
