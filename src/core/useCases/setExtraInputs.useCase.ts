import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {MotorLevel} from '@core/domain';

export const setExtraInputsUseCase = (
  rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  comments: string,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  appStoreProvider.setExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction,
    leftLowestNonKeyMuscleWithMotorFunction,
    comments,
  );
};
