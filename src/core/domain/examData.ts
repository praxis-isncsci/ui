import {BinaryObservation} from './binaryObservation';
import {MotorLevel} from './isncsciLevels';

export type ExamData = {
  comments: string | null;
  cellComments?: string | null;
  deepAnalPressure: BinaryObservation | null;
  voluntaryAnalContraction: BinaryObservation | null;
  rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null;
  leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null;
  isComplete: boolean;
  errors: string[];
  missingValues: string[];

  /* Right Sensory */
  rightLightTouchC2: string;
  rightLightTouchC2ConsiderNormal: boolean | null;
  rightLightTouchC2ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchC3: string;
  rightLightTouchC3ConsiderNormal: boolean | null;
  rightLightTouchC3ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchC4: string;
  rightLightTouchC4ConsiderNormal: boolean | null;
  rightLightTouchC4ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchC5: string;
  rightLightTouchC5ConsiderNormal: boolean | null;
  rightLightTouchC5ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchC6: string;
  rightLightTouchC6ConsiderNormal: boolean | null;
  rightLightTouchC6ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC6ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchC7: string;
  rightLightTouchC7ConsiderNormal: boolean | null;
  rightLightTouchC7ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC7ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchC8: string;
  rightLightTouchC8ConsiderNormal: boolean | null;
  rightLightTouchC8ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchC8ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT1: string;
  rightLightTouchT1ConsiderNormal: boolean | null;
  rightLightTouchT1ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT2: string;
  rightLightTouchT2ConsiderNormal: boolean | null;
  rightLightTouchT2ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT3: string;
  rightLightTouchT3ConsiderNormal: boolean | null;
  rightLightTouchT3ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT4: string;
  rightLightTouchT4ConsiderNormal: boolean | null;
  rightLightTouchT4ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT5: string;
  rightLightTouchT5ConsiderNormal: boolean | null;
  rightLightTouchT5ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT6: string;
  rightLightTouchT6ConsiderNormal: boolean | null;
  rightLightTouchT6ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT6ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT7: string;
  rightLightTouchT7ConsiderNormal: boolean | null;
  rightLightTouchT7ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT7ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT8: string;
  rightLightTouchT8ConsiderNormal: boolean | null;
  rightLightTouchT8ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT8ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT9: string;
  rightLightTouchT9ConsiderNormal: boolean | null;
  rightLightTouchT9ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT9ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT10: string;
  rightLightTouchT10ConsiderNormal: boolean | null;
  rightLightTouchT10ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT10ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT11: string;
  rightLightTouchT11ConsiderNormal: boolean | null;
  rightLightTouchT11ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT11ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchT12: string;
  rightLightTouchT12ConsiderNormal: boolean | null;
  rightLightTouchT12ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchT12ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchL1: string;
  rightLightTouchL1ConsiderNormal: boolean | null;
  rightLightTouchL1ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchL1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchL2: string;
  rightLightTouchL2ConsiderNormal: boolean | null;
  rightLightTouchL2ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchL2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchL3: string;
  rightLightTouchL3ConsiderNormal: boolean | null;
  rightLightTouchL3ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchL3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchL4: string;
  rightLightTouchL4ConsiderNormal: boolean | null;
  rightLightTouchL4ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchL4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchL5: string;
  rightLightTouchL5ConsiderNormal: boolean | null;
  rightLightTouchL5ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchL5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchS1: string;
  rightLightTouchS1ConsiderNormal: boolean | null;
  rightLightTouchS1ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchS1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchS2: string;
  rightLightTouchS2ConsiderNormal: boolean | null;
  rightLightTouchS2ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchS2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchS3: string;
  rightLightTouchS3ConsiderNormal: boolean | null;
  rightLightTouchS3ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchS3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightLightTouchS4_5: string;
  rightLightTouchS4_5ConsiderNormal: boolean | null;
  rightLightTouchS4_5ReasonImpairmentNotDueToSci: string | null;
  rightLightTouchS4_5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC2: string;
  rightPinPrickC2ConsiderNormal: boolean | null;
  rightPinPrickC2ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC3: string;
  rightPinPrickC3ConsiderNormal: boolean | null;
  rightPinPrickC3ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC4: string;
  rightPinPrickC4ConsiderNormal: boolean | null;
  rightPinPrickC4ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC5: string;
  rightPinPrickC5ConsiderNormal: boolean | null;
  rightPinPrickC5ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC6: string;
  rightPinPrickC6ConsiderNormal: boolean | null;
  rightPinPrickC6ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC6ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC7: string;
  rightPinPrickC7ConsiderNormal: boolean | null;
  rightPinPrickC7ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC7ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickC8: string;
  rightPinPrickC8ConsiderNormal: boolean | null;
  rightPinPrickC8ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickC8ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT1: string;
  rightPinPrickT1ConsiderNormal: boolean | null;
  rightPinPrickT1ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT2: string;
  rightPinPrickT2ConsiderNormal: boolean | null;
  rightPinPrickT2ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT3: string;
  rightPinPrickT3ConsiderNormal: boolean | null;
  rightPinPrickT3ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT4: string;
  rightPinPrickT4ConsiderNormal: boolean | null;
  rightPinPrickT4ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT5: string;
  rightPinPrickT5ConsiderNormal: boolean | null;
  rightPinPrickT5ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT6: string;
  rightPinPrickT6ConsiderNormal: boolean | null;
  rightPinPrickT6ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT6ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT7: string;
  rightPinPrickT7ConsiderNormal: boolean | null;
  rightPinPrickT7ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT7ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT8: string;
  rightPinPrickT8ConsiderNormal: boolean | null;
  rightPinPrickT8ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT8ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT9: string;
  rightPinPrickT9ConsiderNormal: boolean | null;
  rightPinPrickT9ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT9ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT10: string;
  rightPinPrickT10ConsiderNormal: boolean | null;
  rightPinPrickT10ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT10ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT11: string;
  rightPinPrickT11ConsiderNormal: boolean | null;
  rightPinPrickT11ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT11ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickT12: string;
  rightPinPrickT12ConsiderNormal: boolean | null;
  rightPinPrickT12ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickT12ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickL1: string;
  rightPinPrickL1ConsiderNormal: boolean | null;
  rightPinPrickL1ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickL1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickL2: string;
  rightPinPrickL2ConsiderNormal: boolean | null;
  rightPinPrickL2ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickL2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickL3: string;
  rightPinPrickL3ConsiderNormal: boolean | null;
  rightPinPrickL3ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickL3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickL4: string;
  rightPinPrickL4ConsiderNormal: boolean | null;
  rightPinPrickL4ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickL4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickL5: string;
  rightPinPrickL5ConsiderNormal: boolean | null;
  rightPinPrickL5ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickL5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickS1: string;
  rightPinPrickS1ConsiderNormal: boolean | null;
  rightPinPrickS1ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickS1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickS2: string;
  rightPinPrickS2ConsiderNormal: boolean | null;
  rightPinPrickS2ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickS2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickS3: string;
  rightPinPrickS3ConsiderNormal: boolean | null;
  rightPinPrickS3ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickS3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightPinPrickS4_5: string;
  rightPinPrickS4_5ConsiderNormal: boolean | null;
  rightPinPrickS4_5ReasonImpairmentNotDueToSci: string | null;
  rightPinPrickS4_5ReasonImpairmentNotDueToSciSpecify: string | null;

  /* Left Sensory */
  leftLightTouchC2: string;
  leftLightTouchC2ConsiderNormal: boolean | null;
  leftLightTouchC2ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchC3: string;
  leftLightTouchC3ConsiderNormal: boolean | null;
  leftLightTouchC3ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchC4: string;
  leftLightTouchC4ConsiderNormal: boolean | null;
  leftLightTouchC4ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchC5: string;
  leftLightTouchC5ConsiderNormal: boolean | null;
  leftLightTouchC5ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchC6: string;
  leftLightTouchC6ConsiderNormal: boolean | null;
  leftLightTouchC6ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC6ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchC7: string;
  leftLightTouchC7ConsiderNormal: boolean | null;
  leftLightTouchC7ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC7ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchC8: string;
  leftLightTouchC8ConsiderNormal: boolean | null;
  leftLightTouchC8ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchC8ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT1: string;
  leftLightTouchT1ConsiderNormal: boolean | null;
  leftLightTouchT1ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT2: string;
  leftLightTouchT2ConsiderNormal: boolean | null;
  leftLightTouchT2ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT3: string;
  leftLightTouchT3ConsiderNormal: boolean | null;
  leftLightTouchT3ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT4: string;
  leftLightTouchT4ConsiderNormal: boolean | null;
  leftLightTouchT4ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT5: string;
  leftLightTouchT5ConsiderNormal: boolean | null;
  leftLightTouchT5ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT6: string;
  leftLightTouchT6ConsiderNormal: boolean | null;
  leftLightTouchT6ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT6ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT7: string;
  leftLightTouchT7ConsiderNormal: boolean | null;
  leftLightTouchT7ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT7ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT8: string;
  leftLightTouchT8ConsiderNormal: boolean | null;
  leftLightTouchT8ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT8ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT9: string;
  leftLightTouchT9ConsiderNormal: boolean | null;
  leftLightTouchT9ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT9ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT10: string;
  leftLightTouchT10ConsiderNormal: boolean | null;
  leftLightTouchT10ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT10ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT11: string;
  leftLightTouchT11ConsiderNormal: boolean | null;
  leftLightTouchT11ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT11ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchT12: string;
  leftLightTouchT12ConsiderNormal: boolean | null;
  leftLightTouchT12ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchT12ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchL1: string;
  leftLightTouchL1ConsiderNormal: boolean | null;
  leftLightTouchL1ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchL1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchL2: string;
  leftLightTouchL2ConsiderNormal: boolean | null;
  leftLightTouchL2ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchL2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchL3: string;
  leftLightTouchL3ConsiderNormal: boolean | null;
  leftLightTouchL3ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchL3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchL4: string;
  leftLightTouchL4ConsiderNormal: boolean | null;
  leftLightTouchL4ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchL4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchL5: string;
  leftLightTouchL5ConsiderNormal: boolean | null;
  leftLightTouchL5ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchL5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchS1: string;
  leftLightTouchS1ConsiderNormal: boolean | null;
  leftLightTouchS1ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchS1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchS2: string;
  leftLightTouchS2ConsiderNormal: boolean | null;
  leftLightTouchS2ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchS2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchS3: string;
  leftLightTouchS3ConsiderNormal: boolean | null;
  leftLightTouchS3ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchS3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftLightTouchS4_5: string;
  leftLightTouchS4_5ConsiderNormal: boolean | null;
  leftLightTouchS4_5ReasonImpairmentNotDueToSci: string | null;
  leftLightTouchS4_5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC2: string;
  leftPinPrickC2ConsiderNormal: boolean | null;
  leftPinPrickC2ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC3: string;
  leftPinPrickC3ConsiderNormal: boolean | null;
  leftPinPrickC3ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC4: string;
  leftPinPrickC4ConsiderNormal: boolean | null;
  leftPinPrickC4ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC5: string;
  leftPinPrickC5ConsiderNormal: boolean | null;
  leftPinPrickC5ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC6: string;
  leftPinPrickC6ConsiderNormal: boolean | null;
  leftPinPrickC6ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC6ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC7: string;
  leftPinPrickC7ConsiderNormal: boolean | null;
  leftPinPrickC7ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC7ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickC8: string;
  leftPinPrickC8ConsiderNormal: boolean | null;
  leftPinPrickC8ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickC8ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT1: string;
  leftPinPrickT1ConsiderNormal: boolean | null;
  leftPinPrickT1ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT2: string;
  leftPinPrickT2ConsiderNormal: boolean | null;
  leftPinPrickT2ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT3: string;
  leftPinPrickT3ConsiderNormal: boolean | null;
  leftPinPrickT3ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT4: string;
  leftPinPrickT4ConsiderNormal: boolean | null;
  leftPinPrickT4ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT5: string;
  leftPinPrickT5ConsiderNormal: boolean | null;
  leftPinPrickT5ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT6: string;
  leftPinPrickT6ConsiderNormal: boolean | null;
  leftPinPrickT6ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT6ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT7: string;
  leftPinPrickT7ConsiderNormal: boolean | null;
  leftPinPrickT7ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT7ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT8: string;
  leftPinPrickT8ConsiderNormal: boolean | null;
  leftPinPrickT8ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT8ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT9: string;
  leftPinPrickT9ConsiderNormal: boolean | null;
  leftPinPrickT9ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT9ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT10: string;
  leftPinPrickT10ConsiderNormal: boolean | null;
  leftPinPrickT10ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT10ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT11: string;
  leftPinPrickT11ConsiderNormal: boolean | null;
  leftPinPrickT11ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT11ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickT12: string;
  leftPinPrickT12ConsiderNormal: boolean | null;
  leftPinPrickT12ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickT12ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickL1: string;
  leftPinPrickL1ConsiderNormal: boolean | null;
  leftPinPrickL1ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickL1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickL2: string;
  leftPinPrickL2ConsiderNormal: boolean | null;
  leftPinPrickL2ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickL2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickL3: string;
  leftPinPrickL3ConsiderNormal: boolean | null;
  leftPinPrickL3ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickL3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickL4: string;
  leftPinPrickL4ConsiderNormal: boolean | null;
  leftPinPrickL4ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickL4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickL5: string;
  leftPinPrickL5ConsiderNormal: boolean | null;
  leftPinPrickL5ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickL5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickS1: string;
  leftPinPrickS1ConsiderNormal: boolean | null;
  leftPinPrickS1ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickS1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickS2: string;
  leftPinPrickS2ConsiderNormal: boolean | null;
  leftPinPrickS2ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickS2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickS3: string;
  leftPinPrickS3ConsiderNormal: boolean | null;
  leftPinPrickS3ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickS3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftPinPrickS4_5: string;
  leftPinPrickS4_5ConsiderNormal: boolean | null;
  leftPinPrickS4_5ReasonImpairmentNotDueToSci: string | null;
  leftPinPrickS4_5ReasonImpairmentNotDueToSciSpecify: string | null;

  /* Right Motor */
  rightMotorC5: string;
  rightMotorC5ConsiderNormal: boolean | null;
  rightMotorC5ReasonImpairmentNotDueToSci: string | null;
  rightMotorC5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorC6: string;
  rightMotorC6ConsiderNormal: boolean | null;
  rightMotorC6ReasonImpairmentNotDueToSci: string | null;
  rightMotorC6ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorC7: string;
  rightMotorC7ConsiderNormal: boolean | null;
  rightMotorC7ReasonImpairmentNotDueToSci: string | null;
  rightMotorC7ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorC8: string;
  rightMotorC8ConsiderNormal: boolean | null;
  rightMotorC8ReasonImpairmentNotDueToSci: string | null;
  rightMotorC8ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorT1: string;
  rightMotorT1ConsiderNormal: boolean | null;
  rightMotorT1ReasonImpairmentNotDueToSci: string | null;
  rightMotorT1ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorL2: string;
  rightMotorL2ConsiderNormal: boolean | null;
  rightMotorL2ReasonImpairmentNotDueToSci: string | null;
  rightMotorL2ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorL3: string;
  rightMotorL3ConsiderNormal: boolean | null;
  rightMotorL3ReasonImpairmentNotDueToSci: string | null;
  rightMotorL3ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorL4: string;
  rightMotorL4ConsiderNormal: boolean | null;
  rightMotorL4ReasonImpairmentNotDueToSci: string | null;
  rightMotorL4ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorL5: string;
  rightMotorL5ConsiderNormal: boolean | null;
  rightMotorL5ReasonImpairmentNotDueToSci: string | null;
  rightMotorL5ReasonImpairmentNotDueToSciSpecify: string | null;
  rightMotorS1: string;
  rightMotorS1ConsiderNormal: boolean | null;
  rightMotorS1ReasonImpairmentNotDueToSci: string | null;
  rightMotorS1ReasonImpairmentNotDueToSciSpecify: string | null;

  /* Left Motor */
  leftMotorC5: string;
  leftMotorC5ConsiderNormal: boolean | null;
  leftMotorC5ReasonImpairmentNotDueToSci: string | null;
  leftMotorC5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorC6: string;
  leftMotorC6ConsiderNormal: boolean | null;
  leftMotorC6ReasonImpairmentNotDueToSci: string | null;
  leftMotorC6ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorC7: string;
  leftMotorC7ConsiderNormal: boolean | null;
  leftMotorC7ReasonImpairmentNotDueToSci: string | null;
  leftMotorC7ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorC8: string;
  leftMotorC8ConsiderNormal: boolean | null;
  leftMotorC8ReasonImpairmentNotDueToSci: string | null;
  leftMotorC8ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorT1: string;
  leftMotorT1ConsiderNormal: boolean | null;
  leftMotorT1ReasonImpairmentNotDueToSci: string | null;
  leftMotorT1ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorL2: string;
  leftMotorL2ConsiderNormal: boolean | null;
  leftMotorL2ReasonImpairmentNotDueToSci: string | null;
  leftMotorL2ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorL3: string;
  leftMotorL3ConsiderNormal: boolean | null;
  leftMotorL3ReasonImpairmentNotDueToSci: string | null;
  leftMotorL3ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorL4: string;
  leftMotorL4ConsiderNormal: boolean | null;
  leftMotorL4ReasonImpairmentNotDueToSci: string | null;
  leftMotorL4ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorL5: string;
  leftMotorL5ConsiderNormal: boolean | null;
  leftMotorL5ReasonImpairmentNotDueToSci: string | null;
  leftMotorL5ReasonImpairmentNotDueToSciSpecify: string | null;
  leftMotorS1: string;
  leftMotorS1ConsiderNormal: boolean | null;
  leftMotorS1ReasonImpairmentNotDueToSci: string | null;
  leftMotorS1ReasonImpairmentNotDueToSciSpecify: string | null;

  /* Classification and totals */
  asiaImpairmentScale: string;
  injuryComplete: string;
  leftLightTouchTotal: string;
  leftLowerMotorTotal: string;
  leftMotor: string;
  leftMotorTotal: string;
  leftMotorZpp: string;
  leftPinPrickTotal: string;
  leftSensory: string;
  leftSensoryZpp: string;
  leftUpperMotorTotal: string;
  lightTouchTotal: string;
  lowerMotorTotal: string;
  neurologicalLevelOfInjury: string;
  pinPrickTotal: string;
  rightLightTouchTotal: string;
  rightLowerMotorTotal: string;
  rightMotor: string;
  rightMotorTotal: string;
  rightMotorZpp: string;
  rightPinPrickTotal: string;
  rightSensory: string;
  rightSensoryZpp: string;
  rightUpperMotorTotal: string;
  upperMotorTotal: string;
};