import {IIsncsciAppStoreProvider} from '@core/boundaries';
import {Exam} from 'isncsci';

/**
 * 1. Validate exam
 * 2. Update app store
 */
export const setExamFromExternalSourceUseCase = async (appStoreProvider: IIsncsciAppStoreProvider, exam: Exam) => {
  // 1. Validate exam
  // ToDo: Validate exam - This will be coming from an external source. What can we do to validate the exam?

  // 2. Update app store
  await appStoreProvider.setExam(exam);
}
