import {Cell} from '@core/domain';

export const cellsMatch = (a: Cell, b: Cell) => {
  return (
    a.value === b.value &&
    a.error === b.error &&
    a.reasonImpairmentNotDueToSci === b.reasonImpairmentNotDueToSci &&
    a.reasonImpairmentNotDueToSciSpecify ===
      b.reasonImpairmentNotDueToSciSpecify
  );
};
