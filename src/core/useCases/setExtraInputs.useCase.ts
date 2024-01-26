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
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  // 1. Set extra inputs
  await appStoreProvider.setExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction,
    leftLowestNonKeyMuscleWithMotorFunction,
    comments,
  );

  // 2. Clear the totals
  await appStoreProvider.setTotals(getEmptyTotals());

  // 3. Update external listeners
  const {examData} = getExamDataFromGridModel(
    gridModel,
    vac,
    dap,
    rightLowestNonKeyMuscleWithMotorFunction,
    leftLowestNonKeyMuscleWithMotorFunction,
    comments,
  );

  await externalMessageProvider.sendOutExamData(examData);
};
