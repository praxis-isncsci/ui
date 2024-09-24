import {
    IExternalMessageProvider,
    IIsncsciAppStoreProvider,
  } from '@core/boundaries';
  import { BinaryObservation, Cell, MotorLevel } from '@core/domain';
  import { getExamDataFromGridModel } from '@core/helpers/examData.helper';
  
  export const setCellCommentsUseCase = async (
    cellComments: string | null,
    gridModel: Array<Cell | null>[],
    vac: BinaryObservation | null,
    dap: BinaryObservation | null,
    rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    comments: string,
    appStoreProvider: IIsncsciAppStoreProvider,
    externalMessageProvider: IExternalMessageProvider,
  ) => {
    // Update the state with the new cellComments
    await appStoreProvider.setCellComments(cellComments);
  
    try {
      const { examData } = getExamDataFromGridModel(
        gridModel,
        vac,
        dap,
        rightLowestNonKeyMuscleWithMotorFunction,
        leftLowestNonKeyMuscleWithMotorFunction,
        comments,
        cellComments,
      );
  
      await externalMessageProvider.sendOutExamData(examData);
    } catch (error) {
      console.error(error);
    }
    console.log('setCellCommentsUseCase called with cellComments:', cellComments);
  };