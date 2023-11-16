import {ExamData, Totals} from '@core/domain';

export interface IIsncsciExamProvider {
  calculate(examData: ExamData): Promise<Totals>;
}
