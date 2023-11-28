import {
  Cell,
  MotorLevel,
  MotorLevels,
  SensoryLevels,
  Totals,
  ValidMotorValues,
  ValidSensoryValues,
} from '@core/domain';
import {ExamData} from '@core/domain/examData';
import {motorCellRegex, validCellNameRegex} from './regularExpressions';

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

export const validateExamData = (examData: {[key: string]: string}) => {
  const errors: string[] = [];

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

const getCell = (
  name: string,
  dataKey: string,
  examData: {[key: string]: string},
): Cell => {
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
  };

  return cell;
};

const getRow = (level: string, examData: {[key: string]: string}) => {
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

export const bindExamDataToGridModel = (examData: {[key: string]: string}) => {
  const gridModel: Array<Cell | null>[] = [];

  SensoryLevels.forEach((level) => {
    gridModel.push(getRow(level, examData));
  });

  return gridModel;
};

export const bindExamDataToTotals = (examData: {
  [key: string]: string;
}): Totals => {
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
    leftTouchTotal: examData['leftTouchTotal'] ?? '',
    leftUpperMotorTotal: examData['leftUpperMotorTotal'] ?? '',
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
    rightTouchTotal: examData['rightTouchTotal'] ?? '',
    rightUpperMotorTotal: examData['rightUpperMotorTotal'] ?? '',
    touchTotal: examData['touchTotal'] ?? '',
    upperMotorTotal: examData['upperMotorTotal'] ?? '',
  };
};

export const getExamDataFromGridModel = (gridModel: Array<Cell | null>[]) => {
  const examData: {[key: string]: string} = {};
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
    }
  });

  return {examData: examData as ExamData, isMissingValues};
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
  const level = /((?!-)(c|t|l|s)1?[0-9]$)|((?!-)s4_5)/.exec(cellName)?.[0];

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
