import {IAppState} from '@core/boundaries';
import {Exam} from 'isncsci';
import {IActionWithPayload} from './';

export class Actions {
  public static SET_CURRENT_EXAM: string = 'SET_CURRENT_EXAM';
  public static UPDATE_STATUS: string = 'UPDATE_STATUS';
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
  status,
};

export default [
  currentExam,
  status,
];
