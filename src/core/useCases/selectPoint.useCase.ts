import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {validCellNameRegex} from '@core/helpers';

export const selectedPointUseCase = async (
  appStoreProvider: IIsncsciAppStoreProvider,
  name: string,
) => {
  // 1. Check if the name is valid
  if (!validCellNameRegex.test(name)) {
    throw new Error('Invalid point name');
  }

  // 2. Update the app store
  await appStoreProvider.setSelectedPoint(name);
};
