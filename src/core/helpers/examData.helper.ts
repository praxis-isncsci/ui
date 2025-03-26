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
import { BinaryObservation } from '@core/domain';
import { ValidBinaryObservationValues } from '@core/domain/binaryObservation';
import { gridModel } from '@app/store/reducers';

const validateValue = (
  dataKey: string,
  examData: any,
  errors: string[],
  validValues: string[],
) => {
  const value = examData[dataKey];

  if (!value) {
    errors.push(`${dataKey} does not have a value`);
    return;
  }

  if (!validValues.includes(value)) {
    errors.push(`Invalid value (${value}) for ${dataKey}`);
    return;
  }

  if (/\*/.test(value)) {
    const considerNormalKey = `${dataKey}ConsiderNormal`;

    if (examData[considerNormalKey] === null) {
      errors.push(
        `Missing to specify if ${dataKey} should be considered normal/not normal`,
      );
    }
  } else {
    const considerNormalKey = `${dataKey}ConsiderNormal`;
    const reasonKey = `${dataKey}ReasonImpairmentNotDueToSci`;
    const reasonSpecifyKey = `${dataKey}ReasonImpairmentNotDueToSciSpecify`;

    if (examData[considerNormalKey] !== null) {
      errors.push(
        `${considerNormalKey} has value ${examData[considerNormalKey]}, but the level was not marked with a star: ${value}`,
      );
    }

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

/**
 * Does not check for missing values as we could be getting incomplete forms from 3rd party sources
 * @param examData
 * @returns
 */
export const validateExamData = (examData: ExamData) => {
  const errors: string[] = [];

  if (
    examData.voluntaryAnalContraction &&
    !ValidBinaryObservationValues.includes(examData.voluntaryAnalContraction)
  ) {
    errors.push('Voluntary Anal Contraction has a missing or invalid value');
  }

  if (
    examData.deepAnalPressure &&
    !ValidBinaryObservationValues.includes(examData.deepAnalPressure)
  ) {
    errors.push('Deep Anal Pressure has a missing or invalid value');
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
    ``;

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
    considerNormal: hasStar ? examData[`${dataKey}ConsiderNormal`] : null,
    reasonImpairmentNotDueToSci: hasStar
      ? examData[`${dataKey}ReasonImpairmentNotDueToSci`]
      : null,
    reasonImpairmentNotDueToSciSpecify: hasStar
      ? examData[`${dataKey}ReasonImpairmentNotDueToSciSpecify`]
      : null,
    name,
    error: null,
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

  const missingValues: string[] = [];

  if (voluntaryAnalContraction === null) {
    missingValues.push('voluntaryAnalContraction');
  }

  if (deepAnalPressure === null) {
    missingValues.push('deepAnalPressure');
  }

  // Call getCellComments to generate the cell comments
  examData.cellComments = getCellComments(gridModel);

  gridModel.flat().forEach((cell) => {
    if (cell) {
      const key = cell.name.replace(/-([a-z])/gi, (a: string) =>
        a[1].toUpperCase(),
      );

      if (!cell.value) {
        missingValues.push(cell.name);
      }

      examData[key] = cell.value;
      examData[`${key}ConsiderNormal`] = cell.considerNormal;
      examData[`${key}ReasonImpairmentNotDueToSci`] =
        cell.reasonImpairmentNotDueToSci;
      examData[`${key}ReasonImpairmentNotDueToSciSpecify`] =
        cell.reasonImpairmentNotDueToSciSpecify;
    }
  });

  return { examData, missingValues };
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
  return { column: getCellColumn(cellName), row: getCellRow(cellName) };
};

/*
 * Returns an array of cells between two cells in the grid model.
 * The range is inclusive of the start and end cells.
 */
export const getCellRange = (
  start: { column: number; row: number },
  end: { column: number; row: number } | null,
  gridModel: Array<Cell | null>[],
  stopAtCellWithValue: boolean = false,
) => {
  const motorRange: Cell[] = [];
  const sensoryRange: Cell[] = [];
  const endPosition = end ?? { column: start.column, row: 27 };

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
          return { motorRange, sensoryRange };
        }

        if (motorCellRegex.test(cell.name)) {
          motorRange.push(cell);
        } else {
          sensoryRange.push(cell);
        }
      }
    }
  }

  return { motorRange, sensoryRange };
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
    errors: [],
    missingValues: [],
    comments: null,
    cellComments: null,
    deepAnalPressure: null,
    voluntaryAnalContraction: null,
    rightLowestNonKeyMuscleWithMotorFunction: null,
    leftLowestNonKeyMuscleWithMotorFunction: null,
    isComplete: false,
    /* Right Sensory */
    rightLightTouchC2: '',
    rightLightTouchC2ConsiderNormal: null,
    rightLightTouchC2ReasonImpairmentNotDueToSci: null,
    rightLightTouchC2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC3: '',
    rightLightTouchC3ConsiderNormal: null,
    rightLightTouchC3ReasonImpairmentNotDueToSci: null,
    rightLightTouchC3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC4: '',
    rightLightTouchC4ConsiderNormal: null,
    rightLightTouchC4ReasonImpairmentNotDueToSci: null,
    rightLightTouchC4ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC5: '',
    rightLightTouchC5ConsiderNormal: null,
    rightLightTouchC5ReasonImpairmentNotDueToSci: null,
    rightLightTouchC5ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC6: '',
    rightLightTouchC6ConsiderNormal: null,
    rightLightTouchC6ReasonImpairmentNotDueToSci: null,
    rightLightTouchC6ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC7: '',
    rightLightTouchC7ConsiderNormal: null,
    rightLightTouchC7ReasonImpairmentNotDueToSci: null,
    rightLightTouchC7ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchC8: '',
    rightLightTouchC8ConsiderNormal: null,
    rightLightTouchC8ReasonImpairmentNotDueToSci: null,
    rightLightTouchC8ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT1: '',
    rightLightTouchT1ConsiderNormal: null,
    rightLightTouchT1ReasonImpairmentNotDueToSci: null,
    rightLightTouchT1ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT2: '',
    rightLightTouchT2ConsiderNormal: null,
    rightLightTouchT2ReasonImpairmentNotDueToSci: null,
    rightLightTouchT2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT3: '',
    rightLightTouchT3ConsiderNormal: null,
    rightLightTouchT3ReasonImpairmentNotDueToSci: null,
    rightLightTouchT3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT4: '',
    rightLightTouchT4ConsiderNormal: null,
    rightLightTouchT4ReasonImpairmentNotDueToSci: null,
    rightLightTouchT4ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT5: '',
    rightLightTouchT5ConsiderNormal: null,
    rightLightTouchT5ReasonImpairmentNotDueToSci: null,
    rightLightTouchT5ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT6: '',
    rightLightTouchT6ConsiderNormal: null,
    rightLightTouchT6ReasonImpairmentNotDueToSci: null,
    rightLightTouchT6ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT7: '',
    rightLightTouchT7ConsiderNormal: null,
    rightLightTouchT7ReasonImpairmentNotDueToSci: null,
    rightLightTouchT7ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT8: '',
    rightLightTouchT8ConsiderNormal: null,
    rightLightTouchT8ReasonImpairmentNotDueToSci: null,
    rightLightTouchT8ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT9: '',
    rightLightTouchT9ConsiderNormal: null,
    rightLightTouchT9ReasonImpairmentNotDueToSci: null,
    rightLightTouchT9ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT10: '',
    rightLightTouchT10ConsiderNormal: null,
    rightLightTouchT10ReasonImpairmentNotDueToSci: null,
    rightLightTouchT10ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT11: '',
    rightLightTouchT11ConsiderNormal: null,
    rightLightTouchT11ReasonImpairmentNotDueToSci: null,
    rightLightTouchT11ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchT12: '',
    rightLightTouchT12ConsiderNormal: null,
    rightLightTouchT12ReasonImpairmentNotDueToSci: null,
    rightLightTouchT12ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL1: '',
    rightLightTouchL1ConsiderNormal: null,
    rightLightTouchL1ReasonImpairmentNotDueToSci: null,
    rightLightTouchL1ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL2: '',
    rightLightTouchL2ConsiderNormal: null,
    rightLightTouchL2ReasonImpairmentNotDueToSci: null,
    rightLightTouchL2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL3: '',
    rightLightTouchL3ConsiderNormal: null,
    rightLightTouchL3ReasonImpairmentNotDueToSci: null,
    rightLightTouchL3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL4: '',
    rightLightTouchL4ConsiderNormal: null,
    rightLightTouchL4ReasonImpairmentNotDueToSci: null,
    rightLightTouchL4ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchL5: '',
    rightLightTouchL5ConsiderNormal: null,
    rightLightTouchL5ReasonImpairmentNotDueToSci: null,
    rightLightTouchL5ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS1: '',
    rightLightTouchS1ConsiderNormal: null,
    rightLightTouchS1ReasonImpairmentNotDueToSci: null,
    rightLightTouchS1ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS2: '',
    rightLightTouchS2ConsiderNormal: null,
    rightLightTouchS2ReasonImpairmentNotDueToSci: null,
    rightLightTouchS2ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS3: '',
    rightLightTouchS3ConsiderNormal: null,
    rightLightTouchS3ReasonImpairmentNotDueToSci: null,
    rightLightTouchS3ReasonImpairmentNotDueToSciSpecify: null,
    rightLightTouchS4_5: '',
    rightLightTouchS4_5ConsiderNormal: null,
    rightLightTouchS4_5ReasonImpairmentNotDueToSci: null,
    rightLightTouchS4_5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC2: '',
    rightPinPrickC2ConsiderNormal: null,
    rightPinPrickC2ReasonImpairmentNotDueToSci: null,
    rightPinPrickC2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC3: '',
    rightPinPrickC3ConsiderNormal: null,
    rightPinPrickC3ReasonImpairmentNotDueToSci: null,
    rightPinPrickC3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC4: '',
    rightPinPrickC4ConsiderNormal: null,
    rightPinPrickC4ReasonImpairmentNotDueToSci: null,
    rightPinPrickC4ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC5: '',
    rightPinPrickC5ConsiderNormal: null,
    rightPinPrickC5ReasonImpairmentNotDueToSci: null,
    rightPinPrickC5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC6: '',
    rightPinPrickC6ConsiderNormal: null,
    rightPinPrickC6ReasonImpairmentNotDueToSci: null,
    rightPinPrickC6ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC7: '',
    rightPinPrickC7ConsiderNormal: null,
    rightPinPrickC7ReasonImpairmentNotDueToSci: null,
    rightPinPrickC7ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickC8: '',
    rightPinPrickC8ConsiderNormal: null,
    rightPinPrickC8ReasonImpairmentNotDueToSci: null,
    rightPinPrickC8ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT1: '',
    rightPinPrickT1ConsiderNormal: null,
    rightPinPrickT1ReasonImpairmentNotDueToSci: null,
    rightPinPrickT1ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT2: '',
    rightPinPrickT2ConsiderNormal: null,
    rightPinPrickT2ReasonImpairmentNotDueToSci: null,
    rightPinPrickT2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT3: '',
    rightPinPrickT3ConsiderNormal: null,
    rightPinPrickT3ReasonImpairmentNotDueToSci: null,
    rightPinPrickT3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT4: '',
    rightPinPrickT4ConsiderNormal: null,
    rightPinPrickT4ReasonImpairmentNotDueToSci: null,
    rightPinPrickT4ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT5: '',
    rightPinPrickT5ConsiderNormal: null,
    rightPinPrickT5ReasonImpairmentNotDueToSci: null,
    rightPinPrickT5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT6: '',
    rightPinPrickT6ConsiderNormal: null,
    rightPinPrickT6ReasonImpairmentNotDueToSci: null,
    rightPinPrickT6ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT7: '',
    rightPinPrickT7ConsiderNormal: null,
    rightPinPrickT7ReasonImpairmentNotDueToSci: null,
    rightPinPrickT7ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT8: '',
    rightPinPrickT8ConsiderNormal: null,
    rightPinPrickT8ReasonImpairmentNotDueToSci: null,
    rightPinPrickT8ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT9: '',
    rightPinPrickT9ConsiderNormal: null,
    rightPinPrickT9ReasonImpairmentNotDueToSci: null,
    rightPinPrickT9ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT10: '',
    rightPinPrickT10ConsiderNormal: null,
    rightPinPrickT10ReasonImpairmentNotDueToSci: null,
    rightPinPrickT10ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT11: '',
    rightPinPrickT11ConsiderNormal: null,
    rightPinPrickT11ReasonImpairmentNotDueToSci: null,
    rightPinPrickT11ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickT12: '',
    rightPinPrickT12ConsiderNormal: null,
    rightPinPrickT12ReasonImpairmentNotDueToSci: null,
    rightPinPrickT12ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL1: '',
    rightPinPrickL1ConsiderNormal: null,
    rightPinPrickL1ReasonImpairmentNotDueToSci: null,
    rightPinPrickL1ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL2: '',
    rightPinPrickL2ConsiderNormal: null,
    rightPinPrickL2ReasonImpairmentNotDueToSci: null,
    rightPinPrickL2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL3: '',
    rightPinPrickL3ConsiderNormal: null,
    rightPinPrickL3ReasonImpairmentNotDueToSci: null,
    rightPinPrickL3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL4: '',
    rightPinPrickL4ConsiderNormal: null,
    rightPinPrickL4ReasonImpairmentNotDueToSci: null,
    rightPinPrickL4ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickL5: '',
    rightPinPrickL5ConsiderNormal: null,
    rightPinPrickL5ReasonImpairmentNotDueToSci: null,
    rightPinPrickL5ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS1: '',
    rightPinPrickS1ConsiderNormal: null,
    rightPinPrickS1ReasonImpairmentNotDueToSci: null,
    rightPinPrickS1ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS2: '',
    rightPinPrickS2ConsiderNormal: null,
    rightPinPrickS2ReasonImpairmentNotDueToSci: null,
    rightPinPrickS2ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS3: '',
    rightPinPrickS3ConsiderNormal: null,
    rightPinPrickS3ReasonImpairmentNotDueToSci: null,
    rightPinPrickS3ReasonImpairmentNotDueToSciSpecify: null,
    rightPinPrickS4_5: '',
    rightPinPrickS4_5ConsiderNormal: null,
    rightPinPrickS4_5ReasonImpairmentNotDueToSci: null,
    rightPinPrickS4_5ReasonImpairmentNotDueToSciSpecify: null,

    /* Left Sensory */
    leftLightTouchC2: '',
    leftLightTouchC2ConsiderNormal: null,
    leftLightTouchC2ReasonImpairmentNotDueToSci: null,
    leftLightTouchC2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC3: '',
    leftLightTouchC3ConsiderNormal: null,
    leftLightTouchC3ReasonImpairmentNotDueToSci: null,
    leftLightTouchC3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC4: '',
    leftLightTouchC4ConsiderNormal: null,
    leftLightTouchC4ReasonImpairmentNotDueToSci: null,
    leftLightTouchC4ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC5: '',
    leftLightTouchC5ConsiderNormal: null,
    leftLightTouchC5ReasonImpairmentNotDueToSci: null,
    leftLightTouchC5ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC6: '',
    leftLightTouchC6ConsiderNormal: null,
    leftLightTouchC6ReasonImpairmentNotDueToSci: null,
    leftLightTouchC6ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC7: '',
    leftLightTouchC7ConsiderNormal: null,
    leftLightTouchC7ReasonImpairmentNotDueToSci: null,
    leftLightTouchC7ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchC8: '',
    leftLightTouchC8ConsiderNormal: null,
    leftLightTouchC8ReasonImpairmentNotDueToSci: null,
    leftLightTouchC8ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT1: '',
    leftLightTouchT1ConsiderNormal: null,
    leftLightTouchT1ReasonImpairmentNotDueToSci: null,
    leftLightTouchT1ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT2: '',
    leftLightTouchT2ConsiderNormal: null,
    leftLightTouchT2ReasonImpairmentNotDueToSci: null,
    leftLightTouchT2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT3: '',
    leftLightTouchT3ConsiderNormal: null,
    leftLightTouchT3ReasonImpairmentNotDueToSci: null,
    leftLightTouchT3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT4: '',
    leftLightTouchT4ConsiderNormal: null,
    leftLightTouchT4ReasonImpairmentNotDueToSci: null,
    leftLightTouchT4ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT5: '',
    leftLightTouchT5ConsiderNormal: null,
    leftLightTouchT5ReasonImpairmentNotDueToSci: null,
    leftLightTouchT5ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT6: '',
    leftLightTouchT6ConsiderNormal: null,
    leftLightTouchT6ReasonImpairmentNotDueToSci: null,
    leftLightTouchT6ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT7: '',
    leftLightTouchT7ConsiderNormal: null,
    leftLightTouchT7ReasonImpairmentNotDueToSci: null,
    leftLightTouchT7ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT8: '',
    leftLightTouchT8ConsiderNormal: null,
    leftLightTouchT8ReasonImpairmentNotDueToSci: null,
    leftLightTouchT8ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT9: '',
    leftLightTouchT9ConsiderNormal: null,
    leftLightTouchT9ReasonImpairmentNotDueToSci: null,
    leftLightTouchT9ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT10: '',
    leftLightTouchT10ConsiderNormal: null,
    leftLightTouchT10ReasonImpairmentNotDueToSci: null,
    leftLightTouchT10ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT11: '',
    leftLightTouchT11ConsiderNormal: null,
    leftLightTouchT11ReasonImpairmentNotDueToSci: null,
    leftLightTouchT11ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchT12: '',
    leftLightTouchT12ConsiderNormal: null,
    leftLightTouchT12ReasonImpairmentNotDueToSci: null,
    leftLightTouchT12ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL1: '',
    leftLightTouchL1ConsiderNormal: null,
    leftLightTouchL1ReasonImpairmentNotDueToSci: null,
    leftLightTouchL1ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL2: '',
    leftLightTouchL2ConsiderNormal: null,
    leftLightTouchL2ReasonImpairmentNotDueToSci: null,
    leftLightTouchL2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL3: '',
    leftLightTouchL3ConsiderNormal: null,
    leftLightTouchL3ReasonImpairmentNotDueToSci: null,
    leftLightTouchL3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL4: '',
    leftLightTouchL4ConsiderNormal: null,
    leftLightTouchL4ReasonImpairmentNotDueToSci: null,
    leftLightTouchL4ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchL5: '',
    leftLightTouchL5ConsiderNormal: null,
    leftLightTouchL5ReasonImpairmentNotDueToSci: null,
    leftLightTouchL5ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS1: '',
    leftLightTouchS1ConsiderNormal: null,
    leftLightTouchS1ReasonImpairmentNotDueToSci: null,
    leftLightTouchS1ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS2: '',
    leftLightTouchS2ConsiderNormal: null,
    leftLightTouchS2ReasonImpairmentNotDueToSci: null,
    leftLightTouchS2ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS3: '',
    leftLightTouchS3ConsiderNormal: null,
    leftLightTouchS3ReasonImpairmentNotDueToSci: null,
    leftLightTouchS3ReasonImpairmentNotDueToSciSpecify: null,
    leftLightTouchS4_5: '',
    leftLightTouchS4_5ConsiderNormal: null,
    leftLightTouchS4_5ReasonImpairmentNotDueToSci: null,
    leftLightTouchS4_5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC2: '',
    leftPinPrickC2ConsiderNormal: null,
    leftPinPrickC2ReasonImpairmentNotDueToSci: null,
    leftPinPrickC2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC3: '',
    leftPinPrickC3ConsiderNormal: null,
    leftPinPrickC3ReasonImpairmentNotDueToSci: null,
    leftPinPrickC3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC4: '',
    leftPinPrickC4ConsiderNormal: null,
    leftPinPrickC4ReasonImpairmentNotDueToSci: null,
    leftPinPrickC4ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC5: '',
    leftPinPrickC5ConsiderNormal: null,
    leftPinPrickC5ReasonImpairmentNotDueToSci: null,
    leftPinPrickC5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC6: '',
    leftPinPrickC6ConsiderNormal: null,
    leftPinPrickC6ReasonImpairmentNotDueToSci: null,
    leftPinPrickC6ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC7: '',
    leftPinPrickC7ConsiderNormal: null,
    leftPinPrickC7ReasonImpairmentNotDueToSci: null,
    leftPinPrickC7ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickC8: '',
    leftPinPrickC8ConsiderNormal: null,
    leftPinPrickC8ReasonImpairmentNotDueToSci: null,
    leftPinPrickC8ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT1: '',
    leftPinPrickT1ConsiderNormal: null,
    leftPinPrickT1ReasonImpairmentNotDueToSci: null,
    leftPinPrickT1ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT2: '',
    leftPinPrickT2ConsiderNormal: null,
    leftPinPrickT2ReasonImpairmentNotDueToSci: null,
    leftPinPrickT2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT3: '',
    leftPinPrickT3ConsiderNormal: null,
    leftPinPrickT3ReasonImpairmentNotDueToSci: null,
    leftPinPrickT3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT4: '',
    leftPinPrickT4ConsiderNormal: null,
    leftPinPrickT4ReasonImpairmentNotDueToSci: null,
    leftPinPrickT4ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT5: '',
    leftPinPrickT5ConsiderNormal: null,
    leftPinPrickT5ReasonImpairmentNotDueToSci: null,
    leftPinPrickT5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT6: '',
    leftPinPrickT6ConsiderNormal: null,
    leftPinPrickT6ReasonImpairmentNotDueToSci: null,
    leftPinPrickT6ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT7: '',
    leftPinPrickT7ConsiderNormal: null,
    leftPinPrickT7ReasonImpairmentNotDueToSci: null,
    leftPinPrickT7ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT8: '',
    leftPinPrickT8ConsiderNormal: null,
    leftPinPrickT8ReasonImpairmentNotDueToSci: null,
    leftPinPrickT8ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT9: '',
    leftPinPrickT9ConsiderNormal: null,
    leftPinPrickT9ReasonImpairmentNotDueToSci: null,
    leftPinPrickT9ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT10: '',
    leftPinPrickT10ConsiderNormal: null,
    leftPinPrickT10ReasonImpairmentNotDueToSci: null,
    leftPinPrickT10ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT11: '',
    leftPinPrickT11ConsiderNormal: null,
    leftPinPrickT11ReasonImpairmentNotDueToSci: null,
    leftPinPrickT11ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickT12: '',
    leftPinPrickT12ConsiderNormal: null,
    leftPinPrickT12ReasonImpairmentNotDueToSci: null,
    leftPinPrickT12ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL1: '',
    leftPinPrickL1ConsiderNormal: null,
    leftPinPrickL1ReasonImpairmentNotDueToSci: null,
    leftPinPrickL1ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL2: '',
    leftPinPrickL2ConsiderNormal: null,
    leftPinPrickL2ReasonImpairmentNotDueToSci: null,
    leftPinPrickL2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL3: '',
    leftPinPrickL3ConsiderNormal: null,
    leftPinPrickL3ReasonImpairmentNotDueToSci: null,
    leftPinPrickL3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL4: '',
    leftPinPrickL4ConsiderNormal: null,
    leftPinPrickL4ReasonImpairmentNotDueToSci: null,
    leftPinPrickL4ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickL5: '',
    leftPinPrickL5ConsiderNormal: null,
    leftPinPrickL5ReasonImpairmentNotDueToSci: null,
    leftPinPrickL5ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS1: '',
    leftPinPrickS1ConsiderNormal: null,
    leftPinPrickS1ReasonImpairmentNotDueToSci: null,
    leftPinPrickS1ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS2: '',
    leftPinPrickS2ConsiderNormal: null,
    leftPinPrickS2ReasonImpairmentNotDueToSci: null,
    leftPinPrickS2ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS3: '',
    leftPinPrickS3ConsiderNormal: null,
    leftPinPrickS3ReasonImpairmentNotDueToSci: null,
    leftPinPrickS3ReasonImpairmentNotDueToSciSpecify: null,
    leftPinPrickS4_5: '',
    leftPinPrickS4_5ConsiderNormal: null,
    leftPinPrickS4_5ReasonImpairmentNotDueToSci: null,
    leftPinPrickS4_5ReasonImpairmentNotDueToSciSpecify: null,
    /* Right Motor */
    rightMotorC5: '',
    rightMotorC5ConsiderNormal: null,
    rightMotorC5ReasonImpairmentNotDueToSci: null,
    rightMotorC5ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorC6: '',
    rightMotorC6ConsiderNormal: null,
    rightMotorC6ReasonImpairmentNotDueToSci: null,
    rightMotorC6ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorC7: '',
    rightMotorC7ConsiderNormal: null,
    rightMotorC7ReasonImpairmentNotDueToSci: null,
    rightMotorC7ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorC8: '',
    rightMotorC8ConsiderNormal: null,
    rightMotorC8ReasonImpairmentNotDueToSci: null,
    rightMotorC8ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorT1: '',
    rightMotorT1ConsiderNormal: null,
    rightMotorT1ReasonImpairmentNotDueToSci: null,
    rightMotorT1ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL2: '',
    rightMotorL2ConsiderNormal: null,
    rightMotorL2ReasonImpairmentNotDueToSci: null,
    rightMotorL2ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL3: '',
    rightMotorL3ConsiderNormal: null,
    rightMotorL3ReasonImpairmentNotDueToSci: null,
    rightMotorL3ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL4: '',
    rightMotorL4ConsiderNormal: null,
    rightMotorL4ReasonImpairmentNotDueToSci: null,
    rightMotorL4ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorL5: '',
    rightMotorL5ConsiderNormal: null,
    rightMotorL5ReasonImpairmentNotDueToSci: null,
    rightMotorL5ReasonImpairmentNotDueToSciSpecify: null,
    rightMotorS1: '',
    rightMotorS1ConsiderNormal: null,
    rightMotorS1ReasonImpairmentNotDueToSci: null,
    rightMotorS1ReasonImpairmentNotDueToSciSpecify: null,
    /* Left Motor */
    leftMotorC5: '',
    leftMotorC5ConsiderNormal: null,
    leftMotorC5ReasonImpairmentNotDueToSci: null,
    leftMotorC5ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorC6: '',
    leftMotorC6ConsiderNormal: null,
    leftMotorC6ReasonImpairmentNotDueToSci: null,
    leftMotorC6ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorC7: '',
    leftMotorC7ConsiderNormal: null,
    leftMotorC7ReasonImpairmentNotDueToSci: null,
    leftMotorC7ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorC8: '',
    leftMotorC8ConsiderNormal: null,
    leftMotorC8ReasonImpairmentNotDueToSci: null,
    leftMotorC8ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorT1: '',
    leftMotorT1ConsiderNormal: null,
    leftMotorT1ReasonImpairmentNotDueToSci: null,
    leftMotorT1ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL2: '',
    leftMotorL2ConsiderNormal: null,
    leftMotorL2ReasonImpairmentNotDueToSci: null,
    leftMotorL2ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL3: '',
    leftMotorL3ConsiderNormal: null,
    leftMotorL3ReasonImpairmentNotDueToSci: null,
    leftMotorL3ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL4: '',
    leftMotorL4ConsiderNormal: null,
    leftMotorL4ReasonImpairmentNotDueToSci: null,
    leftMotorL4ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorL5: '',
    leftMotorL5ConsiderNormal: null,
    leftMotorL5ReasonImpairmentNotDueToSci: null,
    leftMotorL5ReasonImpairmentNotDueToSciSpecify: null,
    leftMotorS1: '',
    leftMotorS1ConsiderNormal: null,
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

