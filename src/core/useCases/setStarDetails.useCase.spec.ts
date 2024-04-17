import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {Cell} from '@core/domain';
import {bindExamDataToGridModel, findCell} from '@core/helpers';
import {setStarDetailsUseCase} from './setStarDetails.useCase';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {getEmptyExamData} from '@core/helpers/examData.helper';

describe('setStarDetails.useCase.spec', () => {
  describe('setStarDetailsUseCase', () => {
    let appStoreProvider: IIsncsciAppStoreProvider;
    let externalMessageProvider: IExternalMessageProvider;
    let gridModel: Array<Cell | null>[] = [];

    beforeEach(() => {
      appStoreProvider = getAppStoreProviderMock();
      externalMessageProvider = {
        sendOutExamData: jest.fn(),
      };
      gridModel = bindExamDataToGridModel(getEmptyExamData());
      jest.resetModules();
    });

    it('throws an error when no cell is selected if the selected cells are not flagged with a star', async () => {
      // Arrange
      const selectedCells: Cell[] = [];
      let errorMessage = '';
      const expectedError = '`selectedCells` must contain at least one cell';

      // Act
      try {
        await setStarDetailsUseCase(
          null,
          undefined,
          undefined,
          selectedCells,
          gridModel,
          null,
          null,
          null,
          null,
          '',
          false,
          appStoreProvider,
          externalMessageProvider,
        );
      } catch (error) {
        errorMessage = (error as Error).message;
      }

      // Assert
      expect(appStoreProvider.setCellsValue).not.toHaveBeenCalled();
      expect(errorMessage).toBe(expectedError);
    });

    it('throws an error when the selected cell is not flagged with a star', async () => {
      // Arrange
      const c2 = findCell('right-light-touch-c2', gridModel);
      c2.value = '1';
      c2.label = '1';
      const selectedCells = [c2];
      let errorMessage = '';
      const expectedError =
        'In order to indicate impairment not due to an SCI, the cells must be flagged with a star';

      // Act
      try {
        await setStarDetailsUseCase(
          null,
          undefined,
          undefined,
          selectedCells,
          gridModel,
          null,
          null,
          null,
          null,
          '',
          false,
          appStoreProvider,
          externalMessageProvider,
        );
      } catch (error) {
        errorMessage = (error as Error).message;
      }

      // Assert
      expect(appStoreProvider.setCellsValue).not.toHaveBeenCalled();
      expect(appStoreProvider.setCalculationError).not.toHaveBeenCalled();
      expect(errorMessage).toBe(expectedError);
    });

    it('provides a range of cells when only one cell is selected, `propagateDown` is set to `true` and the cells below the selected cell match in value', async () => {
      // Arrange
      const c2 = findCell('right-light-touch-c2', gridModel);
      c2.value = '1*';
      c2.label = '1*';
      const c3 = findCell('right-light-touch-c3', gridModel);
      c3.value = '1*';
      c3.label = '1*';
      const c4 = findCell('right-light-touch-c4', gridModel);
      c4.value = '1*';
      c4.label = '1*';
      const c5 = findCell('right-light-touch-c5', gridModel);
      c5.value = '1*';
      c5.label = '1*';
      const selectedCells = [c2];
      const expectedRange = [c2, c3, c4, c5];

      // Act
      await setStarDetailsUseCase(
        false,
        'a',
        'b',
        selectedCells,
        gridModel,
        null,
        null,
        null,
        null,
        '',
        true,
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        expectedRange,
        '1*',
        '1*',
        undefined,
        'a',
        'b',
      );
      expect(appStoreProvider.clearTotalsAndErrors).toHaveBeenCalled();
    });

    [
      {
        a: {
          value: '1*',
          error: undefined,
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
        b: {
          value: '2*',
          error: undefined,
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
      },
      {
        a: {
          value: '1*',
          error: undefined,
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
        b: {
          value: '1*',
          error: 'error',
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
      },
      {
        a: {
          value: '1*',
          error: undefined,
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
        b: {
          value: '1*',
          error: undefined,
          reasonImpairmentNotDueToSci: 'reason',
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
      },
      {
        a: {
          value: '1*',
          error: undefined,
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: undefined,
        },
        b: {
          value: '1*',
          error: undefined,
          reasonImpairmentNotDueToSci: undefined,
          reasonImpairmentNotDueToSciSpecify: 'sepecify',
        },
      },
    ].forEach(({a, b}) => {
      it(`throws an error when the selected cells do not have the same value [${a.value}, ${b.value}], error [${a.error}, ${b.error}], reason [${a.reasonImpairmentNotDueToSci}, ${b.reasonImpairmentNotDueToSci}], and reason comments [${a.reasonImpairmentNotDueToSciSpecify}, ${b.reasonImpairmentNotDueToSciSpecify}]`, async () => {
        // Arrange
        const c2 = findCell('right-light-touch-c2', gridModel);
        c2.value = a.value;
        c2.error = a.error;
        c2.reasonImpairmentNotDueToSci = a.reasonImpairmentNotDueToSci;
        c2.reasonImpairmentNotDueToSciSpecify =
          a.reasonImpairmentNotDueToSciSpecify;
        const c3 = findCell('right-light-touch-c3', gridModel);
        c3.value = b.value;
        c3.error = b.error;
        c3.reasonImpairmentNotDueToSci = b.reasonImpairmentNotDueToSci;
        c3.reasonImpairmentNotDueToSciSpecify =
          b.reasonImpairmentNotDueToSciSpecify;
        const selectedCells = [c2, c3];
        let errorMessage = '';
        const expectedError =
          'All cells must have the same value, considered normal or not normal, reasonImpairmentNotDueToSci, and reasonImpairmentNotDueToSciSpecify';

        // Act
        try {
          await setStarDetailsUseCase(
            null,
            undefined,
            undefined,
            selectedCells,
            gridModel,
            null,
            null,
            null,
            null,
            '',
            false,
            appStoreProvider,
            externalMessageProvider,
          );
        } catch (error) {
          errorMessage = (error as Error).message;
        }

        // Assert
        expect(appStoreProvider.setCellsValue).not.toHaveBeenCalled();
        expect(appStoreProvider.setCalculationError).not.toHaveBeenCalled();
        expect(errorMessage).toBe(expectedError);
      });
    });

    it('calls `appStoreProvider.setCellsValue` with the selected cells and the values when multiple cells are selected', async () => {
      // Arrange
      const c2 = findCell('right-light-touch-c2', gridModel);
      c2.value = '1*';
      c2.label = '1*';
      const t3 = findCell('left-light-touch-t3', gridModel);
      t3.value = '1*';
      t3.label = '1*';
      const c4 = findCell('right-pin-prick-c4', gridModel);
      c4.value = '1*';
      c4.label = '1*';
      const c8 = findCell('left-motor-c8', gridModel);
      c8.value = '1*';
      c8.label = '1*';
      const selectedCells = [c2, t3, c4, c8];

      // Act
      await setStarDetailsUseCase(
        false,
        'a',
        'b',
        selectedCells,
        gridModel,
        null,
        null,
        null,
        null,
        '',
        true,
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        selectedCells,
        '1*',
        '1*',
        undefined,
        'a',
        'b',
      );
      expect(appStoreProvider.clearTotalsAndErrors).toHaveBeenCalled();
    });

    it('flags the value with double star when consider normal is set to true', async () => {
      // Arrange
      const c2 = findCell('right-light-touch-c2', gridModel);
      c2.value = '1*';
      c2.label = '1*';
      const selectedCells = [c2];

      // Act
      await setStarDetailsUseCase(
        true,
        'a',
        'b',
        selectedCells,
        gridModel,
        null,
        null,
        null,
        null,
        '',
        true,
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        selectedCells,
        '1**',
        '1*',
        undefined,
        'a',
        'b',
      );
      expect(appStoreProvider.clearTotalsAndErrors).toHaveBeenCalledWith();
    });

    it('sets an error message on the cells when consider normal is null', async () => {
      // Arrange
      const c2 = findCell('right-light-touch-c2', gridModel);
      c2.value = '1*';
      c2.label = '1*';
      const selectedCells = [c2];

      // Act
      await setStarDetailsUseCase(
        null,
        'a',
        'b',
        selectedCells,
        gridModel,
        null,
        null,
        null,
        null,
        '',
        true,
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        selectedCells,
        '1*',
        '1*',
        'Please indicate if the value should be considered normal or not normal.',
        'a',
        'b',
      );
      expect(appStoreProvider.clearTotalsAndErrors).toHaveBeenCalled();
    });

    /*
     * I am adding this test because we were getting an infinite loop when
     *   1. We select `C5 motor`
     *   2. We press the `1*` input button, setting all right motor values to `1*`
     *   3. We select `consider normal` from the star details inputs
     *   4. The `propagateDown` flag is set to true
     */
    it('calls `appStoreProvider.setCellsValue` with all the right motor cells and sets the value to `1**` when only C5 Motor is selected and all right motor values are set to `1*` and we are setting `considerNormal = true`', async () => {
      // Arrange
      const value = '1*';
      const selectedCells: Cell[] = [];

      gridModel.forEach((row) => {
        const cell = row[0];

        if (cell) {
          cell.value = value;
          cell.label = value;
          selectedCells.push(cell);
        }
      });

      // Act
      await setStarDetailsUseCase(
        true,
        undefined,
        undefined,
        selectedCells,
        gridModel,
        null,
        null,
        null,
        null,
        '',
        true,
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setCellsValue).toHaveBeenCalledWith(
        selectedCells,
        '1**',
        '1*',
        undefined,
        undefined,
        undefined,
      );

      expect(appStoreProvider.clearTotalsAndErrors).toHaveBeenCalled();
    });
  });
});
