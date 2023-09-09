import {IIsncsciAppStoreProvider, StatusCodes} from "@core/boundaries";

import {getGridModel} from "@core/helpers";

/*
 * 1. Set a blank grid model in the app store provider.
 * 2. Set the app status to `ready`.
 */
export const initializeAppUseCase = async (appStoreProvider: IIsncsciAppStoreProvider) => {
  await appStoreProvider.updateStatus(StatusCodes.Initializing);

  // 1. Set a blank grid model in the app store provider.
  await appStoreProvider.setGridModel(getGridModel());

  await appStoreProvider.updateStatus(StatusCodes.Ready);
};
