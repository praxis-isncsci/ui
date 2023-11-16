export type SensoryLevel =
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'C7'
  | 'C8'
  | 'T1'
  | 'T2'
  | 'T3'
  | 'T4'
  | 'T5'
  | 'T6'
  | 'T7'
  | 'T8'
  | 'T9'
  | 'T10'
  | 'T11'
  | 'T12'
  | 'L1'
  | 'L2'
  | 'L3'
  | 'L4'
  | 'L5'
  | 'S1'
  | 'S2'
  | 'S3'
  | 'S4_5';

export const SensoryLevels: SensoryLevel[] = [
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'C7',
  'C8',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
  'L1',
  'L2',
  'L3',
  'L4',
  'L5',
  'S1',
  'S2',
  'S3',
  'S4_5',
];

export type SensoryPointValue =
  | '0'
  | '1'
  | '2'
  | '0*'
  | '1*'
  | '0**'
  | '1**'
  | 'NT'
  | 'NT*'
  | 'NT**';

export const MotorLevels: MotorLevel[] = [
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
];

export type MotorLevel =
  | 'C5'
  | 'C6'
  | 'C7'
  | 'C8'
  | 'T1'
  | 'L2'
  | 'L3'
  | 'L4'
  | 'L5'
  | 'S1';

export type MotorMuscleValue =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '0*'
  | '1*'
  | '2*'
  | '3*'
  | '4*'
  | '0**'
  | '1**'
  | '2**'
  | '3**'
  | '4**'
  | 'NT'
  | 'NT*'
  | 'NT**';

export const ValidSensoryValues: SensoryPointValue[] = [
  '0',
  '1',
  '2',
  '0*',
  '1*',
  '0**',
  '1**',
  'NT',
  'NT*',
  'NT**',
];

export const ValidMotorValues: MotorMuscleValue[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '0*',
  '1*',
  '2*',
  '3*',
  '4*',
  '0**',
  '1**',
  '2**',
  '3**',
  '4**',
  'NT',
  'NT*',
  'NT**',
];
