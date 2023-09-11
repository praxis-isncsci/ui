import {IIsncsciAppStoreProvider, StatusCodes} from "@core/boundaries";
import {bindExamDataToGridModel} from "@core/helpers";

/*
 * 1. Set the app status to `initializing`.
 * 2. Set a blank grid model in the app store provider.
 * 3. Set the app status to `ready`.
 */
export const initializeAppUseCase = async (appStoreProvider: IIsncsciAppStoreProvider) => {
  // 1. Set the app status to `initializing`.
  await appStoreProvider.updateStatus(StatusCodes.Initializing);

  // 2. Set a blank grid model in the app store provider.
  await appStoreProvider.setGridModel(bindExamDataToGridModel({}));

  // 3. Set the app status to `ready`.
  await appStoreProvider.updateStatus(StatusCodes.Ready);
};
