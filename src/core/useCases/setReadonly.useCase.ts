import {IIsncsciAppStoreProvider} from '@core/boundaries';

export const setReadonlyUseCase = (
  readonly: boolean,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  appStoreProvider.setReadonly(readonly);
};
