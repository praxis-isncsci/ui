import {MotorLevel, MotorLevels as ML, SensoryLevels as SL} from '@core/domain';

const SensoryLevels = SL.slice(0);
const MotorLevels = ML.slice(0);

export const getRandomExamData = () => {
  const motorValues = ['0', '1', '2', '3', '4', '5'];
  const sensoryValues = ['0', '1', '2'];
  const binaryObservation = ['Yes', 'No'];

  const randomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const examData = {
    deepAnalPressure: randomElement(binaryObservation),
    voluntaryAnalContraction: randomElement(binaryObservation),
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
    examData[`rightLightTouch${level}`] = randomElement(sensoryValues);
    examData[`rightPinPrick${level}`] = randomElement(sensoryValues);
    examData[`leftLightTouch${level}`] = randomElement(sensoryValues);
    examData[`leftPinPrick${level}`] = randomElement(sensoryValues);

    if (MotorLevels.includes(level as MotorLevel)) {
      examData[`rightMotor${level}`] = randomElement(motorValues);
      examData[`leftMotor${level}`] = randomElement(motorValues);
    }
  });

  return examData;
};
