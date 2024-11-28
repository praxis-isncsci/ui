import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {BinaryObservation, Cell, MotorLevel} from '@core/domain';
import {
  getEmptyTotals,
  getExamDataFromGridModel,
} from '@core/helpers/examData.helper';

export const setExtraInputsUseCase = async (
  gridModel: Array<Cell | null>[],
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  comments: string,
  cellComments: string,
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  // 1. Set extra inputs
  await appStoreProvider.setExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction,
    leftLowestNonKeyMuscleWithMotorFunction,
    comments,
    cellComments,
  );

  // 2. Clear the totals and errors
  await appStoreProvider.clearTotalsAndErrors();

  // 3. Update external listeners
  const {examData} = getExamDataFromGridModel(
    gridModel,
    vac,
    dap,
    rightLowestNonKeyMuscleWithMotorFunction,
    leftLowestNonKeyMuscleWithMotorFunction,
    comments,
  );

  try {
    await externalMessageProvider.sendOutExamData(examData);
  } catch (error) {
    console.error('Error sending out exam data', error);
  }
};
