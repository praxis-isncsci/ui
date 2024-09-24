import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {setExtraInputsUseCase} from './setExtraInputs.useCase';
import {Cell} from '@core/domain';
import {
  bindExamDataToGridModel,
  getEmptyExamData,
  getEmptyTotals,
} from '@core/helpers/examData.helper';

describe('setExtraInputs.useCase.ts', () => {
  describe('setExtraInputsUseCase', () => {
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

    it('sets the right and left lowest non-key muscles with motor function and the comments in the application state using the App Store Provider', async () => {
      // Arrange
      const rightLowestNonKeyMuscleWithMotorFunction = 'C5';
      const leftLowestNonKeyMuscleWithMotorFunction = 'C6';
      const comments = 'This is a comment';
      const cellComments = 'Specify cell comments'

      // Act
      await setExtraInputsUseCase(
        gridModel,
        null,
        null,
        rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction,
        comments,
        cellComments,
        appStoreProvider,
        externalMessageProvider,
      );

      // Assert
      expect(appStoreProvider.setExtraInputs).toHaveBeenCalledWith(
        rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction,
        comments,
      );
      expect(externalMessageProvider.sendOutExamData).toHaveBeenCalled();
      expect(appStoreProvider.clearTotalsAndErrors).toHaveBeenCalled();
    });
  });
});
