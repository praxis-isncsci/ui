import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {
  getCellColumn,
  getCellPosition,
  getCellRow,
  getRange,
  setActiveCellUseCase,
} from './setActiveCell.useCase';
import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell} from '@core/domain';
import {bindExamDataToGridModel} from '@core/helpers';

const getEmptyCell = (name: string): Cell => {
  return {
    value: '',
    label: '',
    reasonImpairmentNotDueToSci: undefined,
    reasonImpairmentNotDueToSciSpecify: undefined,
    name,
  };
};

describe('setActiveCell.useCase.ts', () => {
  describe('getCellColumn', () => {
    [
      {cellName: 'right-motor-c5', expectedColumn: 0},
      {cellName: 'right-light-touch-c5', expectedColumn: 1},
      {cellName: 'right-pin-prick-c5', expectedColumn: 2},
      {cellName: 'left-light-touch-c5', expectedColumn: 3},
      {cellName: 'left-pin-prick-c5', expectedColumn: 4},
      {cellName: 'left-motor-c5', expectedColumn: 5},
    ].forEach((test) => {
      it(`should return ${test.expectedColumn} when cell name is ${test.cellName}`, () => {
        // Arrange - Act
        const column = getCellColumn(test.cellName);

        // Assert
        expect(column).toBe(test.expectedColumn);
      });

      it(`should throw an error when cell name is ${test.cellName} and invalid`, () => {
        // Arrange - Act
        const act = () => getCellColumn('invalid-cell-name');

        // Assert
        expect(act).toThrowError('Invalid cell name invalid-cell-name');
      });
    });
  });

  describe('getCellRow', () => {
    [
      {cellName: 'right-light-touch-c2', expectedRow: 0},
      {cellName: 'right-motor-c5', expectedRow: 3},
      {cellName: 'right-pin-prick-t1', expectedRow: 7},
      {cellName: 'right-pin-prick-t10', expectedRow: 16},
      {cellName: 'right-pin-prick-l1', expectedRow: 19},
      {cellName: 'right-pin-prick-l3', expectedRow: 21},
      {cellName: 'right-pin-prick-s1', expectedRow: 24},
      {cellName: 'right-pin-prick-s4_5', expectedRow: 27},
    ].forEach((test) => {
      it(`should return ${test.expectedRow} when cell name is ${test.cellName}`, () => {
        // Arrange - Act
        const row = getCellRow(test.cellName);

        // Assert
        expect(row).toBe(test.expectedRow);
      });

      it(`should throw an error when cell name is ${test.cellName} and invalid`, () => {
        // Arrange - Act
        const act = () => getCellRow('invalid-cell-name');

        // Assert
        expect(act).toThrowError('Invalid cell name invalid-cell-name');
      });
    });
  });

  describe('getCellPosition', () => {
    [
      {
        cellName: 'right-light-touch-c2',
        expectedColumn: 1,
        expectedRow: 0,
      },
      {
        cellName: 'right-motor-c5',
        expectedColumn: 0,
        expectedRow: 3,
      },
      {
        cellName: 'right-pin-prick-t1',
        expectedColumn: 2,
        expectedRow: 7,
      },
      {
        cellName: 'right-pin-prick-t10',
        expectedColumn: 2,
        expectedRow: 16,
      },
      {
        cellName: 'right-pin-prick-l1',
        expectedColumn: 2,
        expectedRow: 19,
      },
      {
        cellName: 'left-light-touch-l3',
        expectedColumn: 3,
        expectedRow: 21,
      },
      {
        cellName: 'left-motor-s1',
        expectedColumn: 5,
        expectedRow: 24,
      },
      {
        cellName: 'left-pin-prick-s4_5',
        expectedColumn: 4,
        expectedRow: 27,
      },
    ].forEach((test) => {
      it(`should return column ${test.expectedColumn} and row ${test.expectedRow} when cell name is ${test.cellName}`, () => {
        // Arrange - Act
        const position = getCellPosition(test.cellName);

        // Assert
        expect(position.column).toBe(test.expectedColumn);
        expect(position.row).toBe(test.expectedRow);
      });
    });
  });

  describe('getRange', () => {
    const gridModel = bindExamDataToGridModel({});

    [
      {
        startName: 'right-light-touch-c2',
        endName: 'right-motor-c5',
        expectedRangeNames: [
          'right-light-touch-c2',
          'right-light-touch-c3',
          'right-light-touch-c4',
          'right-light-touch-c5',
          'right-motor-c5',
        ],
      },
      {
        startName: 'right-motor-t1',
        endName: 'left-motor-t1',
        expectedRangeNames: [
          'left-light-touch-t1',
          'left-motor-t1',
          'left-pin-prick-t1',
          'right-light-touch-t1',
          'right-motor-t1',
          'right-pin-prick-t1',
        ],
      },
      {
        startName: 'left-motor-t1',
        endName: 'right-motor-c5',
        expectedRangeNames: [
          'left-light-touch-c5',
          'left-light-touch-c6',
          'left-light-touch-c7',
          'left-light-touch-c8',
          'left-light-touch-t1',
          'left-motor-c5',
          'left-motor-c6',
          'left-motor-c7',
          'left-motor-c8',
          'left-motor-t1',
          'left-pin-prick-c5',
          'left-pin-prick-c6',
          'left-pin-prick-c7',
          'left-pin-prick-c8',
          'left-pin-prick-t1',
          'right-light-touch-c5',
          'right-light-touch-c6',
          'right-light-touch-c7',
          'right-light-touch-c8',
          'right-light-touch-t1',
          'right-motor-c5',
          'right-motor-c6',
          'right-motor-c7',
          'right-motor-c8',
          'right-motor-t1',
          'right-pin-prick-c5',
          'right-pin-prick-c6',
          'right-pin-prick-c7',
          'right-pin-prick-c8',
          'right-pin-prick-t1',
        ],
      },
      {
        startName: 'left-motor-c5',
        endName: 'left-motor-s1',
        expectedRangeNames: [
          'left-motor-c5',
          'left-motor-c6',
          'left-motor-c7',
          'left-motor-c8',
          'left-motor-l2',
          'left-motor-l3',
          'left-motor-l4',
          'left-motor-l5',
          'left-motor-s1',
          'left-motor-t1',
        ],
      },
      {
        startName: 'right-pin-prick-t9',
        endName: 'right-pin-prick-s2',
        expectedRangeNames: [
          'right-pin-prick-l1',
          'right-pin-prick-l2',
          'right-pin-prick-l3',
          'right-pin-prick-l4',
          'right-pin-prick-l5',
          'right-pin-prick-s1',
          'right-pin-prick-s2',
          'right-pin-prick-t10',
          'right-pin-prick-t11',
          'right-pin-prick-t12',
          'right-pin-prick-t9',
        ],
      },
    ].forEach((test) => {
      it(`should return the range when starting at ${test.startName} and ending at ${test.endName}`, () => {
        // Arrange - Act
        const range = getRange(
          getCellPosition(test.startName),
          getCellPosition(test.endName),
          gridModel,
        );

        // Assert
        expect(range.map((cell) => cell.name).sort()).toEqual(
          test.expectedRangeNames,
        );
      });
    });
  });

  describe('setActiveCellUseCase', () => {
    let appStoreProvider: IIsncsciAppStoreProvider;
    let gridModel: Array<Cell | null>[] = [];

    beforeEach(() => {
      gridModel = bindExamDataToGridModel({});

      appStoreProvider = {
        setActiveCell: jest.fn(() => Promise.resolve()),
        setGridModel: jest.fn(() => Promise.resolve()),
        setSelectedCells: jest.fn(() => Promise.resolve()),
        setTotals: jest.fn(() => Promise.resolve()),
        updateStatus: jest.fn(() => Promise.resolve()),
      };
    });

    it('should set the cell matching `cellName` as active cell and only selected cell when `cellName` is not null and selection mode is `single`', async () => {
      // Arrange
      const cellName = 'right-light-touch-c5';
      const cell = getEmptyCell(cellName);
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'single';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(cell);
      expect(appStoreProvider.setSelectedCells).toHaveBeenCalledWith([cell]);
    });

    it('should set `null` as active cell and empty array as selected cells when `cellName` is `null` and selection mode is `single`', async () => {
      // Arrange
      const cellName: string | null = null;
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'single';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(null);
      expect(appStoreProvider.setSelectedCells).toHaveBeenCalledWith([]);
    });

    it('should throw an exception when `cellName` is not valid', async () => {
      // Arrange
      const cellName = 'invalid-cell-name';
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'single';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
      ];
      let errorMessage = '';

      // Act
      try {
        await setActiveCellUseCase(
          cellName,
          currentActiveCell,
          selectionMode,
          currentCellsSelected,
          gridModel,
          appStoreProvider,
        );
      } catch (error) {
        errorMessage = (error as Error).message;
      }

      // Assert
      expect(errorMessage).toBe(`Invalid cell name ${cellName}`);
    });

    it('should throw an exception when `cellName` is not valid', async () => {
      // Arrange
      const cellName = 'left-motor-c2';
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'single';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
      ];
      let errorMessage = '';

      // Act
      try {
        await setActiveCellUseCase(
          cellName,
          currentActiveCell,
          selectionMode,
          currentCellsSelected,
          gridModel,
          appStoreProvider,
        );
      } catch (error) {
        errorMessage = (error as Error).message;
      }

      // Assert
      expect(errorMessage).toBe(`Cell ${cellName} not found`);
    });

    it('should leave things as they are when `cellName` is null and selection mode is `multiple`', async () => {
      // Arrange
      const cellName: string | null = null;
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'multiple';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
        getEmptyCell('right-motor-t1'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).not.toHaveBeenCalled();
      expect(appStoreProvider.setSelectedCells).not.toHaveBeenCalled();
    });

    it('should leave things as they are when `cellName` is null and selection mode is `range`', async () => {
      // Arrange
      const cellName: string | null = null;
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'range';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
        getEmptyCell('right-motor-t1'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).not.toHaveBeenCalled();
      expect(appStoreProvider.setSelectedCells).not.toHaveBeenCalled();
    });

    it('should set the cell matching `cellName` as active cell and remove `cell` from the cell selection when `cellName` is not null, selection mode is multiple, and `cell` is already included in the cell selection', async () => {
      // Arrange
      const cellName = 'right-light-touch-c5';
      const cell = getEmptyCell(cellName);
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'multiple';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
        getEmptyCell(cellName),
        getEmptyCell('right-motor-t1'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(cell);
      expect(appStoreProvider.setSelectedCells).toHaveBeenCalledWith(
        currentCellsSelected.slice(1, 1),
      );
    });

    it('should set the cell matching `cellName` as active cell and add `cell` to the current selection when `cellName` is not null and selection mode is `multiple`', async () => {
      // Arrange
      const cellName = 'right-light-touch-c5';
      const cell = getEmptyCell(cellName);
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'multiple';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
        getEmptyCell('right-motor-t1'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(cell);
      expect(appStoreProvider.setSelectedCells).toHaveBeenCalledWith([
        ...currentCellsSelected,
        cell,
      ]);
    });

    /*
     *  5.1. If there is no current active cell, stop, we cannot produce a range to add to the existing selection.
     *  5.2. Produce a new aggregated selection without duplicates between the range and the existing selection.
     *  5.3. Set the new selection.
     */

    it('should set the cell matching `cellName` as active cell but leave the current cell selection as is when `cellName` is not `null` but the current active cell is `null` and selection mode is `range`', async () => {
      // Arrange
      const cellName = 'right-light-touch-c5';
      const cell = getEmptyCell(cellName);
      const currentActiveCell: Cell | null = null;
      const selectionMode = 'range';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
        getEmptyCell('right-motor-t1'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(cell);
      expect(appStoreProvider.setSelectedCells).not.toHaveBeenCalled();
    });

    it('should set the cell matching `cellName` as active cell and add the range between `cell` and `currentCellSelected`, without any duplicates, when `cellName` and `currentSelectedCell` are not `null` and `selectionMode` is `range`', async () => {
      // Arrange
      const cellName = 'left-motor-c5';
      const cell = getEmptyCell(cellName);
      const currentActiveCell = getEmptyCell('left-motor-t1');
      const selectionMode = 'range';
      const currentCellsSelected: Cell[] = [
        getEmptyCell('right-light-touch-c2'),
        getEmptyCell('right-motor-t1'),
      ];
      const expectedSelection: Cell[] = [
        ...currentCellsSelected,
        getEmptyCell('left-motor-c5'),
        getEmptyCell('left-motor-c6'),
        getEmptyCell('left-motor-c7'),
        getEmptyCell('left-motor-c8'),
        getEmptyCell('left-motor-t1'),
      ];

      // Act
      await setActiveCellUseCase(
        cellName,
        currentActiveCell,
        selectionMode,
        currentCellsSelected,
        gridModel,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(cell);
      expect(appStoreProvider.setSelectedCells).toHaveBeenCalledWith(
        expectedSelection,
      );
    });
  });
});
