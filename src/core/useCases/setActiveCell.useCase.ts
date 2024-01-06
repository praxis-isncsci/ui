import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell} from '@core/domain';
import {findCell, getCellPosition, getCellRange} from '@core/helpers';

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
 *  4.1. If there is no current active cell, stop, we cannot produce a range to add to the existing selection.
 *  4.2. Produce a new aggregated selection without duplicates between the range and the existing selection.
 *  4.3. Set the new selection.
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

  // 4. If the selection mode is `range`,
  // `range` mode will produce a new selection based on the range between the current active cell and the new cell.
  // We use the current selection as starting point.
  const selectedCells = [...currentCellsSelected];

  // 4.1. If there is no current active cell or no cell was selected, stop, we cannot produce a range to add to the existing selection.
  if (!cell || !currentActiveCell) {
    await appStoreProvider.setActiveCell(cell, selectedCells);

    return;
  }

  // 4.2. Produce a new aggregated selection without duplicates between the range and the existing selection.
  const {motorRange, sensoryRange} = getCellRange(
    getCellPosition(cell.name),
    getCellPosition(currentActiveCell.name),
    gridModel,
  );

  motorRange.concat(sensoryRange).forEach((cell) => {
    if (!currentCellsSelected.find((c) => c.name === cell.name)) {
      selectedCells.push(cell);
    }
  });

  // 4.3. Set the new active cell and selection.
  await appStoreProvider.setActiveCell(cell, selectedCells);
};
