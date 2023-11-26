import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell} from '@core/domain';
import {findCell, validCellNameRegex} from '@core/helpers';

/*
 * Returns a number between 0 and 5 representing the column index of a cell in the grid model.
 * Throws and error when the cell name is invalid.
 */
export const getCellColumn = (cellName: string) => {
  if (!validCellNameRegex.test(cellName)) {
    throw new Error(`Invalid cell name ${cellName}`);
  }

  switch (true) {
    case /right-motor/.test(cellName):
      return 0;
    case /right-light-touch/.test(cellName):
      return 1;
    case /right-pin-prick/.test(cellName):
      return 2;
    case /left-light-touch/.test(cellName):
      return 3;
    case /left-pin-prick/.test(cellName):
      return 4;
    case /left-motor/.test(cellName):
      return 5;
    default:
      throw new Error(`Invalid cell name ${cellName}`);
  }
};

/*
 * Returns a number between 0 and 27 representing the row index of a cell in the grid model.
 * Throws and error if the cell name is invalid.
 */
export const getCellRow = (cellName: string) => {
  const level = /((?!-)(c|t|l|s)1?[0-9]$)|((?!-)s4_5)/.exec(cellName)?.[0];

  if (!level) {
    throw new Error(`Invalid cell name ${cellName}`);
  }

  if (level === 's4_5') {
    return 27;
  }

  const numericSegment = parseInt(level.slice(1));

  switch (level[0]) {
    case 'c':
      return numericSegment - 2;
    case 't':
      return numericSegment + 6;
    case 'l':
      return numericSegment + 18;
    case 's':
      return numericSegment + 23;
    default:
      throw new Error(`Invalid cell name ${cellName}`);
  }
};

/*
 * Returns the column and row index of a cell in the grid model.
 */
export const getCellPosition = (cellName: string) => {
  return {column: getCellColumn(cellName), row: getCellRow(cellName)};
};

/*
 * Returns an array of cells between two cells in the grid model.
 * The range is inclusive of the start and end cells.
 */
export const getRange = (
  start: {column: number; row: number},
  end: {column: number; row: number},
  gridModel: Array<Cell | null>[],
) => {
  const range: Cell[] = [];

  const rowStart = Math.min(start.row, end.row);
  const rowEnd = Math.max(start.row, end.row);
  const columnStart = Math.min(start.column, end.column);
  const columnEnd = Math.max(start.column, end.column);

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let column = columnStart; column <= columnEnd; column++) {
      const cell = gridModel[row][column];

      if (cell) {
        range.push(cell);
      }
    }
  }

  return range;
};

/*
 * Updates the state's active cell and cell selection through the app store provider.
 * This use case is called when the user clicks on a cell in the grid.
 * When the cell is null, the selection is cleared.
 * When the cell is not null, the selection is updated based on the selection mode.
 * `single` - The cell is the only cell in the selection.
 * `multiple` - The cell is added to the selection.
 * `range` - A range between the new cell and the current active cell is added to the selection.
 *
 * Use case:
 * 1. Get the cell from the grid model.
 * 2. If the selection mode is `single`,
 *  2.1. Set the active cell to the new cell.
 *  2.2. If the cell is not null, set the selection to the new cell, set it to an empty otherwise.
 *  2.3. Stop.
 * 3. If `cell` is null, leave things as they are.
 * 4. Cell is not null, so make it as the active cell.
 * 5. If the selection mode is `multiple`,
 *  5.1. If `cell` is already included in the selected cells, remove `cell` from the selection.
 *  5.2. If `cell` is not already included in the selected cells, add the new cell to the selection.
 *  5.3. Stop.
 * 6. If the selection mode is `range`,
 *  6.1. If there is no current active cell, stop, we cannot produce a range to add to the existing selection.
 *  6.2. Produce a new aggregated selection without duplicates between the range and the existing selection.
 *  6.3. Set the new selection.
 */
export const setActiveCellUseCase = async (
  cellName: string | null,
  currentActiveCell: Cell | null,
  selectionMode: 'single' | 'multiple' | 'range',
  currentCellsSelected: Cell[],
  gridModel: Array<Cell | null>[],
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  // 1. Get the cell from the grid model.
  const cell: Cell | null =
    cellName === null ? null : findCell(cellName, gridModel);

  // 2. If the selection mode is `single`,
  if (selectionMode === 'single') {
    // 2.1. Set the active cell to the new cell.
    await appStoreProvider.setActiveCell(cell);
    // 2.2. If the cell is not null, set the selection to the new cell, set it to an empty otherwise.
    await appStoreProvider.setSelectedCells(cell ? [cell] : []);
    // 2.3 Stop.
    return;
  }

  // 3. If `cell` is null, leave things as they are.
  // For `multiple` and `range` selection modes, if there is no cell to select we leave things as they are.
  if (!cell) {
    return;
  }

  // 4. Cell is not null, so make it as the active cell.
  await appStoreProvider.setActiveCell(cell);

  // 5. If the selection mode is `multiple`,
  if (selectionMode === 'multiple') {
    const cellIndex = currentCellsSelected.findIndex(
      (c) => c.name === cell.name,
    );
    // 5.1. If `cell` is already included in the selected cells, remove `cell` from the selection.
    // 5.2. If `cell` is not already included in the selected cells, add the new cell to the selection.
    await appStoreProvider.setSelectedCells(
      cellIndex === -1
        ? [...currentCellsSelected, cell]
        : currentCellsSelected.slice(cellIndex, 1),
    );

    // 5.3. Stop.
    return;
  }

  // 6. If the selection mode is `range`,
  // 6.1. If there is no current active cell, stop, we cannot produce a range to add to the existing selection.
  if (!currentActiveCell) {
    return;
  }

  // `range` mode will produce a new selection based on the range between the current active cell and the new cell.
  // We use the current selection as starting point.
  const selectedCells = [...currentCellsSelected];

  // 6.2. Produce a new aggregated selection without duplicates between the range and the existing selection.
  getRange(
    getCellPosition(cell.name),
    getCellPosition(currentActiveCell.name),
    gridModel,
  ).forEach((cell) => {
    if (!currentCellsSelected.find((c) => c.name === cell.name)) {
      selectedCells.push(cell);
    }
  });

  // 6.3. Set the new selection.
  await appStoreProvider.setSelectedCells(selectedCells);
};