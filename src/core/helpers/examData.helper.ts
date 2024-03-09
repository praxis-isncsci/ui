import {
  Cell,
  ExamData,
  MotorLevel,
  MotorLevels,
  SensoryLevels,
  Totals,
  ValidMotorValues,
  ValidSensoryValues,
} from '@core/domain';
import {
  levelNameRegex,
  motorCellRegex,
  validCellNameRegex,
} from './regularExpressions';
import {BinaryObservation} from '@core/domain';
import {ValidBinaryObservationValues} from '@core/domain/binaryObservation';

const validateValue = (
  dataKey: string,
  examData: any,
  errors: string[],
  validValues: string[],
) => {
  const value = examData[dataKey];

  if (value && !validValues.includes(value)) {
    errors.push(`Invalid value (${value}) for ${dataKey}`);
  }

  if (!/\*/.test(value)) {
    const reasonKey = `${dataKey}ReasonImpairmentNotDueToSci`;
    const reasonSpecifyKey = `${dataKey}ReasonImpairmentNotDueToSciSpecify`;

    if (examData[reasonKey]) {
      errors.push(
        `${reasonKey} has value ${examData[reasonKey]}, but the level was not marked with a star: ${value}`,
      );
    }

    if (examData[reasonSpecifyKey]) {
      errors.push(
        `${reasonSpecifyKey} has value ${examData[reasonSpecifyKey]}, but the level was not marked with a star: ${value}`,
      );
    }
  }
};

