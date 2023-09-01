import {Exam} from 'isncsci';

export class StatusCodes {
  public static Initializing: number = 2;
  public static NotInitialized: number = 0;
  public static Ready: number = 1;
}

export interface IAppState {
  currentExam: Exam | null;
  status: number;
}
