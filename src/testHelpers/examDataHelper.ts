import {
  MotorLevel,
  MotorLevels as ML,
  SensoryLevels as SL,
  ExamData,
} from '@core/domain';

const SensoryLevels = SL.slice(0);
const MotorLevels = ML.slice(0);

export const getRandomExamData = () => {
  const comments = ['random comment', null];
  const reasonsForImpairmentNotDueToSci = ['1', '2', '3', null];
  const motorValues = [
    '0',
    '0*',
    '0**',
    '1*',
    '1**',
    '1',
    '2',
    '2*',
    '2**',
    '3',
    '3*',
    '3**',
    '4',
    '4*',
    '4**',
    '5',
  ];
  const sensoryValues = ['0', '0*', '0**', '1', '1*', '1**', '2'];
  const binaryObservation = ['Yes', 'No'];
  const lowersNonKeyMuscle = [
    'C5',
    'C6',
    'C7',
    'C8',
    'T1',
    'L2',
    'L3',
    'L4',
    'L5',
    'S1',
    null,
  ];

  const randomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const setValue = (
    examData: ExamData,
    prefix: string,
    level: string,
    validValues: string[],
    validReasons: (string | null)[],
    validComments: (string | null)[],
  ) => {
    const value = randomElement(validValues);

    examData[`${prefix}${level}`] = value;
    examData[`${prefix}${level}ReasonImpairmentNotDueToSci`] = /\*$/.test(value)
      ? randomElement(validReasons)
      : null;
    examData[`${prefix}${level}ReasonImpairmentNotDueToSciSpecify`] =
      /\*$/.test(value) ? randomElement(validComments) : null;
  };

  const examData = {
    comments: randomElement(comments),
    deepAnalPressure: randomElement(binaryObservation),
    voluntaryAnalContraction: randomElement(binaryObservation),
    rightLowestNonKeyMuscleWithMotorFunction: randomElement(lowersNonKeyMuscle),
    leftLowestNonKeyMuscleWithMotorFunction: randomElement(lowersNonKeyMuscle),
    asiaImpairmentScale: Math.floor(Math.random() * 56).toString(),
    injuryComplete: Math.floor(Math.random() * 56).toString(),
    leftLightTouchTotal: Math.floor(Math.random() * 56).toString(),
    leftLowerMotorTotal: Math.floor(Math.random() * 56).toString(),
    leftMotor: Math.floor(Math.random() * 56).toString(),
    leftMotorTotal: Math.floor(Math.random() * 56).toString(),
    leftMotorZpp: Math.floor(Math.random() * 56).toString(),
    leftPinPrickTotal: Math.floor(Math.random() * 56).toString(),
    leftSensory: Math.floor(Math.random() * 56).toString(),
    leftSensoryZpp: Math.floor(Math.random() * 56).toString(),
    leftTouchTotal: Math.floor(Math.random() * 56).toString(),
    leftUpperMotorTotal: Math.floor(Math.random() * 56).toString(),
    lowerMotorTotal: Math.floor(Math.random() * 56).toString(),
    neurologicalLevelOfInjury: Math.floor(Math.random() * 56).toString(),
    pinPrickTotal: Math.floor(Math.random() * 56).toString(),
    rightLightTouchTotal: Math.floor(Math.random() * 56).toString(),
    rightLowerMotorTotal: Math.floor(Math.random() * 56).toString(),
    rightMotor: Math.floor(Math.random() * 56).toString(),
    rightMotorTotal: Math.floor(Math.random() * 56).toString(),
    rightMotorZpp: Math.floor(Math.random() * 56).toString(),
    rightPinPrickTotal: Math.floor(Math.random() * 56).toString(),
    rightSensory: Math.floor(Math.random() * 56).toString(),
    rightSensoryZpp: Math.floor(Math.random() * 56).toString(),
    rightTouchTotal: Math.floor(Math.random() * 56).toString(),
    rightUpperMotorTotal: Math.floor(Math.random() * 56).toString(),
    touchTotal: Math.floor(Math.random() * 56).toString(),
    upperMotorTotal: Math.floor(Math.random() * 56).toString(),
  };

  SensoryLevels.forEach((level) => {
    setValue(
      examData as ExamData,
      'rightLightTouch',
      level,
      sensoryValues,
      reasonsForImpairmentNotDueToSci,
      comments,
    );
    setValue(
      examData as ExamData,
      'rightPinPrick',
      level,
      sensoryValues,
      reasonsForImpairmentNotDueToSci,
      comments,
    );
    setValue(
      examData as ExamData,
      'leftLightTouch',
      level,
      sensoryValues,
      reasonsForImpairmentNotDueToSci,
      comments,
    );
    setValue(
      examData as ExamData,
      'leftPinPrick',
      level,
      sensoryValues,
      reasonsForImpairmentNotDueToSci,
      comments,
    );

    if (MotorLevels.includes(level as MotorLevel)) {
      setValue(
        examData as ExamData,
        'rightMotor',
        level,
        motorValues,
        reasonsForImpairmentNotDueToSci,
        comments,
      );
      setValue(
        examData as ExamData,
        'leftMotor',
        level,
        motorValues,
        reasonsForImpairmentNotDueToSci,
        comments,
      );
    }
  });

  return examData;
};