export const validateExamData = (examData: ExamData) => {
  const errors: string[] = [];

  if (
    examData.voluntaryAnalContraction &&
    !ValidBinaryObservationValues.includes(examData.voluntaryAnalContraction)
  ) {
    errors.push('Voluntary Anal Contraction is not set');
  }

  if (
    examData.deepAnalPressure &&
    !ValidBinaryObservationValues.includes(examData.deepAnalPressure)
  ) {
    errors.push('Deep Anal Pressure is not set');
  }

  SensoryLevels.forEach((level) => {
    validateValue(
      `rightLightTouch${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );
    validateValue(
      `rightPinPrick${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );
    validateValue(
      `leftLightTouch${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );
    validateValue(`leftPinPrick${level}`, examData, errors, ValidSensoryValues);

    if (MotorLevels.includes(level as MotorLevel)) {
      validateValue(`rightMotor${level}`, examData, errors, ValidMotorValues);
      validateValue(`leftMotor${level}`, examData, errors, ValidMotorValues);
    }
  });

  return errors;
};

const getCell = (name: string, dataKey: string, examData: ExamData): Cell => {
  const value: string = examData[dataKey] ?? '';
  const hasStar = /\*/.test(value);

  const cell: Cell = {
    value,
    label: value.replace('**', '*'),
    reasonImpairmentNotDueToSci: hasStar
      ? examData[`${dataKey}ReasonImpairmentNotDueToSci`]
      : undefined,
    reasonImpairmentNotDueToSciSpecify: hasStar
      ? examData[`${dataKey}ReasonImpairmentNotDueToSciSpecify`]
      : undefined,
    name,
    error: undefined,
  };

  return cell;
};

const getRow = (level: string, examData: ExamData) => {
  const isMotor = MotorLevels.includes(level as MotorLevel);
  const levelToLower = level.toLowerCase();

  return [
    isMotor
      ? getCell(`right-motor-${levelToLower}`, `rightMotor${level}`, examData)
      : null,
    getCell(
      `right-light-touch-${levelToLower}`,
      `rightLightTouch${level}`,
      examData,
    ),
    getCell(
      `right-pin-prick-${levelToLower}`,
      `rightPinPrick${level}`,
      examData,
    ),
    getCell(
      `left-light-touch-${levelToLower}`,
      `leftLightTouch${level}`,
      examData,
    ),
    getCell(`left-pin-prick-${levelToLower}`, `leftPinPrick${level}`, examData),
    isMotor
      ? getCell(`left-motor-${levelToLower}`, `leftMotor${level}`, examData)
      : null,
  ];
};

export const bindExamDataToGridModel = (examData: ExamData) => {
  const gridModel: Array<Cell | null>[] = [];

  SensoryLevels.forEach((level) => {
    gridModel.push(getRow(level, examData));
  });

  return gridModel;
};

export const bindExamDataToTotals = (examData: ExamData): Totals => {
  return {
    asiaImpairmentScale: examData['asiaImpairmentScale'] ?? '',
    injuryComplete: examData['injuryComplete'] ?? '',
    leftLightTouchTotal: examData['leftLightTouchTotal'] ?? '',
    leftLowerMotorTotal: examData['leftLowerMotorTotal'] ?? '',
    leftMotor: examData['leftMotor'] ?? '',
    leftMotorTotal: examData['leftMotorTotal'] ?? '',
    leftMotorZpp: examData['leftMotorZpp'] ?? '',
    leftPinPrickTotal: examData['leftPinPrickTotal'] ?? '',
    leftSensory: examData['leftSensory'] ?? '',
    leftSensoryZpp: examData['leftSensoryZpp'] ?? '',
    leftUpperMotorTotal: examData['leftUpperMotorTotal'] ?? '',
    lightTouchTotal: examData['lightTouchTotal'] ?? '',
    lowerMotorTotal: examData['lowerMotorTotal'] ?? '',
    neurologicalLevelOfInjury: examData['neurologicalLevelOfInjury'] ?? '',
    pinPrickTotal: examData['pinPrickTotal'] ?? '',
    rightLightTouchTotal: examData['rightLightTouchTotal'] ?? '',
    rightLowerMotorTotal: examData['rightLowerMotorTotal'] ?? '',
    rightMotor: examData['rightMotor'] ?? '',
    rightMotorTotal: examData['rightMotorTotal'] ?? '',
    rightMotorZpp: examData['rightMotorZpp'] ?? '',
    rightPinPrickTotal: examData['rightPinPrickTotal'] ?? '',
    rightSensory: examData['rightSensory'] ?? '',
    rightSensoryZpp: examData['rightSensoryZpp'] ?? '',
    rightUpperMotorTotal: examData['rightUpperMotorTotal'] ?? '',
    upperMotorTotal: examData['upperMotorTotal'] ?? '',
  };
};

export const getExamDataFromGridModel = (
  gridModel: Array<Cell | null>[],
  voluntaryAnalContraction: BinaryObservation | null,
  deepAnalPressure: BinaryObservation | null,
  rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
  comments: string | null,
) => {
  const examData = getEmptyExamData();
  examData.voluntaryAnalContraction = voluntaryAnalContraction;
  examData.deepAnalPressure = deepAnalPressure;
  examData.rightLowestNonKeyMuscleWithMotorFunction =
    rightLowestNonKeyMuscleWithMotorFunction;
  examData.leftLowestNonKeyMuscleWithMotorFunction =
    leftLowestNonKeyMuscleWithMotorFunction;
  examData.comments = comments;

  let isMissingValues = false;

  gridModel.flat().forEach((cell) => {
    if (cell) {
      const key = cell.name.replace(/-([a-z])/gi, (a: string) =>
        a[1].toUpperCase(),
      );

      if (!cell.value) {
        isMissingValues = true;
      }

      examData[key] = cell.value;
      examData[`${key}ReasonImpairmentNotDueToSci`] =
        cell.reasonImpairmentNotDueToSci;
      examData[`${key}ReasonImpairmentNotDueToSciSpecify`] =
        cell.reasonImpairmentNotDueToSciSpecify;
    }
  });

  return {examData, isMissingValues};
};

export const findCell = (cellName: string, gridModel: Array<Cell | null>[]) => {
  if (!validCellNameRegex.test(cellName)) {
    throw new Error(`Invalid cell name ${cellName}`);
  }

  const cell = gridModel.flat().find((cell) => cell?.name === cellName);

  if (!cell) {
    throw new Error(`Cell ${cellName} not found`);
  }

  return cell;
};

/*
 * Returns a number between 0 and 5 representing the column index of a cell in the grid model.
 * Throws and error when the cell name is invalid.
 */
export const getCellColumn = (cellName: string) => {
  if (!validCellNameRegex.test(cellName)) {
    throw new Error(`Invalid cell name ${cellName}`);
  }

  switch (true) {
    case /right-motor/.test(cellName):
      return 0;
    case /right-light-touch/.test(cellName):
      return 1;
    case /right-pin-prick/.test(cellName):
      return 2;
    case /left-light-touch/.test(cellName):
      return 3;
    case /left-pin-prick/.test(cellName):
      return 4;
    case /left-motor/.test(cellName):
      return 5;
    default:
      throw new Error(`Invalid cell name ${cellName}`);
  }
};

/*
 * Returns a number between 0 and 27 representing the row index of a cell in the grid model.
 * Throws and error if the cell name is invalid.
 */
export const getCellRow = (cellName: string) => {
  const level = levelNameRegex.exec(cellName)?.[0];

  if (!level) {
    throw new Error(`Invalid cell name ${cellName}`);
  }

  if (level === 's4_5') {
    return 27;
  }

  const numericSegment = parseInt(level.slice(1));

  switch (level[0]) {
    case 'c':
      return numericSegment - 2;
    case 't':
      return numericSegment + 6;
    case 'l':
      return numericSegment + 18;
    case 's':
      return numericSegment + 23;
    default:
      throw new Error(`Invalid cell name ${cellName}`);
  }
};

/*
 * Returns the column and row index of a cell in the grid model.
 */
export const getCellPosition = (cellName: string) => {
  return {column: getCellColumn(cellName), row: getCellRow(cellName)};
};

/*
 * Returns an array of cells between two cells in the grid model.
 * The range is inclusive of the start and end cells.
 */
export const getCellRange = (
  start: {column: number; row: number},
  end: {column: number; row: number} | null,
  gridModel: Array<Cell | null>[],
  stopAtCellWithValue: boolean = false,
) => {
  const motorRange: Cell[] = [];
  const sensoryRange: Cell[] = [];
  const endPosition = end ?? {column: start.column, row: 27};

  const rowStart = Math.min(start.row, endPosition.row);
  const rowEnd = Math.max(start.row, endPosition.row);
  const columnStart = Math.min(start.column, endPosition.column);
  const columnEnd = Math.max(start.column, endPosition.column);

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let column = columnStart; column <= columnEnd; column++) {
      const cell = gridModel[row][column];
      if (cell) {
        if (
          stopAtCellWithValue &&
          end === null &&
          cell.value &&
          (row !== rowStart || column !== columnStart)
        ) {
          return {motorRange, sensoryRange};
        }

        if (motorCellRegex.test(cell.name)) {
          motorRange.push(cell);
        } else {
          sensoryRange.push(cell);
        }
      }
    }
  }

  return {motorRange, sensoryRange};
};

export const getEmptyTotals = (): Totals => {
  return {
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
    leftUpperMotorTotal: '',
    lightTouchTotal: '',
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
    rightUpperMotorTotal: '',
    upperMotorTotal: '',
  };
};

export const getEmptyExamData = (): ExamData => {
  return {
    comments: null,
    deepAnalPressure: null,
    voluntaryAnalContraction: null,
    rightLowestNonKeyMuscleWithMotorFunction: null,
    leftLowestNonKeyMuscleWithMotorFunction: null,
    isComplete: false,
    /* Right Sensory */
    rightLightTouchC2: '',
    rightLightTouchC2ReasonImpairmentNotDueToSci: null,
    rightLightTouchC2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC3: '',
    rightLightTouchC3ReasonImpairmentNotDueToSci: null,
    rightLightTouchC3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC4: '',
    rightLightTouchC4ReasonImpairmentNotDueToSci: null,
    rightLightTouchC4ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC5: '',
    rightLightTouchC5ReasonImpairmentNotDueToSci: null,
    rightLightTouchC5ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC6: '',
    rightLightTouchC6ReasonImpairmentNotDueToSci: null,
    rightLightTouchC6ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC7: '',
    rightLightTouchC7ReasonImpairmentNotDueToSci: null,
    rightLightTouchC7ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC8: '',
    rightLightTouchC8ReasonImpairmentNotDueToSci: null,
    rightLightTouchC8ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT1: '',
    rightLightTouchT1ReasonImpairmentNotDueToSci: null,
    rightLightTouchT1ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT2: '',
    rightLightTouchT2ReasonImpairmentNotDueToSci: null,
    rightLightTouchT2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT3: '',
    rightLightTouchT3ReasonImpairmentNotDueToSci: null,
    rightLightTouchT3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT4: '',
    rightLightTouchT4ReasonImpairmentNotDueToSci: null,
    rightLightTouchT4ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT5: '',
    rightLightTouchT5ReasonImpairmentNotDueToSci: null,
    rightLightTouchT5ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT6: '',
    rightLightTouchT6ReasonImpairmentNotDueToSci: null,
    rightLightTouchT6ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT7: '',
    rightLightTouchT7ReasonImpairmentNotDueToSci: null,
    rightLightTouchT7ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT8: '',
    rightLightTouchT8ReasonImpairmentNotDueToSci: null,
    rightLightTouchT8ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT9: '',
    rightLightTouchT9ReasonImpairmentNotDueToSci: null,
    rightLightTouchT9ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT10: '',
    rightLightTouchT10ReasonImpairmentNotDueToSci: null,
    rightLightTouchT10ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT11: '',
    rightLightTouchT11ReasonImpairmentNotDueToSci: null,
    rightLightTouchT11ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT12: '',
    rightLightTouchT12ReasonImpairmentNotDueToSci: null,
    rightLightTouchT12ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL1: '',
    rightLightTouchL1ReasonImpairmentNotDueToSci: null,
    rightLightTouchL1ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL2: '',
    rightLightTouchL2ReasonImpairmentNotDueToSci: null,
    rightLightTouchL2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL3: '',
    rightLightTouchL3ReasonImpairmentNotDueToSci: null,
    rightLightTouchL3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL4: '',
    rightLightTouchL4ReasonImpairmentNotDueToSci: null,
    rightLightTouchL4ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL5: '',
    rightLightTouchL5ReasonImpairmentNotDueToSci: null,
    rightLightTouchL5ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS1: '',
    rightLightTouchS1ReasonImpairmentNotDueToSci: null,
    rightLightTouchS1ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS2: '',
    rightLightTouchS2ReasonImpairmentNotDueToSci: null,
    rightLightTouchS2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS3: '',
    rightLightTouchS3ReasonImpairmentNotDueToSci: null,
    rightLightTouchS3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS4_5: '',
    rightLightTouchS4_5ReasonImpairmentNotDueToSci: null,
    rightLightTouchS4_5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC2: '',
    rightPinPrickC2ReasonImpairmentNotDueToSci: null,
    rightPinPrickC2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC3: '',
    rightPinPrickC3ReasonImpairmentNotDueToSci: null,
    rightPinPrickC3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC4: '',
    rightPinPrickC4ReasonImpairmentNotDueToSci: null,
    rightPinPrickC4ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC5: '',
    rightPinPrickC5ReasonImpairmentNotDueToSci: null,
    rightPinPrickC5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC6: '',
    rightPinPrickC6ReasonImpairmentNotDueToSci: null,
    rightPinPrickC6ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC7: '',
    rightPinPrickC7ReasonImpairmentNotDueToSci: null,
    rightPinPrickC7ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC8: '',
    rightPinPrickC8ReasonImpairmentNotDueToSci: null,
    rightPinPrickC8ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT1: '',
    rightPinPrickT1ReasonImpairmentNotDueToSci: null,
    rightPinPrickT1ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT2: '',
    rightPinPrickT2ReasonImpairmentNotDueToSci: null,
    rightPinPrickT2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT3: '',
    rightPinPrickT3ReasonImpairmentNotDueToSci: null,
    rightPinPrickT3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT4: '',
    rightPinPrickT4ReasonImpairmentNotDueToSci: null,
    rightPinPrickT4ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT5: '',
    rightPinPrickT5ReasonImpairmentNotDueToSci: null,
    rightPinPrickT5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT6: '',
    rightPinPrickT6ReasonImpairmentNotDueToSci: null,
    rightPinPrickT6ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT7: '',
    rightPinPrickT7ReasonImpairmentNotDueToSci: null,
    rightPinPrickT7ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT8: '',
    rightPinPrickT8ReasonImpairmentNotDueToSci: null,
    rightPinPrickT8ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT9: '',
    rightPinPrickT9ReasonImpairmentNotDueToSci: null,
    rightPinPrickT9ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT10: '',
    rightPinPrickT10ReasonImpairmentNotDueToSci: null,
    rightPinPrickT10ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT11: '',
    rightPinPrickT11ReasonImpairmentNotDueToSci: null,
    rightPinPrickT11ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT12: '',
    rightPinPrickT12ReasonImpairmentNotDueToSci: null,
    rightPinPrickT12ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL1: '',
    rightPinPrickL1ReasonImpairmentNotDueToSci: null,
    rightPinPrickL1ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL2: '',
    rightPinPrickL2ReasonImpairmentNotDueToSci: null,
    rightPinPrickL2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL3: '',
    rightPinPrickL3ReasonImpairmentNotDueToSci: null,
    rightPinPrickL3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL4: '',
    rightPinPrickL4ReasonImpairmentNotDueToSci: null,
    rightPinPrickL4ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL5: '',
    rightPinPrickL5ReasonImpairmentNotDueToSci: null,
    rightPinPrickL5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS1: '',
    rightPinPrickS1ReasonImpairmentNotDueToSci: null,
    rightPinPrickS1ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS2: '',
    rightPinPrickS2ReasonImpairmentNotDueToSci: null,
    rightPinPrickS2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS3: '',
    rightPinPrickS3ReasonImpairmentNotDueToSci: null,
    rightPinPrickS3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS4_5: '',
    rightPinPrickS4_5ReasonImpairmentNotDueToSci: null,
    rightPinPrickS4_5ReasonImpairmentNotDueToSciSpecify: null,

    /* Left Sensory */
    leftLightTouchC2: '',
    leftLightTouchC2ReasonImpairmentNotDueToSci: null,
    leftLightTouchC2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC3: '',
    leftLightTouchC3ReasonImpairmentNotDueToSci: null,
    leftLightTouchC3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC4: '',
    leftLightTouchC4ReasonImpairmentNotDueToSci: null,
    leftLightTouchC4ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC5: '',
    leftLightTouchC5ReasonImpairmentNotDueToSci: null,
    leftLightTouchC5ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC6: '',
    leftLightTouchC6ReasonImpairmentNotDueToSci: null,
    leftLightTouchC6ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC7: '',
    leftLightTouchC7ReasonImpairmentNotDueToSci: null,
    leftLightTouchC7ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC8: '',
    leftLightTouchC8ReasonImpairmentNotDueToSci: null,
    leftLightTouchC8ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT1: '',
    leftLightTouchT1ReasonImpairmentNotDueToSci: null,
    leftLightTouchT1ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT2: '',
    leftLightTouchT2ReasonImpairmentNotDueToSci: null,
    leftLightTouchT2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT3: '',
    leftLightTouchT3ReasonImpairmentNotDueToSci: null,
    leftLightTouchT3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT4: '',
    leftLightTouchT4ReasonImpairmentNotDueToSci: null,
    leftLightTouchT4ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT5: '',
    leftLightTouchT5ReasonImpairmentNotDueToSci: null,
    leftLightTouchT5ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT6: '',
    leftLightTouchT6ReasonImpairmentNotDueToSci: null,
    leftLightTouchT6ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT7: '',
    leftLightTouchT7ReasonImpairmentNotDueToSci: null,
    leftLightTouchT7ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT8: '',
    leftLightTouchT8ReasonImpairmentNotDueToSci: null,
    leftLightTouchT8ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT9: '',
    leftLightTouchT9ReasonImpairmentNotDueToSci: null,
    leftLightTouchT9ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT10: '',
    leftLightTouchT10ReasonImpairmentNotDueToSci: null,
    leftLightTouchT10ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT11: '',
    leftLightTouchT11ReasonImpairmentNotDueToSci: null,
    leftLightTouchT11ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT12: '',
    leftLightTouchT12ReasonImpairmentNotDueToSci: null,
    leftLightTouchT12ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL1: '',
    leftLightTouchL1ReasonImpairmentNotDueToSci: null,
    leftLightTouchL1ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL2: '',
    leftLightTouchL2ReasonImpairmentNotDueToSci: null,
    leftLightTouchL2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL3: '',
    leftLightTouchL3ReasonImpairmentNotDueToSci: null,
    leftLightTouchL3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL4: '',
    leftLightTouchL4ReasonImpairmentNotDueToSci: null,
    leftLightTouchL4ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL5: '',
    leftLightTouchL5ReasonImpairmentNotDueToSci: null,
    leftLightTouchL5ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS1: '',
    leftLightTouchS1ReasonImpairmentNotDueToSci: null,
    leftLightTouchS1ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS2: '',
    leftLightTouchS2ReasonImpairmentNotDueToSci: null,
    leftLightTouchS2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS3: '',
    leftLightTouchS3ReasonImpairmentNotDueToSci: null,
    leftLightTouchS3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS4_5: '',
    leftLightTouchS4_5ReasonImpairmentNotDueToSci: null,
    leftLightTouchS4_5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC2: '',
    leftPinPrickC2ReasonImpairmentNotDueToSci: null,
    leftPinPrickC2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC3: '',
    leftPinPrickC3ReasonImpairmentNotDueToSci: null,
    leftPinPrickC3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC4: '',
    leftPinPrickC4ReasonImpairmentNotDueToSci: null,
    leftPinPrickC4ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC5: '',
    leftPinPrickC5ReasonImpairmentNotDueToSci: null,
    leftPinPrickC5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC6: '',
    leftPinPrickC6ReasonImpairmentNotDueToSci: null,
    leftPinPrickC6ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC7: '',
    leftPinPrickC7ReasonImpairmentNotDueToSci: null,
    leftPinPrickC7ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC8: '',
    leftPinPrickC8ReasonImpairmentNotDueToSci: null,
    leftPinPrickC8ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT1: '',
    leftPinPrickT1ReasonImpairmentNotDueToSci: null,
    leftPinPrickT1ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT2: '',
    leftPinPrickT2ReasonImpairmentNotDueToSci: null,
    leftPinPrickT2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT3: '',
    leftPinPrickT3ReasonImpairmentNotDueToSci: null,
    leftPinPrickT3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT4: '',
    leftPinPrickT4ReasonImpairmentNotDueToSci: null,
    leftPinPrickT4ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT5: '',
    leftPinPrickT5ReasonImpairmentNotDueToSci: null,
    leftPinPrickT5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT6: '',
    leftPinPrickT6ReasonImpairmentNotDueToSci: null,
    leftPinPrickT6ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT7: '',
    leftPinPrickT7ReasonImpairmentNotDueToSci: null,
    leftPinPrickT7ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT8: '',
    leftPinPrickT8ReasonImpairmentNotDueToSci: null,
    leftPinPrickT8ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT9: '',
    leftPinPrickT9ReasonImpairmentNotDueToSci: null,
    leftPinPrickT9ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT10: '',
    leftPinPrickT10ReasonImpairmentNotDueToSci: null,
    leftPinPrickT10ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT11: '',
    leftPinPrickT11ReasonImpairmentNotDueToSci: null,
    leftPinPrickT11ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT12: '',
    leftPinPrickT12ReasonImpairmentNotDueToSci: null,
    leftPinPrickT12ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL1: '',
    leftPinPrickL1ReasonImpairmentNotDueToSci: null,
    leftPinPrickL1ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL2: '',
    leftPinPrickL2ReasonImpairmentNotDueToSci: null,
    leftPinPrickL2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL3: '',
    leftPinPrickL3ReasonImpairmentNotDueToSci: null,
    leftPinPrickL3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL4: '',
    leftPinPrickL4ReasonImpairmentNotDueToSci: null,
    leftPinPrickL4ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL5: '',
    leftPinPrickL5ReasonImpairmentNotDueToSci: null,
    leftPinPrickL5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS1: '',
    leftPinPrickS1ReasonImpairmentNotDueToSci: null,
    leftPinPrickS1ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS2: '',
    leftPinPrickS2ReasonImpairmentNotDueToSci: null,
    leftPinPrickS2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS3: '',
    leftPinPrickS3ReasonImpairmentNotDueToSci: null,
    leftPinPrickS3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS4_5: '',
    leftPinPrickS4_5ReasonImpairmentNotDueToSci: null,
    leftPinPrickS4_5ReasonImpairmentNotDueToSciSpecify: null,
    /* Right Motor */
    rightMotorC5: '',
    rightMotorC5ReasonImpairmentNotDueToSci: null,
    rightMotorC5ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorC6: '',
    rightMotorC6ReasonImpairmentNotDueToSci: null,
    rightMotorC6ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorC7: '',
    rightMotorC7ReasonImpairmentNotDueToSci: null,
    rightMotorC7ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorC8: '',
    rightMotorC8ReasonImpairmentNotDueToSci: null,
    rightMotorC8ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorT1: '',
    rightMotorT1ReasonImpairmentNotDueToSci: null,
    rightMotorT1ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL2: '',
    rightMotorL2ReasonImpairmentNotDueToSci: null,
    rightMotorL2ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL3: '',
    rightMotorL3ReasonImpairmentNotDueToSci: null,
    rightMotorL3ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL4: '',
    rightMotorL4ReasonImpairmentNotDueToSci: null,
    rightMotorL4ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL5: '',
    rightMotorL5ReasonImpairmentNotDueToSci: null,
    rightMotorL5ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorS1: '',
    rightMotorS1ReasonImpairmentNotDueToSci: null,
    rightMotorS1ReasonImpairmentNotDueToSciSpecify: null,
    /* Left Motor */
    leftMotorC5: '',
    leftMotorC5ReasonImpairmentNotDueToSci: null,
    leftMotorC5ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorC6: '',
    leftMotorC6ReasonImpairmentNotDueToSci: null,
    leftMotorC6ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorC7: '',
    leftMotorC7ReasonImpairmentNotDueToSci: null,
    leftMotorC7ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorC8: '',
    leftMotorC8ReasonImpairmentNotDueToSci: null,
    leftMotorC8ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorT1: '',
    leftMotorT1ReasonImpairmentNotDueToSci: null,
    leftMotorT1ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL2: '',
    leftMotorL2ReasonImpairmentNotDueToSci: null,
    leftMotorL2ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL3: '',
    leftMotorL3ReasonImpairmentNotDueToSci: null,
    leftMotorL3ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL4: '',
    leftMotorL4ReasonImpairmentNotDueToSci: null,
    leftMotorL4ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL5: '',
    leftMotorL5ReasonImpairmentNotDueToSci: null,
    leftMotorL5ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorS1: '',
    leftMotorS1ReasonImpairmentNotDueToSci: null,
    leftMotorS1ReasonImpairmentNotDueToSciSpecify: null,
    /* Classification and totals */
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
    leftUpperMotorTotal: '',
    lightTouchTotal: '',
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
    rightUpperMotorTotal: '',
    upperMotorTotal: '',
  };
};

export const cloneExamData = (
  examData: ExamData,
  convertUnkToNt: boolean = false,
): ExamData => {
  const clonedExamData = {...examData};

  Object.keys(clonedExamData).forEach((key) => {
    if (convertUnkToNt && /UNK/i.test(clonedExamData[key])) {
      clonedExamData[key] = 'NT';
    }
  });

  return clonedExamData;
};
