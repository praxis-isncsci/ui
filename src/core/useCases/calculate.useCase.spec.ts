import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {
  bindExamDataToGridModel,
  getExamDataWithAllNormalValues,
} from '@core/helpers';
import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {getAppStoreProviderMock} from '@testHelpers/appStoreProviderMocks';
import {calculateUseCase} from './calculate.useCase';
import {IsncsciExamProvider} from '@app/providers';

describe('calculate.useCase.ts', () => {
  let appStoreProvider: IIsncsciAppStoreProvider;
  let externalMessageProvider: IExternalMessageProvider;
  const examProvider = new IsncsciExamProvider();

  beforeEach(() => {
    appStoreProvider = getAppStoreProviderMock();
    externalMessageProvider = {
      sendOutExamData: jest.fn(),
    };
    jest.resetModules();
  });

  it('can calculate exam with VAC and DAP equal to `UNK`', async () => {
    // Arrange
    const vac = 'UNK';
    const dap = 'UNK';
    const gridModel = bindExamDataToGridModel(getExamDataWithAllNormalValues());

    // Act
    try {
      await calculateUseCase(
        gridModel,
        vac,
        dap,
        null,
        null,
        '',
        appStoreProvider,
        examProvider,
        externalMessageProvider,
      );
    } catch (error: any) {
      throw new Error(`Calculation failed: ${error.message}`);
    }

    // Assert
    expect(appStoreProvider.setTotals).toBeCalled();
    expect(externalMessageProvider.sendOutExamData).toBeCalled();
  });
});