export const getExamDataWithAllNormalValues = (): ExamData => {
  const examData = getEmptyExamData();
  examData.voluntaryAnalContraction = 'Yes';
  examData.deepAnalPressure = 'Yes';

  Object.keys(examData).forEach((key) => {
    if (
      /^(right|left)(LightTouch|PinPrick)(?!.*(NotDueToSci|ConsiderNormal))/.test(
        key,
      )
    ) {
      examData[key] = '2';
    } else if (
      /^(right|left)Motor(?!.*(NotDueToSci|ConsiderNormal))/.test(key)
    ) {
      examData[key] = '5';
    }
  });

  return examData;
};

export const cloneExamData = (
  examData: ExamData,
  convertUnkToNt: boolean = false,
): ExamData => {
  const clonedExamData = { ...examData };

  Object.keys(clonedExamData).forEach((key) => {
    if (convertUnkToNt && /UNK/i.test(clonedExamData[key])) {
      clonedExamData[key] = 'NT';
    }
  });

  return clonedExamData;
};

export const getCellComments = (gridModel: Array<(Cell | null)[]>): string => {
  const commentsArray: { order: number; comment: string }[] = [];
  const cellsByGroup: { [key: string]: Cell[] } = {};

  const reasonOptionsMap: { [key: string]: string } = {
    '1': 'Plexopathy',
    '2': 'Peripheral neuropathy',
    '3': 'Pre-existing myoneural disease (e.g. Stroke, MS, etc.)',
    '6': 'Other (specify:)',
  };

  const considerNormalMap: { [key: string]: string } = {
    'true': 'Consider Normal for classification',
    'false': 'Consider Not Normal for classification',
  };

  // Group cells by side, type, and attributes
  for (const row of gridModel) {
    for (const cell of row) {
      if (cell && cell.value && cell.value.includes('*')) {
        const side = cell.name.startsWith('right') ? 'Right' : 'Left';

        const typeMatch = cell.name.match(/(motor|light-touch|pin-prick)/);
        const typeKey = typeMatch ? typeMatch[1] : '';
        const typeMap: { [key: string]: string } = {
          'motor': 'Motor',
          'light-touch': 'LT',
          'pin-prick': 'PP',
        };
        const type = typeMap[typeKey] || typeKey;

        const considerNormal = cell.considerNormal?.toString() ?? '';
        const reason = cell.reasonImpairmentNotDueToSci ?? '';
        const reasonSpecify = cell.reasonImpairmentNotDueToSciSpecify ?? '';

        const groupKey = `${side}-${type}-${considerNormal}-${reason}-${reasonSpecify}`;

        if (!cellsByGroup[groupKey]) {
          cellsByGroup[groupKey] = [];
        }

        cellsByGroup[groupKey].push(cell);
      }
    }
  }

  // Process ea. group
  for (const groupKey in cellsByGroup) {
    const groupCells = cellsByGroup[groupKey];

    // Sort cells by order
    groupCells.sort(compareCells);

    // Create subgroups of contiguous levels
    const subGroups: Cell[][] = [];
    let currentSubGroup: Cell[] = [];

    for (let i = 0; i < groupCells.length; i++) {
      const currentCell = groupCells[i];

      if (currentSubGroup.length === 0) {
        currentSubGroup.push(currentCell);
      } else {
        const lastCell = currentSubGroup[currentSubGroup.length - 1];

        if (areCellsContiguous(lastCell, currentCell)) {
          currentSubGroup.push(currentCell);
        } else {
          subGroups.push(currentSubGroup);
          currentSubGroup = [currentCell];
        }
      }
    }

    if (currentSubGroup.length > 0) {
      subGroups.push(currentSubGroup);
    }

    // Generate comments for each subgroup
    for (const subGroup of subGroups) {
      const levels = subGroup.map((cell) => getLevelName(cell.name));
      const levelRange = createLevelRange(levels);

      const [side, type, considerNormalValue, reasonValue, reasonSpecifyValue] = groupKey.split('-', 5);

      const considerNormalText = considerNormalMap[considerNormalValue] || '';
      const reasonText = reasonOptionsMap[reasonValue] || reasonValue;

      let comment = `${levelRange} ${side} ${type}: `;
      if (considerNormalText) {
        comment += `${considerNormalText}. `;
      }
      if (reasonText) {
        comment += `${reasonText}. `;
      }
      if (reasonSpecifyValue) {
        comment += `${reasonSpecifyValue}`;
      }

      // Get the starting level's order for sorting comments
      const levelOrder = getLevelOrder(subGroup[0].name);

      commentsArray.push({ order: levelOrder, comment: comment.trim() });
    }
  }

  // Sort comments based on anatomical order
  commentsArray.sort((a, b) => a.order - b.order);

  // Build the final comments string
  const sortedComments = commentsArray.map((item) => item.comment);

  return sortedComments.join('; ');
};

