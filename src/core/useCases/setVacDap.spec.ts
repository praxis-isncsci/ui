import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {setVacDapUseCase} from './setVacDap.useCase';
import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {Cell} from '@core/domain';
import {
  bindExamDataToGridModel,
  getEmptyExamData,
  getEmptyTotals,
} from '@core/helpers/examData.helper';

describe('setVacDap.useCase.ts', () => {
  describe('setVacDapUseCase', () => {
    let appStoreProvider: IIsncsciAppStoreProvider;
    let externalMessageProvider: IExternalMessageProvider;
    let gridModel: Array<Cell | null>[] = [];

    beforeEach(() => {
      gridModel = bindExamDataToGridModel(getEmptyExamData());
      appStoreProvider = getAppStoreProviderMock();
      externalMessageProvider = {
        sendOutExamData: jest.fn(),
      };
      jest.resetModules();
    });

    it('sets the VAC and DAP values using the App Store Provider', async () => {
      // Arrange - Act
      await setVacDapUseCase(
        gridModel,
        'Yes',
        'No',
        null,
        null,
        '',
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setVacDap).toHaveBeenCalledWith('Yes', 'No');
      expect(externalMessageProvider.sendOutExamData).toHaveBeenCalled();
      expect(appStoreProvider.setTotals).toHaveBeenCalledWith(getEmptyTotals());
    });
  });
});
