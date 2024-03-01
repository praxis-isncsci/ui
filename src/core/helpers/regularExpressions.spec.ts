import {describe, expect, it} from '@jest/globals';
import {
  motorValueRegex,
  sensoryCellRegex,
  sensoryValueRegex,
} from './regularExpressions';
import {SensoryLevels} from '@core/domain';

describe('regularExpressions', () => {
  describe('sensoryCellRegex', () => {
    SensoryLevels.forEach((l) => {
      const level = l.toLowerCase();

      it(`should match right-light-touch-${level}, right-pin-prick-${level}, left-light-touch-${level}, and left-pin-prick-${level}`, () => {
        expect(
          sensoryCellRegex.test(`right-light-touch-${level}`),
        ).toBeTruthy();
        expect(sensoryCellRegex.test(`right-pin-prick-${level}`)).toBeTruthy();
        expect(sensoryCellRegex.test(`left-light-touch-${level}`)).toBeTruthy();
        expect(sensoryCellRegex.test(`left-pin-prick-${level}`)).toBeTruthy();
      });
    });
  });

  describe('motorValue', () => {
    [
      '0',
      '0*',
      '0**',
      '1',
      '1*',
      '1**',
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
      'UNK',
      'NT',
      'NT*',
      'NT**',
    ].forEach((v) => {
      it(`should match ${v}`, () => {
        expect(motorValueRegex.test(v)).toBeTruthy();
      });
    });

    ['0***', '6', '5*', 'a', 'b', '00', 'NT***'].forEach((v) => {
      it(`should not match ${v}`, () => {
        expect(motorValueRegex.test(v)).toBeFalsy();
      });
    });
  });

  describe('sensoryValue', () => {
    ['0', '0*', '0*', '1', '1*', '1*', '2', 'UNK', 'NT', 'NT*', 'NT**'].forEach(
      (v) => {
        it(`should match ${v}`, () => {
          expect(sensoryValueRegex.test(v)).toBeTruthy();
        });
      },
    );

    ['1***', '3', '3*', '4', '4*', '5', 'a', 'b', '00', 'NT***'].forEach(
      (v) => {
        it(`should not match ${v}`, () => {
          expect(sensoryValueRegex.test(v)).toBeFalsy();
        });
      },
    );
  });
});
