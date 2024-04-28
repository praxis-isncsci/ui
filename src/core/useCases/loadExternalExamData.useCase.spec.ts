import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {getExamDataWithAllNormalValues} from '@core/helpers';
import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {loadExternalExamDataUseCase} from './loadExternalExamData.useCase';

describe('loadExternalExamData.useCase.ts', () => {
  describe('loadExternalExamDataUseCase', () => {
    let appStoreProvider: IIsncsciAppStoreProvider;
    let externalMessageProvider: IExternalMessageProvider;

    beforeEach(() => {
      appStoreProvider = getAppStoreProviderMock();
      externalMessageProvider = {
        sendOutExamData: jest.fn(),
      };
      jest.resetModules();
    });

    it('loads an exam from an external source', async () => {
      // Arrange
      const examData = getExamDataWithAllNormalValues();

      // Act
      await loadExternalExamDataUseCase(appStoreProvider, examData);

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(null, []);
      expect(appStoreProvider.setGridModel).toHaveBeenCalled();
      expect(appStoreProvider.setTotals).toHaveBeenCalled();
      expect(appStoreProvider.setVacDap).toHaveBeenCalledWith(
        examData.voluntaryAnalContraction,
        examData.deepAnalPressure,
      );
      expect(appStoreProvider.setExtraInputs).toHaveBeenCalled();
      expect(appStoreProvider.setCalculationError).toHaveBeenCalledWith('');
    });
  });
});
