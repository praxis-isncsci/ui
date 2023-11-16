import {ExamData} from '@core/domain';

export interface IExternalMessageProvider {
  sendOutExamData(examData: ExamData): void;
}
