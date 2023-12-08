import {describe, expect, it} from '@jest/globals';
import {MotorLevel, MotorLevels, SensoryLevels} from '@core/domain';

import {
  bindExamDataToGridModel,
  bindExamDataToTotals,
  findCell,
  getCellColumn,
  getCellPosition,
  getCellRange,
  getCellRow,
  getEmptyExamData,
  validateExamData,
} from './examData.helper';

const getExamDataForAsiaE = () => {
  const examData = getEmptyExamData();
  examData.deepAnalPressure = 'Yes';
  (examData.voluntaryAnalContraction = 'Yes'),
    // Totals
    (examData.asiaImpairmentScale = '1');
  examData.injuryComplete = '2';
  examData.leftLightTouchTotal = '3';
  examData.leftLowerMotorTotal = '4';
  examData.leftMotor = '5';
  examData.leftMotorTotal = '6';
  examData.leftMotorZpp = '7';
  examData.leftPinPrickTotal = '8';
  examData.leftSensory = '9';
  examData.leftSensoryZpp = '10';
  examData.leftTouchTotal = '11';
  examData.leftUpperMotorTotal = '12';
  examData.lowerMotorTotal = '13';
  examData.neurologicalLevelOfInjury = '14';
  examData.pinPrickTotal = '15';
  examData.rightLightTouchTotal = '16';
  examData.rightLowerMotorTotal = '17';
  examData.rightMotor = '18';
  examData.rightMotorTotal = '19';
  examData.rightMotorZpp = '20';
  examData.rightPinPrickTotal = '21';
  examData.rightSensory = '22';
  examData.rightSensoryZpp = '23';
  examData.rightTouchTotal = '24';
  examData.rightUpperMotorTotal = '25';
  examData.touchTotal = '26';
  examData.upperMotorTotal = '27';

  SensoryLevels.forEach((level) => {
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
      examData['rightLightTouchC5ReasonImpairmentNotDueToSciSpecify'] =
        'Something else';

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
      examData['rightLightTouchC5ReasonImpairmentNotDueToSciSpecify'] =
        'Something else';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(2);
      expect(errors[0]).toBe(
        'rightLightTouchC5ReasonImpairmentNotDueToSci has value Other, but the level was not marked with a star: 2',
      );
      expect(errors[1]).toBe(
        'rightLightTouchC5ReasonImpairmentNotDueToSciSpecify has value Something else, but the level was not marked with a star: 2',
      );
    });

    it('should return an error if a left sensory level has a reason for impairment not due to SCI, but the level was not marked with a star', () => {
      const examData = getExamDataForAsiaE();
      examData['leftLightTouchC5ReasonImpairmentNotDueToSci'] = 'Other';
      examData['leftLightTouchC5ReasonImpairmentNotDueToSciSpecify'] =
        'Something else';

      const errors = validateExamData(examData);

      expect(errors.length).toBe(2);
      expect(errors[0]).toBe(
        'leftLightTouchC5ReasonImpairmentNotDueToSci has value Other, but the level was not marked with a star: 2',
      );
      expect(errors[1]).toBe(
        'leftLightTouchC5ReasonImpairmentNotDueToSciSpecify has value Something else, but the level was not marked with a star: 2',
      );
    });
  });

  describe('bindExamDataToTotals', () => {
    it('should bind exam data to totals', () => {
      const examData = getExamDataForAsiaE();

      const totals = bindExamDataToTotals(examData);

      expect(totals).toEqual({
        asiaImpairmentScale: '1',
        injuryComplete: '2',
        leftLightTouchTotal: '3',
        leftLowerMotorTotal: '4',
        leftMotor: '5',
        leftMotorTotal: '6',
        leftMotorZpp: '7',
        leftPinPrickTotal: '8',
        leftSensory: '9',
        leftSensoryZpp: '10',
        leftTouchTotal: '11',
        leftUpperMotorTotal: '12',
        lowerMotorTotal: '13',
        neurologicalLevelOfInjury: '14',
        pinPrickTotal: '15',
        rightLightTouchTotal: '16',
        rightLowerMotorTotal: '17',
        rightMotor: '18',
        rightMotorTotal: '19',
        rightMotorZpp: '20',
        rightPinPrickTotal: '21',
        rightSensory: '22',
        rightSensoryZpp: '23',
        rightTouchTotal: '24',
        rightUpperMotorTotal: '25',
        touchTotal: '26',
        upperMotorTotal: '27',
      });
    });

    it('should set an empty string for totals not included in the exam data', () => {
      const totals = bindExamDataToTotals(getEmptyExamData());

      expect(totals).toEqual({
        asiaImpairmentScale: '',
        injuryComplete: '',
        leftLightTouchTotal: '',
        leftLowerMotorTotal: '',
        leftMotor: '',
        leftMotorTotal: '',
        leftMotorZpp: '',
        leftPinPrickTotal: '',
        leftSensory: '',
        leftSensoryZpp: '',
        leftTouchTotal: '',
        leftUpperMotorTotal: '',
        lowerMotorTotal: '',
        neurologicalLevelOfInjury: '',
        pinPrickTotal: '',
        rightLightTouchTotal: '',
        rightLowerMotorTotal: '',
        rightMotor: '',
        rightMotorTotal: '',
        rightMotorZpp: '',
        rightPinPrickTotal: '',
        rightSensory: '',
        rightSensoryZpp: '',
        rightTouchTotal: '',
        rightUpperMotorTotal: '',
        touchTotal: '',
        upperMotorTotal: '',
      });
    });
  });

  describe('getCellColumn', () => {
    [
      {cellName: 'right-motor-c5', expectedColumn: 0},
      {cellName: 'right-light-touch-c5', expectedColumn: 1},
      {cellName: 'right-pin-prick-c5', expectedColumn: 2},
      {cellName: 'left-light-touch-c5', expectedColumn: 3},
      {cellName: 'left-pin-prick-c5', expectedColumn: 4},
      {cellName: 'left-motor-c5', expectedColumn: 5},
    ].forEach((test) => {
      it(`should return ${test.expectedColumn} when cell name is ${test.cellName}`, () => {
        // Arrange - Act
        const column = getCellColumn(test.cellName);

        // Assert
        expect(column).toBe(test.expectedColumn);
      });

      it(`should throw an error when cell name is ${test.cellName} and invalid`, () => {
        // Arrange - Act
        const act = () => getCellColumn('invalid-cell-name');

        // Assert
        expect(act).toThrowError('Invalid cell name invalid-cell-name');
      });
    });
  });

  describe('getCellRow', () => {
    [
      {cellName: 'right-light-touch-c2', expectedRow: 0},
      {cellName: 'right-motor-c5', expectedRow: 3},
      {cellName: 'right-pin-prick-t1', expectedRow: 7},
      {cellName: 'right-pin-prick-t10', expectedRow: 16},
      {cellName: 'right-pin-prick-l1', expectedRow: 19},
      {cellName: 'right-pin-prick-l3', expectedRow: 21},
      {cellName: 'right-pin-prick-s1', expectedRow: 24},
      {cellName: 'right-pin-prick-s4_5', expectedRow: 27},
    ].forEach((test) => {
      it(`should return ${test.expectedRow} when cell name is ${test.cellName}`, () => {
        // Arrange - Act
        const row = getCellRow(test.cellName);

        // Assert
        expect(row).toBe(test.expectedRow);
      });

      it(`should throw an error when cell name is ${test.cellName} and invalid`, () => {
        // Arrange - Act
        const act = () => getCellRow('invalid-cell-name');

        // Assert
        expect(act).toThrowError('Invalid cell name invalid-cell-name');
      });
    });
  });

  describe('getCellPosition', () => {
    [
      {
        cellName: 'right-light-touch-c2',
        expectedColumn: 1,
        expectedRow: 0,
      },
      {
        cellName: 'right-motor-c5',
        expectedColumn: 0,
        expectedRow: 3,
      },
      {
        cellName: 'right-pin-prick-t1',
        expectedColumn: 2,
        expectedRow: 7,
      },
      {
        cellName: 'right-pin-prick-t10',
        expectedColumn: 2,
        expectedRow: 16,
      },
      {
        cellName: 'right-pin-prick-l1',
        expectedColumn: 2,
        expectedRow: 19,
      },
      {
        cellName: 'left-light-touch-l3',
        expectedColumn: 3,
        expectedRow: 21,
      },
      {
        cellName: 'left-motor-s1',
        expectedColumn: 5,
        expectedRow: 24,
      },
      {
        cellName: 'left-pin-prick-s4_5',
        expectedColumn: 4,
        expectedRow: 27,
      },
    ].forEach((test) => {
      it(`should return column ${test.expectedColumn} and row ${test.expectedRow} when cell name is ${test.cellName}`, () => {
        // Arrange - Act
        const position = getCellPosition(test.cellName);

        // Assert
        expect(position.column).toBe(test.expectedColumn);
        expect(position.row).toBe(test.expectedRow);
      });
    });
  });

  describe('getCellRange', () => {
    const gridModel = bindExamDataToGridModel(getEmptyExamData());

    [
      {
        startName: 'right-light-touch-c2',
        endName: 'right-motor-c5',
        expectedMotorRangeNames: ['right-motor-c5'],
        expectedSensoryRangeNames: [
          'right-light-touch-c2',
          'right-light-touch-c3',
          'right-light-touch-c4',
          'right-light-touch-c5',
        ],
      },
      {
        startName: 'right-motor-t1',
        endName: 'left-motor-t1',
        expectedMotorRangeNames: ['left-motor-t1', 'right-motor-t1'],
        expectedSensoryRangeNames: [
          'left-light-touch-t1',
          'left-pin-prick-t1',
          'right-light-touch-t1',
          'right-pin-prick-t1',
        ],
      },
      {
        startName: 'left-motor-t1',
        endName: 'right-motor-c5',
        expectedMotorRangeNames: [
          'left-motor-c5',
          'left-motor-c6',
          'left-motor-c7',
          'left-motor-c8',
          'left-motor-t1',
          'right-motor-c5',
          'right-motor-c6',
          'right-motor-c7',
          'right-motor-c8',
          'right-motor-t1',
        ],
        expectedSensoryRangeNames: [
          'left-light-touch-c5',
          'left-light-touch-c6',
          'left-light-touch-c7',
          'left-light-touch-c8',
          'left-light-touch-t1',
          'left-pin-prick-c5',
          'left-pin-prick-c6',
          'left-pin-prick-c7',
          'left-pin-prick-c8',
          'left-pin-prick-t1',
          'right-light-touch-c5',
          'right-light-touch-c6',
          'right-light-touch-c7',
          'right-light-touch-c8',
          'right-light-touch-t1',
          'right-pin-prick-c5',
          'right-pin-prick-c6',
          'right-pin-prick-c7',
          'right-pin-prick-c8',
          'right-pin-prick-t1',
        ],
      },
      {
        startName: 'left-motor-c5',
        endName: 'left-motor-s1',
        expectedMotorRangeNames: [
          'left-motor-c5',
          'left-motor-c6',
          'left-motor-c7',
          'left-motor-c8',
          'left-motor-l2',
          'left-motor-l3',
          'left-motor-l4',
          'left-motor-l5',
          'left-motor-s1',
          'left-motor-t1',
        ],
        expectedSensoryRangeNames: [],
      },
      {
        startName: 'right-pin-prick-t9',
        endName: 'right-pin-prick-s2',
        expectedMotorRangeNames: [],
        expectedSensoryRangeNames: [
          'right-pin-prick-l1',
          'right-pin-prick-l2',
          'right-pin-prick-l3',
          'right-pin-prick-l4',
          'right-pin-prick-l5',
          'right-pin-prick-s1',
          'right-pin-prick-s2',
          'right-pin-prick-t10',
          'right-pin-prick-t11',
          'right-pin-prick-t12',
          'right-pin-prick-t9',
        ],
      },
    ].forEach((test) => {
      it(`should return the range when starting at ${test.startName} and ending at ${test.endName}`, () => {
        // Arrange - Act
        const {motorRange, sensoryRange} = getCellRange(
          getCellPosition(test.startName),
          getCellPosition(test.endName),
          gridModel,
        );

        // Assert
        expect(motorRange.map((cell) => cell.name).sort()).toEqual(
          test.expectedMotorRangeNames,
        );

        expect(sensoryRange.map((cell) => cell.name).sort()).toEqual(
          test.expectedSensoryRangeNames,
        );
      });
    });

    it('should return a range that includes all right motor cells when starting at `right-motor-c5` but `end` is set to `null`', () => {
      // Arrange - Act
      const {motorRange, sensoryRange} = getCellRange(
        getCellPosition('right-motor-c5'),
        null,
        gridModel,
      );

      // Assert
      expect(motorRange.map((cell) => cell.name).sort()).toEqual([
        'right-motor-c5',
        'right-motor-c6',
        'right-motor-c7',
        'right-motor-c8',
        'right-motor-l2',
        'right-motor-l3',
        'right-motor-l4',
        'right-motor-l5',
        'right-motor-s1',
        'right-motor-t1',
      ]);

      expect(sensoryRange.map((cell) => cell.name).sort()).toEqual([]);
    });

    it('should return a range that includes all left motor cells from C5 to L3 when starting at `left-motor-c5`, `end` is set to `null` and `left-motor-l4` contains a value and `stopAtCellWithValue` is `true`', () => {
      // Arrange
      const cellToUpdate = findCell('left-motor-l4', gridModel);
      cellToUpdate.value = '5';

      // Act
      const {motorRange, sensoryRange} = getCellRange(
        getCellPosition('left-motor-c5'),
        null,
        gridModel,
        true,
      );

      // Assert
      expect(motorRange.map((cell) => cell.name).sort()).toEqual([
        'left-motor-c5',
        'left-motor-c6',
        'left-motor-c7',
        'left-motor-c8',
        'left-motor-l2',
        'left-motor-l3',
        'left-motor-t1',
      ]);

      expect(sensoryRange.map((cell) => cell.name).sort()).toEqual([]);
    });
  });
});
