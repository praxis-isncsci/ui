import {IIsncsciAppStoreProvider} from '@core/boundaries';

export const setVacDapUseCase = (
  readonly: boolean,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  appStoreProvider.setReadonly(readonly);
};
