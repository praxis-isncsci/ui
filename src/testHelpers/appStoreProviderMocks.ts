import {jest} from '@jest/globals';
import {IIsncsciAppStoreProvider} from '@core/boundaries';

export const getAppStoreProviderMock = (): IIsncsciAppStoreProvider => {
  return {
    setActiveCell: jest.fn(() => Promise.resolve()),
    setCellsValue: jest.fn(() => Promise.resolve()),
    setExtraInputs: jest.fn(() => Promise.resolve()),
    setGridModel: jest.fn(() => Promise.resolve()),
    setReadonly: jest.fn(() => Promise.resolve()),
    setTotals: jest.fn(() => Promise.resolve()),
    setVacDap: jest.fn(() => Promise.resolve()),
    updateStatus: jest.fn(() => Promise.resolve()),
  };
};
