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
  const commentsArray: string[] = [];
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

  // Loop through the grid model
  for (const row of gridModel) {
    for (const cell of row) {
      if (cell && cell.value && cell.value.includes('*')) {
        // Determine side (Left or Right)
        const side = cell.name.startsWith('right') ? 'Right' : 'Left';

        // Determine type (Motor, Light Touch, Pin Prick)
        const typeMatch = cell.name.match(/(motor|light-touch|pin-prick)/);
        const typeKey = typeMatch ? typeMatch[1] : '';
        const typeMap: { [key: string]: string } = {
          'motor': 'M',
          'light-touch': 'LT',
          'pin-prick': 'PP',
        };
        const type = typeMap[typeKey] || typeKey;

        // Get attributes
        const considerNormal = cell.considerNormal ?? '';
        const reason = cell.reasonImpairmentNotDueToSci ?? '';
        const reasonSpecify = cell.reasonImpairmentNotDueToSciSpecify ?? '';

        // Create a group key that includes attributes
        const groupKey = `${side}-${type}-${considerNormal}-${reason}-${reasonSpecify}`;

        // Initialize the group if it doesn't exist
        if (!cellsByGroup[groupKey]) {
          cellsByGroup[groupKey] = [];
        }

        // Add the cell to the group
        cellsByGroup[groupKey].push(cell);
      }
    }
  }

  // Generate comments for each group
  for (const groupKey in cellsByGroup) {
    const groupCells = cellsByGroup[groupKey];

    // Extract levels from cell names
    const levels = groupCells.map((cell) => {
      const match = cell.name.match(/-([ctls]\d+_?\d?)/i);
      return match ? match[1].toUpperCase() : '';
    });

    // Sort levels to create a range
    const sortedLevels = sortLevels(levels);

    // Create a level range
    const levelRange = createLevelRange(sortedLevels);

    // Get side and type from the group key
    const [side, type] = groupKey.split('-', 2);

    // Get attributes from the group key
    const attributes = groupKey.split('-').slice(2);
    const considerNormalValue = attributes[0];
    const reasonValue = attributes[1];
    const reasonSpecifyValue = attributes[2];

    // Map considerNormal and reason values
    const considerNormalText = considerNormalMap[considerNormalValue] || '';
    const reasonText = reasonOptionsMap[reasonValue] || reasonValue; // Use the reason code if not in map

    // Build the comment string
    let comment = `${levelRange} ${side} ${type}: `;
    if (considerNormalText) {
      comment += `${considerNormalText}. `;
    }
    if (reasonText) {
      comment += `Reason: ${reasonText}. `;
    }
    if (reasonSpecifyValue) {
      comment += `Specify: ${reasonSpecifyValue};`;
    }

    commentsArray.push(comment.trim());
  }

  return commentsArray.join('\n');
};

// Helper function to sort levels
const sortLevels = (levels: string[]): string[] => {
  const levelOrder: { [key: string]: number } = {
    'C': 1,
    'T': 2,
    'L': 3,
    'S': 4,
  };

  return levels.sort((a, b) => {
    const parseLevel = (level: string) => {
      const match = level.match(/^([CTLS])(\d+)(?:_(\d+))?$/i);
      if (!match) return { region: '', number: 0, subNumber: 0 };
      const region = match[1].toUpperCase();
      const number = parseInt(match[2], 10);
      const subNumber = match[3] ? parseInt(match[3], 10) : 0;
      return { region, number, subNumber };
    };

    const levelA = parseLevel(a);
    const levelB = parseLevel(b);

    if (levelOrder[levelA.region] !== levelOrder[levelB.region]) {
      return levelOrder[levelA.region] - levelOrder[levelB.region];
    } else if (levelA.number !== levelB.number) {
      return levelA.number - levelB.number;
    } else {
      return levelA.subNumber - levelB.subNumber;
    }
  });
};

// Helper function to create level range
const createLevelRange = (levels: string[]): string => {
  if (levels.length === 1) {
    return levels[0];
  } else {
    return `${levels[0]}-${levels[levels.length - 1]}`;
  }
};
