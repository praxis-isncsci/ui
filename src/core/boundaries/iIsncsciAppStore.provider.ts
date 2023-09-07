import {Exam} from 'isncsci';

export interface IIsncsciAppStoreProvider {
  setExam(exam: Exam): Promise<void>;
  // clearDermatomeSelection(): Promise<void>;
  selectDermatome(dermatomeName: string): Promise<void>;
  // setDermatomeValue(dermatomeName: string, value: string): Promise<void>;
  // setTotals(totals: IsncsciTotals): Promise<void>;
  // updateDermatomesInRange(dermatomeNames: string[], value: string): Promise<void>;
}
