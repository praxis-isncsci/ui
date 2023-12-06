import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {BinaryObservation} from '@core/domain';

export const setVacDapUseCase = (
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  appStoreProvider.setVacDap(vac, dap);
};
