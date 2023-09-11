import {describe, expect, it, test} from '@jest/globals';
import {MotorLevel, MotorLevels, SensoryLevels} from '@core/domain';

import {validateExamData} from './examData.helper';

const getExamDataForAsiaE = () => {
  const examData = {
    deepAnalPressure: 'Yes',
    voluntaryAnalContraction: 'Yes',
  };

  SensoryLevels.forEach(level => {
    examData[`rightLightTouch${level}`] = '2';
    examData[`rightPinPrick${level}`] = '2';
    examData[`leftLightTouch${level}`] = '2';
    examData[`leftPinPrick${level}`] = '2';

    if (MotorLevels.includes(level as MotorLevel)) {
      examData[`rightMotor${level}`] = '5';
      examData[`leftMotor${level}`] = '5';
    }
  });

  return examData;
};

describe('ExamDataHelper', () => {
  describe('validateExamData', () => {
    it('should return an empty array if exam data is valid', () => {
      const examData = getExamDataForAsiaE();

      const errors = validateExamData(examData);

      expect(errors.length).toBe(0);
    });

    it('should return an empty array when a sensory level has a reason for impairment not due to SCI and the level was marked with a star', () => {
      const examData = getExamDataForAsiaE();
      examData['rightLightTouchC5'] = '1*';
      examData['rightLightTouchC5ReasonImpairmentNotDueToSci'] = 'Other';
      examData['rightLightTouchC5ReasonImpairmentNotDueToSciSpecify'] = 'Something else';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(0);
    });

    it('should return an error if a right sensory level has an invalid value', () => {
      const examData = getExamDataForAsiaE();
      examData['rightLightTouchC5'] = '2*';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Invalid value (2*) for rightLightTouchC5');
    });

    it('should return an error if a left sensory level has an invalid value', () => {
      const examData = getExamDataForAsiaE();
      examData['leftLightTouchC5'] = '2*';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Invalid value (2*) for leftLightTouchC5');
    });

    it('should return an error if a right motor level has an invalid value', () => {
      const examData = getExamDataForAsiaE();
      examData['rightMotorC5'] = '5*';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Invalid value (5*) for rightMotorC5');
    });

    it('should return an error if a left motor level has an invalid value', () => {
      const examData = getExamDataForAsiaE();
      examData['leftMotorC5'] = '5*';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Invalid value (5*) for leftMotorC5');
    });

    it('should return an error if a right sensory level has a reason for impairment not due to SCI, but the level was not marked with a star', () => {
      const examData = getExamDataForAsiaE();
      examData['rightLightTouchC5ReasonImpairmentNotDueToSci'] = 'Other';
      examData['rightLightTouchC5ReasonImpairmentNotDueToSciSpecify'] = 'Something else';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(2);
      expect(errors[0]).toBe('rightLightTouchC5ReasonImpairmentNotDueToSci has value Other, but the level was not marked with a star: 2');
      expect(errors[1]).toBe('rightLightTouchC5ReasonImpairmentNotDueToSciSpecify has value Something else, but the level was not marked with a star: 2');
    });

    it('should return an error if a left sensory level has a reason for impairment not due to SCI, but the level was not marked with a star', () => {
      const examData = getExamDataForAsiaE();
      examData['leftLightTouchC5ReasonImpairmentNotDueToSci'] = 'Other';
      examData['leftLightTouchC5ReasonImpairmentNotDueToSciSpecify'] = 'Something else';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(2);
      expect(errors[0]).toBe('leftLightTouchC5ReasonImpairmentNotDueToSci has value Other, but the level was not marked with a star: 2');
      expect(errors[1]).toBe('leftLightTouchC5ReasonImpairmentNotDueToSciSpecify has value Something else, but the level was not marked with a star: 2');
    });

  });
});
