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

  it('calculates exam with VAC and DAP equal to `UNK`', async () => {
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

  it('reports an error if there are missing values', async () => {
    // Arrange
    const vac = 'UNK';
    const dap = 'UNK';
    const gridModel = bindExamDataToGridModel(getExamDataWithAllNormalValues());
    const rightPinPrickT5 = gridModel[11][2];
    rightPinPrickT5!.value = '';
    rightPinPrickT5!.label = '';

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
      // Do nothing
    }

    // Assert
    expect(appStoreProvider.setCalculationError).toBeCalledWith(
      'Missing values:\nright-pin-prick-t5',
    );
    expect(externalMessageProvider.sendOutExamData).toBeCalled();
    expect(appStoreProvider.setTotals).not.toBeCalled();
  });

  it('reports an error if validation fails', async () => {
    // Arrange
    const vac = 'UNK';
    const dap = 'UNK';
    const gridModel = bindExamDataToGridModel(getExamDataWithAllNormalValues());
    const rightPinPrickT5 = gridModel[11][2];
    rightPinPrickT5!.value = '5';
    rightPinPrickT5!.label = '5';

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
      // Do nothing
    }

    // Assert
    expect(appStoreProvider.setCalculationError).toBeCalledWith(
      'The exam contains errors:\nInvalid value (5) for rightPinPrickT5',
    );
    expect(externalMessageProvider.sendOutExamData).toBeCalled();
    expect(appStoreProvider.setTotals).not.toBeCalled();
  });
});
