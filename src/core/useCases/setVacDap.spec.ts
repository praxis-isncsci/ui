import {describe, expect, it} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {setVacDapUseCase} from './setVacDap.useCase';

describe('setActiveCell.useCase.ts', () => {
  describe('setActiveCellUseCase', () => {
    it('sets the VAC and DAP values using the App Store Provider', async () => {
      // Arrange
      const appStoreProvider = getAppStoreProviderMock();

      // Act
      setVacDapUseCase('Yes', 'No', appStoreProvider);

      // Assert
      expect(appStoreProvider.setVacDap).toHaveBeenCalledWith('Yes', 'No');
    });
  });
});
