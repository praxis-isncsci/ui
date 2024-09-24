import {IAppState, StatusCodes} from '@core/boundaries';
import {IDataStore} from './';
import * as Reducers from './reducers';

class AppStore implements IDataStore<IAppState> {
  private handlers: Function[] = [];
  private state: IAppState = {
    activeCell: null,
    calculationError: '',
    comments: '',
    cellComments: '',
    dap: null,
    gridModel: [],
    leftLowestNonKeyMuscleWithMotorFunction: null,
    readonly: false,
    rightLowestNonKeyMuscleWithMotorFunction: null,
    selectedCells: [],
    selectedPoint: null,
    status: StatusCodes.NotInitialized,
    totals: {
      asiaImpairmentScale: '',
      injuryComplete: '',
      leftLightTouchTotal: '',
      leftLowerMotorTotal: '',
      leftMotor: '',
      leftMotorTotal: '',
      leftMotorZpp: '',
      leftPinPrickTotal: '',
      leftSensory: '',
      leftSensoryZpp: '',
      leftUpperMotorTotal: '',
      lightTouchTotal: '',
      lowerMotorTotal: '',
      neurologicalLevelOfInjury: '',
      pinPrickTotal: '',
      rightLightTouchTotal: '',
      rightLowerMotorTotal: '',
      rightMotor: '',
      rightMotorTotal: '',
      rightMotorZpp: '',
      rightPinPrickTotal: '',
      rightSensory: '',
      rightSensoryZpp: '',
      rightUpperMotorTotal: '',
      upperMotorTotal: '',
    },
    updatedCells: [],
    vac: null,
  };

  public subscribe(handler: Function) {
    this.handlers.push(handler);

    return () => {
      // EE: The line below can remove the handler in just one line of code, however, it will iterate through the entire array.
      // The code after, however, will stop once it finds the handler to be removed from the subscriber's list.
      // this.handlers = this.handlers.filter((value: Function) => value != handler);

      const index: number = this.handlers.findIndex(
        (value: Function) => value === handler,
      );
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }

  public getState() {
    return this.state;
  }

  public dispatch(action) {
    Reducers.default.forEach((reducer: Function) => {
      this.state = reducer(this.state, action);
    });

    this.handlers.forEach((handler: Function) =>
      handler(this.state, action.type),
    );
  }
}

export const appStore = new AppStore();
