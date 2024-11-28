import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {
  bindExamDataToGridModel,
  bindExamDataToTotals,
  getEmptyExamData,
} from '@core/helpers/examData.helper';

/*
 * 1. Generate an empty exam
 * 2. Bind the empty exam to the grid model
 * 3. Bind the empty exam to the totals
 * 4. Update the state
 * 5. Update external listeners
 */
export const clearExamUseCase = async (
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  const emptyExamData = getEmptyExamData();
  const gridModel = bindExamDataToGridModel(emptyExamData);
  const totals = bindExamDataToTotals(emptyExamData);

  try {
    await appStoreProvider.setActiveCell(null, []);
    await appStoreProvider.setGridModel(gridModel);
    await appStoreProvider.setTotals(totals);
    await appStoreProvider.setVacDap(null, null);
    await appStoreProvider.setExtraInputs(null, null, '', '');
    await externalMessageProvider.sendOutExamData(emptyExamData);
  } catch (error) {
    console.log(error);
  }
};
