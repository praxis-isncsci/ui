import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {
  bindExamDataToGridModel,
  bindExamDataToTotals,
  validateExamData,
} from '@core/helpers';

export const loadExternalExamDataUseCase = async (
  appStoreProvider: IIsncsciAppStoreProvider,
  examData: {[key: string]: string},
) => {
  // 1. Validate exam data
  const errors = validateExamData(examData);

  if (errors.length > 0) {
    throw new Error(`Invalid exam data: ${errors.join(', ')}`);
  }

  // 2. Bind exam data to a new grid model
  const gridModel = bindExamDataToGridModel(examData);

  // 3. Bind exam data to the totals
  const totals = bindExamDataToTotals(examData);

  // 4. Update state
  await appStoreProvider.setGridModel(gridModel);
  await appStoreProvider.setTotals(totals);
};
