import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
  IIsncsciExamProvider,
} from '@core/boundaries';
import { BinaryObservation, Cell, MotorLevel, Totals } from '@core/domain';
import { getExamDataFromGridModel, validateExamData } from '@core/helpers';
import { cloneExamData } from '@core/helpers/examData.helper';

/*
 * This use case is responsible for calculating the totals
 * and updating the state of the application
 *
 * `UNK` values are allowed in the exam data, but they are not valid values in the ISNCSCI library.
 * They are converted to `NT` before performing the calculation but not persisted as part of the state.
 *
 * 1. Get exam data from grid model
 * 2. Check for missing values
 *    2.1 If missing values are found,
 *      2.1.1 add the missing values as calculation errors to the model
 *      2.1.2 Update the external listeners so they are informed of the errors
 *      2.1.3 Stop
 * 3. Validate exam data
 *    3.1 If errors are found,
 *      3.1.1 add the calculation errors to the model
 *      3.1.2 Update the external listeners so they are informed of the errors
 *      3.1.3 Stop
 * 4. Convert any `UNK` values to `NT` before performing the calculation
 * 5. Calculate totals
 * 6. Bind totals to exam data
 * 7. Mark exam data as complete
 * 8. Update state
 * 9. Update external listeners
 */
export const calculateUseCase = async (
  gridModel: Array<Cell | null>[],
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  rightLowestNonKeyMuscle: MotorLevel | null,
  leftLowestNonKeyMuscle: MotorLevel | null,
  comments: string,
  appStoreProvider: IIsncsciAppStoreProvider,
  examProvider: IIsncsciExamProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  // 1. Get exam data from grid model
  const { examData, missingValues } = getExamDataFromGridModel(
    gridModel,
    vac,
    dap,
    rightLowestNonKeyMuscle,
    leftLowestNonKeyMuscle,
    comments,
  );

  // 2. Check for missing values
  if (missingValues.length > 0) {
    try {
      // 2.1 If missing values are found,
      // 2.1.1 add the missing values as calculation errors to the model
      await appStoreProvider.setCalculationError(
        `Missing values:\n${missingValues.join('\n')}`,
      );

      // 2.1.2 Update the external listeners so they are informed of the errors
      examData.missingValues = missingValues;
      await externalMessageProvider.sendOutExamData(examData);
    } catch (error) {
      console.log(error);
    }

    // 2.1.3 Stop
    return;
  }

  // 3. Validate exam data
  const errors = validateExamData(examData);

  if (errors.length > 0) {
    try {
      // 3.1 If errors are found,
      // 3.1.1 add the calculation errors
      await appStoreProvider.setCalculationError(
        `The exam contains errors:\n${errors.join('\n')}`,
      );

      // 3.1.2 Update the external listeners so they are informed of the errors
      examData.errors = errors;
      await externalMessageProvider.sendOutExamData(examData);
    } catch (error) {
      console.log(error);
    }

    // 3.1.3 Stop
    return;
  }

  // 3. Convert any `UNK` values to `NT` before performing the calculation
  const clonedExamData = cloneExamData(examData, true);

  try {
    // 4. Calculate totals
    const totals = await examProvider.calculate(clonedExamData);

    // 5. Bind totals to exam data
    Object.keys(totals).forEach((key) => {
      examData[key] = totals[key];
    });

    // 6. Mark exam data as complete
    examData.isComplete = true;

    // 7. Update state
    await appStoreProvider.setTotals(totals);

    // 8. Update external listeners
    await externalMessageProvider.sendOutExamData(examData);
  } catch (error) {
    console.log(error);
  }
  return examData;
};