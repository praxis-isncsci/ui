import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {BinaryObservation} from 'isncsci/cjs/interfaces';

export const setVacDapUseCase = (
  vac: BinaryObservation | null,
  dap: BinaryObservation | null,
  appStoreProvider: IIsncsciAppStoreProvider,
) => {
  appStoreProvider.setVacDap(vac, dap);
};
