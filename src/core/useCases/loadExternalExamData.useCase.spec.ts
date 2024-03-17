import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {getEmptyExamData} from '@core/helpers';
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

    it('sets the VAC and DAP values using the App Store Provider', async () => {
      // Arrange
      const vac = 'Yes';
      const dap = 'No';
      const examData = getEmptyExamData();
      examData.voluntaryAnalContraction = vac;
      examData.deepAnalPressure = dap;

      // Act
      await loadExternalExamDataUseCase(appStoreProvider, examData);

      // Assert
      expect(appStoreProvider.setActiveCell).toHaveBeenCalledWith(null, []);
      expect(appStoreProvider.setGridModel).toHaveBeenCalled();
      expect(appStoreProvider.setTotals).toHaveBeenCalled();
      expect(appStoreProvider.setVacDap).toHaveBeenCalledWith(vac, dap);
      expect(appStoreProvider.setExtraInputs).toHaveBeenCalled();
    });
  });
});
