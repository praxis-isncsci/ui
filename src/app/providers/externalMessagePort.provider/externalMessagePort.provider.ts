import {IExternalMessageProvider} from '@core/boundaries';
import {ExamData} from '@core/domain';

export class ExternalMessagePortProviderActions {
  public static INITIALIZE_PORT = 'INITIALIZE_PORT';
  public static ON_EXAM_DATA = 'ON_EXAM_DATA';
  public static ON_EXTERNAL_PORT = 'ON_EXTERNAL_PORT';
  public static ON_READONLY = 'ON_READONLY';
  public static SET_EXAM_DATA = 'SET_EXAM_DATA';
  public static SET_READONLY = 'SET_READONLY';
}

export class ExternalMessagePortProvider implements IExternalMessageProvider {
  private handlers: Array<
    (actionType: string, examData: ExamData | null, readonly: boolean) => void
  > = [];
  private port: MessagePort | null = null;

  constructor() {
    // Listen for the initial port transfer message
    window.addEventListener('message', (e) => this.initPort(e));
  }

  private initPort(e: MessageEvent) {
    if (
      e.data.action &&
      e.data.action === ExternalMessagePortProviderActions.INITIALIZE_PORT
    ) {
      this.port = e.ports[0] ?? null;
      this.port.onmessage = (e: MessageEvent) =>
        this.onPortMessage(e.data.action, e.data.examData, e.data.readonly);
      this.dispatch({
        examData: null,
        readonly: false,
        type: ExternalMessagePortProviderActions.ON_EXTERNAL_PORT,
      });
    }
  }

  private onPortMessage(
    action: string,
    examData: ExamData | null,
    readonly: boolean,
  ) {
    if (action === ExternalMessagePortProviderActions.SET_EXAM_DATA) {
      this.dispatch({
        examData,
        type: ExternalMessagePortProviderActions.ON_EXAM_DATA,
        readonly,
      });
    }

    if (action === ExternalMessagePortProviderActions.SET_READONLY) {
      this.dispatch({
        examData,
        type: ExternalMessagePortProviderActions.ON_READONLY,
        readonly,
      });
    }
  }

  public sendOutExamData(examData: ExamData) {
    this.port?.postMessage(examData);
  }

  private dispatch(action: {
    type: string;
    examData: ExamData | null;
    readonly: boolean;
  }) {
    this.handlers.forEach((handler) =>
      handler(action.type, action.examData, action.readonly),
    );
  }

  /*
   * returns the unsubscribe function
   */
  public subscribe(
    handler: (
      action: string,
      examData: ExamData | null,
      readonly: boolean,
    ) => void,
  ) {
    this.handlers.push(handler);

    return () => {
      const index: number = this.handlers.findIndex(
        (value: Function) => value === handler,
      );
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }
}
