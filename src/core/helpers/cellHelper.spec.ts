import {describe, expect, it} from '@jest/globals';
import {Cell} from '@core/domain';
import {cellsMatch} from './cellHelper';

describe('cellHelper', () => {
  describe('cellsMatch', () => {
    it('should return true if all properties match', () => {
      const a: Cell = {
        label: 'NT',
        name: 'C2',
        value: 'NT',
        error: undefined,
        considerNormal: undefined,
        reasonImpairmentNotDueToSci: undefined,
        reasonImpairmentNotDueToSciSpecify: undefined,
      };

      const b: Cell = {
        label: 'NT',
        name: 'C2',
        value: 'NT',
        error: undefined,
        considerNormal: undefined,
        reasonImpairmentNotDueToSci: undefined,
        reasonImpairmentNotDueToSciSpecify: undefined,
      };

      expect(cellsMatch(a, b)).toBe(true);
    });

    it('should return false if value does not match', () => {
      const a: Cell = {
        label: 'NT',
        name: 'C2',
        value: 'NT',
        error: undefined,
        considerNormal: undefined,
        reasonImpairmentNotDueToSci: undefined,
        reasonImpairmentNotDueToSciSpecify: undefined,
      };

      const b: Cell = {
        label: 'NT*',
        name: 'C2',
        value: 'NT*',
        error: undefined,
        considerNormal: undefined,
        reasonImpairmentNotDueToSci: undefined,
        reasonImpairmentNotDueToSciSpecify: undefined,
      };

      expect(cellsMatch(a, b)).toBe(false);
    });

    it('should return false if error does not match', () => {
      const a: Cell = {
        label: 'NT',
        name: 'C2',
        value: 'NT',
        error: undefined,
        considerNormal: undefined,
        reasonImpairmentNotDueToSci: undefined,
        reasonImpairmentNotDueToSciSpecify: undefined,
      };
      const b: Cell = {
        label: 'NT',
        name: 'C2',
        value: 'NT',
        error: '',
        considerNormal: undefined,
        reasonImpairmentNotDueToSci: undefined,
        reasonImpairmentNotDueToSciSpecify: undefined,
      };

      expect(cellsMatch(a, b)).toBe(false);
    });
  });
});
