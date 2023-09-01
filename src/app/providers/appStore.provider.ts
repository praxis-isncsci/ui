import {Exam} from 'isncsci';
import {IIsncsciAppStoreProvider} from '@core/boundaries';

export class AppStoreProvider implements IIsncsciAppStoreProvider {
  public setExam(exam: Exam): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public selectDermatome(dermatomeName: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
