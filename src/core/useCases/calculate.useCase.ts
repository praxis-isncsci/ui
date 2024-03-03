import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
  IIsncsciExamProvider,
} from '@core/boundaries';
import {BinaryObservation, Cell, MotorLevel} from '@core/domain';
import {getExamDataFromGridModel, validateExamData} from '@core/helpers';
import {cloneExamData} from '@core/helpers/examData.helper';

/*
 * This use case is responsible for calculating the totals
 * and updating the state of the application
 *
 * `UNK` values are allowed in the exam data, but they are not valid values in the ISNCSCI library.
 * They are converted to `NT` before performing the calculation but not persisted as part of the state.
 *
 * 1. Get exam data from grid model
 * 2. Validate exam data
 * 3. Convert any `UNK` values to `NT` before performing the calculation
 * 4. Calculate totals
 * 5. Bind totals to exam data
 * 6. Mark exam data as complete
 * 7. Update state
 * 8. Update external listeners
 */
export const calculateUseCase = (
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
  const {examData, isMissingValues} = getExamDataFromGridModel(
    gridModel,
    vac,
    dap,
    rightLowestNonKeyMuscle,
    leftLowestNonKeyMuscle,
    comments,
  );

  // 2. Validate exam data
  if (isMissingValues) {
    throw new Error(`Missing values`);
  }

  const errors = validateExamData(examData);

  if (errors.length > 0) {
    throw new Error(`The exam is not complete`);
  }

  // 3. Convert any `UNK` values to `NT` before performing the calculation
  const clonedExamData = cloneExamData(examData, true);

  // 4. Calculate totals
  examProvider.calculate(clonedExamData).then((totals) => {
    // 5. Bind totals to exam data
    Object.keys(totals).forEach((key) => {
      examData[key] = totals[key];
    });

    // 6. Mark exam data as complete
    examData.isComplete = true;

    // 7. Update state
    appStoreProvider.setTotals(totals);

    // 8. Update external listeners
    externalMessageProvider.sendOutExamData(examData);
  });
};
