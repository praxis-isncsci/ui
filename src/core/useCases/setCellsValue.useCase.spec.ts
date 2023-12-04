import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell} from '@core/domain';
import {bindExamDataToGridModel, findCell, motorCellRegex} from '@core/helpers';
import {setCellsValueUseCase} from './setCellsValue.useCase';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';

describe('setCellValue.useCase.spec', () => {
  describe('setCellValueUseCase', () => {
    let appStoreProvider: IIsncsciAppStoreProvider;
    let gridModel: Array<Cell | null>[] = [];

    beforeEach(() => {
      appStoreProvider = getAppStoreProviderMock();
      gridModel = bindExamDataToGridModel({});
      jest.resetModules();
    });

    it('should throw an invalid value error when `value` is `5*`', async () => {
      // Arrange
      const value = '5*';
      const selectedCells = [findCell('right-light-touch-c2', gridModel)];
      const propagateDown = false;
      let errorMessage = '';

      // Act
      try {
        await setCellsValueUseCase(
          value,
          selectedCells,
          gridModel,
          propagateDown,
          appStoreProvider,
        );
      } catch (error) {
        errorMessage = (error as Error).message;
      }

      // Assert
      expect(errorMessage).toBe(`Invalid value: ${value}`);
    });

    it('should set the value `1` to only `left-pin-prick-c2` when only `left-pin-prick-c2` is selected, `value` is `1`, and `propagateDown` is `false`', async () => {
      // Arrange
      const value = '1';
      const selectedCells = [findCell('left-pin-prick-c2', gridModel)];
      const propagateDown = false;
      const expectedCells = selectedCells.slice();

      // Act
      await setCellsValueUseCase(
        value,
        selectedCells,
        gridModel,
        propagateDown,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        expectedCells,
        value,
      );
    });

    it('should not call `setCellsValue` when only `left-pin-prick-c2` is selected (sensory cell), `value` is `4` (motor value), and `propagateDown` is `true`', async () => {
      // Arrange
      const value = '4';
      const selectedCells = [findCell('left-pin-prick-c2', gridModel)];
      const propagateDown = true;

      // Act
      await setCellsValueUseCase(
        value,
        selectedCells,
        gridModel,
        propagateDown,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).not.toHaveBeenCalled();
    });

    it('should set the value `1` to the entire `left-pin-prick` row when only `left-pin-prick-c2` is selected, `value` is `1`, and `propagateDown` is `true`', async () => {
      // Arrange
      const value = '1';
      const selectedCells = [findCell('left-pin-prick-c2', gridModel)];
      const propagateDown = true;
      const expectedCells: Array<Cell | null> = [];

      gridModel.forEach((row) => expectedCells.push(row[4]));

      // Act
      await setCellsValueUseCase(
        value,
        selectedCells,
        gridModel,
        propagateDown,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        expectedCells,
        value,
      );
    });

    it('should not call `setCellsValue` `value` is `4` (motor value) and only sensory cells are selected', async () => {
      // Arrange
      const value = '4';
      const selectedCells = [
        findCell('left-light-touch-c2', gridModel),
        findCell('left-pin-prick-c2', gridModel),
      ];
      const propagateDown = true;

      // Act
      await setCellsValueUseCase(
        value,
        selectedCells,
        gridModel,
        propagateDown,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).not.toHaveBeenCalled();
    });

    it('should set the value `5` (motor value) to only the motor cells selected when `value` is `5` and multiple cells are selected', () => {
      // Arrange
      const value = '5';
      const selectedCells = [
        findCell('left-light-touch-c2', gridModel),
        findCell('left-pin-prick-c2', gridModel),
        findCell('left-motor-c5', gridModel),
        findCell('right-motor-s1', gridModel),
      ];
      const propagateDown = true;
      const expectedCells: Array<Cell | null> = [];

      selectedCells.forEach((cell) => {
        if (motorCellRegex.test(cell.name)) {
          expectedCells.push(cell);
        }
      });

      // Act
      setCellsValueUseCase(
        value,
        selectedCells,
        gridModel,
        propagateDown,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        expectedCells,
        value,
      );
    });

    it('should set the value `NT*` to all selected cells when `value` is `NT*` and multiple cells are selected, and `propagateDown` is `false`', () => {
      // Arrange
      const value = 'NT*';
      const selectedCells = [
        findCell('left-light-touch-c2', gridModel),
        findCell('left-pin-prick-c2', gridModel),
        findCell('left-motor-c5', gridModel),
        findCell('right-motor-s1', gridModel),
      ];
      const propagateDown = false;

      // Act
      setCellsValueUseCase(
        value,
        selectedCells,
        gridModel,
        propagateDown,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        selectedCells,
        value,
      );
    });
  });
});
