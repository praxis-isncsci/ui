import {describe, expect, it} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {setExtraInputsUseCase} from './setExtraInputs.useCase';

describe('setExtraInputs.useCase.ts', () => {
  describe('setExtraInputsUseCase', () => {
    it('sets the right and left lowest non-key muscles with motor function and the comments in the application state using the App Store Provider', async () => {
      // Arrange
      const appStoreProvider = getAppStoreProviderMock();
      const rightLowestNonKeyMuscleWithMotorFunction = 'C5';
      const leftLowestNonKeyMuscleWithMotorFunction = 'C6';
      const comments = 'This is a comment';

      // Act
      setExtraInputsUseCase(
        rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction,
        comments,
        appStoreProvider,
      );

      // Assert
      expect(appStoreProvider.setExtraInputs).toHaveBeenCalledWith(
        rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction,
        comments,
      );
    });
  });
});
