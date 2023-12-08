import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
  IIsncsciExamProvider,
} from '@core/boundaries';
import {BinaryObservation, Cell} from '@core/domain';
import {getExamDataFromGridModel, validateExamData} from '@core/helpers';
import {MotorLevel} from 'isncsci/cjs/interfaces';

/*
 * This use case is responsible for calculating the totals
 * and updating the state of the application
 *
 * 1. Get exam data from grid model
 * 2. Validate exam data
 * 3. Calculate totals
 * 4. Bind totals to exam data
 * 5. Update state
 */
export const calculateUseCase = (
  gridModel: Array<Cell | null>[],
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  rightLowestNonKeyMuscle: MotorLevel | null,
  leftLowestNonKeyMuscle: MotorLevel | null,
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
  );

  // 2. Validate exam data
  if (isMissingValues) {
    throw new Error(`Missing values`);
  }

  const errors = validateExamData(examData);

  if (errors.length > 0) {
    throw new Error(`The exam is not complete`);
  }

  // 3. Calculate totals
  examProvider.calculate(examData).then((totals) => {
    // 4. Bind totals to exam data
    Object.keys(totals).forEach((key) => {
      examData[key] = totals[key];
    });

    // Update external listeners
    externalMessageProvider.sendOutExamData(examData);

    // 5. Update state
    appStoreProvider.setTotals(totals);
  });
};
