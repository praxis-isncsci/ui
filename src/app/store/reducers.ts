import {IAppState} from '@core/boundaries';
import {Exam} from 'isncsci';
import {IActionWithPayload} from './';

export class Actions {
  public static SET_CURRENT_EXAM = 'SET_CURRENT_EXAM';
  public static UPDATE_STATUS = 'UPDATE_STATUS';
  public static SET_GRID_MODEL = 'SET_GRID_MODEL';
}

const currentExam = (state: IAppState, action: IActionWithPayload<{exam: Exam}>): IAppState => {
  if (action.type !== Actions.SET_CURRENT_EXAM) {
      return state;
  }

  return Object.assign(
    {},
    state,
    {
      currentExam: action.payload.exam,
    }
  );
};

const gridModel = (state: IAppState, action: IActionWithPayload<Array<any>>): IAppState => {
  switch(action.type) {
    case Actions.SET_GRID_MODEL:
      return Object.assign(
        {},
        state,
        {gridModel: action.payload}
      );
    default:
      return state;
  }
};

const status = (state: IAppState, action: IActionWithPayload<number>): IAppState => {
  switch(action.type) {
    case Actions.UPDATE_STATUS:
      return Object.assign(
        {},
        state,
        {status: action.payload}
      );
    default:
      return state;
  }
};

export {
  currentExam,
  gridModel,
  status,
};

export default [
  currentExam,
  gridModel,
  status,
];
