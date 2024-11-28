import { IIsncsciAppStoreProvider } from '@core/boundaries';
import { ExamData } from '@core/domain';
import {
  bindExamDataToGridModel,
  bindExamDataToTotals,
} from '@core/helpers';

export const loadExternalExamDataUseCase = async (
  appStoreProvider: IIsncsciAppStoreProvider,
  examData: ExamData,
) => {
  //Sun: Dont validate the input, error will only be shown after calculation
  // EE: We do not validate anymore as we do not want to trigger the alert box when loading an external exam
  // We, however, still need to clear the error in case a previous exam with error was loaded.
  // // 1. Validate exam data
  // const errors = validateExamData(examData);

  await appStoreProvider.setCalculationError('');

  // 2. Bind exam data to a new grid model
  const gridModel = bindExamDataToGridModel(examData);

  // 3. Bind exam data to the totals
  const totals = bindExamDataToTotals(examData);

  // 4. Update state
  await appStoreProvider.setActiveCell(null, []);
  await appStoreProvider.setGridModel(gridModel);
  await appStoreProvider.setTotals(totals);
  await appStoreProvider.setVacDap(
    examData.voluntaryAnalContraction,
    examData.deepAnalPressure,
  );
  await appStoreProvider.setExtraInputs(
    examData.rightLowestNonKeyMuscleWithMotorFunction,
    examData.leftLowestNonKeyMuscleWithMotorFunction,
    examData.comments || '',
    examData.cellComments || '',
  );
};
