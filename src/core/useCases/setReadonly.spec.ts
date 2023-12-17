import {describe, expect, it} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {setReadonlyUseCase} from './setReadonly.useCase';

describe('setReadonly.useCase.ts', () => {
  describe('setReadonlyUseCase', () => {
    it('calls the setReadonly method on the app store provider and passes the readonly flag', async () => {
      // Arrange
      const appStoreProvider = getAppStoreProviderMock();

      // Act
      setReadonlyUseCase(true, appStoreProvider);

      // Assert
      expect(appStoreProvider.setReadonly).toHaveBeenCalledWith(true);
    });
  });
});
