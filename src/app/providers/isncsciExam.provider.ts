import {Exam, ISNCSCI} from 'isncsci';
import {IIsncsciExamProvider} from '@core/boundaries';
import {ExamData, MotorLevel, MotorLevels, SensoryLevels} from '@core/domain';

export class IsncsciExamProvider implements IIsncsciExamProvider {
  private bindExamDataToExam(examData: ExamData) {
    const exam = {
      deepAnalPressure: examData.deepAnalPressure,
      voluntaryAnalContraction: examData.voluntaryAnalContraction,
      right: {
        // lowestNonKeyMuscleWithMotorFunction: "C8",
        motor: {},
        lightTouch: {},
        pinPrick: {},
      },
      left: {
        motor: {},
        lightTouch: {},
        pinPrick: {},
      },
    };

    SensoryLevels.forEach((level) => {
      exam.right.lightTouch[level] = examData[`rightLightTouch${level}`];
      exam.right.pinPrick[level] = examData[`rightPinPrick${level}`];

      exam.left.lightTouch[level] = examData[`leftLightTouch${level}`];
      exam.left.pinPrick[level] = examData[`leftPinPrick${level}`];

      if (MotorLevels.includes(level as MotorLevel)) {
        exam.right.motor[level] = examData[`rightMotor${level}`];
        exam.left.motor[level] = examData[`leftMotor${level}`];
      }
    });

    return exam as Exam;
  }

  public calculate(examData: ExamData) {
    const exam = this.bindExamDataToExam(examData);
    const isncsci = new ISNCSCI(exam);
    const classification = isncsci.classification;
    const totals = isncsci.totals;

    return Promise.resolve({
      asiaImpairmentScale: classification.ASIAImpairmentScale,
      injuryComplete: classification.injuryComplete,
      leftLightTouchTotal: totals.left.lightTouch,
      leftLowerMotorTotal: totals.left.lowerExtremity,
      leftMotor: classification.neurologicalLevels.motorLeft,
      leftMotorTotal: totals.left.motor,
      leftMotorZpp: classification.zoneOfPartialPreservations.motorLeft,
      leftPinPrickTotal: totals.left.pinPrick,
      leftSensory: classification.neurologicalLevels.sensoryLeft,
      leftSensoryZpp: classification.zoneOfPartialPreservations.sensoryLeft,
      leftTouchTotal: totals.left.lightTouch,
      leftUpperMotorTotal: totals.left.upperExtremity,
      lowerMotorTotal: totals.lowerExtremity,
      neurologicalLevelOfInjury: classification.neurologicalLevelOfInjury,
      pinPrickTotal: totals.pinPrick,
      rightLightTouchTotal: totals.right.lightTouch,
      rightLowerMotorTotal: totals.right.lowerExtremity,
      rightMotor: classification.neurologicalLevels.motorRight,
      rightMotorTotal: totals.right.motor,
      rightMotorZpp: classification.zoneOfPartialPreservations.motorRight,
      rightPinPrickTotal: totals.right.pinPrick,
      rightSensory: classification.neurologicalLevels.sensoryRight,
      rightSensoryZpp: classification.zoneOfPartialPreservations.sensoryRight,
      rightTouchTotal: totals.right.lightTouch,
      rightUpperMotorTotal: totals.right.upperExtremity,
      touchTotal: totals.lightTouch,
      upperMotorTotal: totals.upperExtremity,
    });
  }
}