const levelsInOrder = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5',
  'S1', 'S2', 'S3', 'S4_5'
];

const getLevelName = (cellName: string): string => {
  const match = cellName.match(/-([CTLS]\d+_?\d?)/i);
  return match ? match[1].toUpperCase() : '';
};

const getLevelOrder = (cellName: string): number => {
  const levelName = getLevelName(cellName);
  const order = levelsInOrder.indexOf(levelName) + 1; 
  return order;
};

const compareCells = (a: Cell, b: Cell): number => {
  const orderA = getLevelOrder(a.name);
  const orderB = getLevelOrder(b.name);
  return orderA - orderB;
};

const areCellsContiguous = (cellA: Cell, cellB: Cell): boolean => {
  const orderA = getLevelOrder(cellA.name);
  const orderB = getLevelOrder(cellB.name);
  return orderB === orderA + 1;
};

const createLevelRange = (levels: string[]): string => {
  if (levels.length === 1) {
    return levels[0];
  } else {
    return `${levels[0]}-${levels[levels.length - 1]}`;
  }
};

export const formatLevelName = (levelStr: string): string => {
  if (!levelStr) {
    return "";
  }

  // Split string by commas, trim, and filter out empty tokens
  const tokens = levelStr.split(",").map(t => t.trim()).filter(t => t !== "");
  if (tokens.length === 0) {
    return "";
  }
  if (tokens.length === 1) {
    // Single entry => return as is (no ND prefix)
    return tokens[0];
  }

  // Classify tokens into special codes vs. normal levels
  const leadingCodes: string[] = [];
  let trailingINT = ""; // if "INT" is present
  const normalLevels: string[] = [];

  for (const token of tokens) {
    const base = token.toUpperCase();
    if (base === "NA" || base === "NT") {
      // NA or NT at the front
      if (!leadingCodes.includes(base)) {
        leadingCodes.push(base);
      }
    } else if (base === "INT") {
      // INT at the end
      trailingINT = "INT";
    } else {
      // Otherwise, normal spinal level
      normalLevels.push(token);
    }
  }

  leadingCodes.sort((a, b) => {
    if (a === b) return 0;
    if (a === "NA") return -1;
    if (b === "NA") return 1;
    if (a === "NT") return -1;
    if (b === "NT") return 1;
    return a.localeCompare(b);
  });

  // normalLevels to range compression
  interface LevelInfo {
    region: string;
    start: number;
    end: number;
    starred: boolean;
    originalLabel: string;
  }

  // tracking if base level is starred
  const levelMap: { [baseLevel: string]: boolean } = {};
  for (const lvl of normalLevels) {
    let base = lvl.toUpperCase();
    let isStarred = false;
    if (base.endsWith("*")) {
      isStarred = true;
      base = base.slice(0, -1);
    }
    // Remove internal spaces
    base = base.replace(/\s+/g, "");

    if (base in levelMap) {
      levelMap[base] = levelMap[base] || isStarred;
    } else {
      levelMap[base] = isStarred;
    }
  }

  // convert ea. unique base level to a structured LevelInfo
  const regionOrder: { [r: string]: number } = { C: 1, T: 2, L: 3, S: 4 };
  const levelsInfo: LevelInfo[] = [];
  for (const baseLevel in levelMap) {
    const starred = levelMap[baseLevel];
    const region = baseLevel.charAt(0);
    const remainder = baseLevel.slice(1);

    let startNum: number;
    let endNum: number;
    // If it's S4-5, or S4_5, handle as a combined segment
    if (remainder.includes("-") || remainder.includes("_")) {
      const parts = remainder.split(/[-_]/).map(n => parseInt(n, 10));
      startNum = parts[0];
      endNum = parts[1];
    } else {
      const num = parseInt(remainder, 10);
      startNum = num;
      endNum = num;
    }

    levelsInfo.push({
      region,
      start: startNum,
      end: endNum,
      starred,
      originalLabel: `${region}${remainder}`,
    });
  }

  levelsInfo.sort((a, b) => {
    if (a.region !== b.region) {
      return (regionOrder[a.region] || 99) - (regionOrder[b.region] || 99);
    }
    return a.start - b.start;
  });

  // compress cont. ranges
  const compressed: string[] = [];
  let i = 0;
  while (i < levelsInfo.length) {
    const first = levelsInfo[i];
    let last = first;
    let anyStar = first.starred;

    let j = i + 1;
    while (j < levelsInfo.length) {
      const next = levelsInfo[j];
      let contiguous = false;

      if (next.region === last.region) {
        // Same region => check numeric continuity
        if (last.end + 1 === next.start) {
          contiguous = true;
        }
      } else {
        if (
          (last.region === "C" && last.end === 8 && next.region === "T" && next.start === 1) ||
          (last.region === "T" && last.end === 12 && next.region === "L" && next.start === 1) ||
          (last.region === "L" && last.end === 5 && next.region === "S" && next.start === 1)
        ) {
          contiguous = true;
        }
      }

      if (!contiguous) break;
      if (next.starred) {
        anyStar = true;
      }
      last = next;
      j++;
    }

    // label for [first..last]
    let part: string;
    if (first.region === last.region && first.start === last.end) {
      part = first.originalLabel;
    } else if (first.region === last.region) {
      if (last.originalLabel.includes("-")) {
        part = `${first.region}${first.start}–${last.originalLabel}`;
      } else {
        part = `${first.region}${first.start}–${last.end}`;
      }
    } else {
      part = `${first.region}${first.start}–${last.region}${last.end}`;
    }

    // star if any in that range was starred
    if (anyStar && !part.endsWith("*")) {
      part += "*";
    }

    compressed.push(part);
    i = j;
  }

  // assembling the final string in order:
  // leadingCodes (NA) -> compressed levels -> INT 
  let finalOutput = "";
  if (leadingCodes.length > 0) {
    finalOutput = leadingCodes.join(", ");
  }
  if (compressed.length > 0) {
    // if we already have leading codes, add a comma
    if (finalOutput) {
      finalOutput += ", ";
    }
    finalOutput += compressed.join(", ");
  }
  if (trailingINT) {
    // if we have INT, place it at the end
    if (finalOutput) {
      finalOutput += ", ";
    }
    finalOutput += trailingINT;
  }

  // if final output has multiple levels with commas or a range dash -> ND or ND* needed
  const multipleParts = finalOutput.includes(",") || finalOutput.includes("–");
  if (multipleParts) {
    const hasStar = finalOutput.includes("*");
    const prefix = hasStar ? "ND*:" : "ND:";
    finalOutput = prefix + " " + finalOutput;
  }

  return finalOutput;
};

export const formatASIAImpairmentScale = (rawAIS: string): string => {
  if (!rawAIS || rawAIS.trim() === "") {
    return "";
  }
  let ais = rawAIS.trim();
  let hasStar = false;
  if (ais.startsWith("*") || ais.endsWith("*")) {
    hasStar = true;
    ais = ais.replace(/\*/g, "").trim();
  }
  const multipleGrades = ais.indexOf("/") !== -1 || ais.indexOf(",") !== -1 || ais.indexOf(" ") !== -1;
  if (multipleGrades || hasStar) {
    const prefix = hasStar ? "ND*:" : "ND:";
    return `${prefix} ${ais}`;
  }
  return ais;
}