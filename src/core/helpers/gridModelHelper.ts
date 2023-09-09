import {Cell, MotorLevels, SensoryLevels} from '@core/domain';

const getCell = (name: string): Cell => {
  const cell: Cell = {
    value: '',
    label: '',
    reasonImpairmentNotDueToSci: undefined,
    reasonImpairmentNotDueToSciSpecify: undefined,
    name,
  };

  return cell;
};

const getMotorRow = (level: string): Array<Cell | null> => {
  const row: Array<Cell | null> = [
    getCell(`right-motor-${level}`),
    getCell(`right-light-touch-${level}`),
    getCell(`right-pin-prick-${level}`),
    getCell(`left-light-touch-${level}`),
    getCell(`left-pin-prick-${level}`),
    getCell(`left-motor-${level}`),
  ];
  
  return row;
};

const getSensoryRow = (level: string): Array<Cell | null> => {
  const row: Array<Cell | null> = [
    null,
    getCell(`right-light-touch-${level}`),
    getCell(`right-pin-prick-${level}`),
    getCell(`left-light-touch-${level}`),
    getCell(`left-pin-prick-${level}`),
    null,
  ];

  return row;
};

export const getGridModel = (): Array<Cell | null>[] => {
  const gridModel: Array<Cell | null>[] = [];

  SensoryLevels.forEach(level => {
    gridModel.push(
      MotorLevels.includes(level)
        ? getMotorRow(level)
        : getSensoryRow(level)
    );
  });

  return gridModel;
};
