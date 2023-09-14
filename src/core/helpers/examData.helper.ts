import {
  Cell,
  MotorLevel,
  MotorLevels,
  SensoryLevels,
  Totals,
  ValidMotorValues,
  ValidSensoryValues,
} from '@core/domain';

const validateSensoryValue = (
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
    validateSensoryValue(
      `rightLightTouch${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );
    validateSensoryValue(
      `rightPinPrick${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );
    validateSensoryValue(
      `leftLightTouch${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );
    validateSensoryValue(
      `leftPinPrick${level}`,
      examData,
      errors,
      ValidSensoryValues,
    );

    if (MotorLevels.includes(level as MotorLevel)) {
      validateSensoryValue(
        `rightMotor${level}`,
        examData,
        errors,
        ValidMotorValues,
      );
      validateSensoryValue(
        `leftMotor${level}`,
        examData,
        errors,
        ValidMotorValues,
      );
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

  return [
    isMotor
      ? getCell(`right-motor-${level}`, `rightMotor${level}`, examData)
      : null,
    getCell(`right-light-touch-${level}`, `rightLightTouch${level}`, examData),
    getCell(`right-pin-prick-${level}`, `rightPinPrick${level}`, examData),
    getCell(`left-light-touch-${level}`, `leftLightTouch${level}`, examData),
    getCell(`left-pin-prick-${level}`, `leftPinPrick${level}`, examData),
    isMotor
      ? getCell(`left-motor-${level}`, `leftMotor${level}`, examData)
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
