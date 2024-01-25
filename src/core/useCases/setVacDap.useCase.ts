import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {BinaryObservation, Cell, MotorLevel} from '@core/domain';
import {
  getEmptyTotals,
  getExamDataFromGridModel,
} from '@core/helpers/examData.helper';

export const setVacDapUseCase = async (
  gridModel: Array<Cell | null>[],
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  rightLowestNonKeyMuscle: MotorLevel | null,
  leftLowestNonKeyMuscle: MotorLevel | null,
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  // 1. Set VAC and DAP
  await appStoreProvider.setVacDap(vac, dap);

  // 2. Clear the totals
  await appStoreProvider.setTotals(getEmptyTotals());

  // 3. Update external listeners
  const {examData} = getExamDataFromGridModel(
    gridModel,
    vac,
    dap,
    rightLowestNonKeyMuscle,
    leftLowestNonKeyMuscle,
  );

  await externalMessageProvider.sendOutExamData(examData);
};
