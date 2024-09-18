import { IIsncsciAppStoreProvider } from '@core/boundaries';
import { Cell } from '@core/domain';
import { findCell, getCellPosition, getCellRange } from '@core/helpers';

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
 * 3. If the selection mode is `multiple`,
 *  3.1 If `cell` is null, set `null` as active cell and leave the selection as is and stop.
 *  3.2. If `cell` is already included in the selected cells, remove `cell` from the selection.
 *  3.3. If `cell` is not already included in the selected cells, add the new cell to the selection.
 *  3.4. Stop.
 * 4. If the selection mode is `range`,
 *  4.1. If there is no current active cell or `cell` is null, treat as single selection.
 *  4.2. Produce the range between the active cell and the new cell.
 *  4.3. Replace the existing selection with the new range.
 *  4.4. Stop
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
    // 2.2. If the cell is not null, set the selection to the new cell, set it to an empty otherwise.
    await appStoreProvider.setActiveCell(cell, cell ? [cell] : []);
    // 2.3 Stop.
    return;
  }

  // 3. If the selection mode is `multiple`,
  if (selectionMode === 'multiple') {
    // 3.1 If `cell` is null, set `null` as active cell and leave the selection as is and stop.
    if (!cell) {
      await appStoreProvider.setActiveCell(cell, [...currentCellsSelected]);

      return;
    }

    const cellIndex = currentCellsSelected.findIndex(
      (c) => c.name === cell.name,
    );

    // 3.2. If `cell` is already included in the selected cells, remove `cell` from the selection.
    // 3.3. If `cell` is not already included in the selected cells, add the new cell to the selection.
    const selectedCells =
      cellIndex === -1
        ? [...currentCellsSelected, cell]
        : currentCellsSelected.slice(cellIndex, 1);

    await appStoreProvider.setActiveCell(cell, selectedCells);

    // 3.4. Stop.
    return;
  }

  // 4. If the selection mode is `range`
  // `range` mode will produce a new selection based on the range between the current active cell and the new cell.
  if (selectionMode === 'range') {
    // 4.1. If there is no current active cell or `cell` is null, treat as single selection.
    if (!currentActiveCell || !cell) {
      await appStoreProvider.setActiveCell(cell, cell ? [cell] : []);
      return;
    }

    // 4.2. Produce the range between the active cell and the new cell.
    const { motorRange, sensoryRange } = getCellRange(
      getCellPosition(currentActiveCell.name),
      getCellPosition(cell.name),
      gridModel,
    );

    const rangeCells = motorRange.concat(sensoryRange);

    // 4.3. Replace the existing selection with the new range.
    await appStoreProvider.setActiveCell(cell, rangeCells);

    // 4.4. Stop
    return;
  }
}