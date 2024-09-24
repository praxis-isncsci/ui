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
  comments: string,
  cellComments: string | null,
  appStoreProvider: IIsncsciAppStoreProvider,
  externalMessageProvider: IExternalMessageProvider,
) => {
  try {
    // 1. Set VAC and DAP
    await appStoreProvider.setVacDap(vac, dap);

    // 2. Clear the totals and errors
    await appStoreProvider.clearTotalsAndErrors();

    // 3. Update external listeners
    const {examData} = getExamDataFromGridModel(
      gridModel,
      vac,
      dap,
      rightLowestNonKeyMuscle,
      leftLowestNonKeyMuscle,
      comments,
      cellComments,
    );

    // 4. Update external listeners
    await externalMessageProvider.sendOutExamData(examData);
  } catch (error) {
    console.error('Error setting VAC and DAP', error);
  }
};
