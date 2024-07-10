import { IExternalMessageProvider } from '@core/boundaries';
import { ExamData } from '@core/domain';

export class ExternalMessagePortProviderActions {
  public static INITIALIZE_PORT = 'INITIALIZE_PORT';
  public static SET_EXAM_DATA = 'SET_EXAM_DATA';
  public static SET_READONLY = 'SET_READONLY';
  public static SET_STYLE_ATTRIBUTE = 'SET_STYLE_ATTRIBUTE';
  public static CLASSIFY = 'CLASSIFY';
  public static CLEAR_EXAM = 'CLEAR_EXAM';
}

export class ExternalMessagePortProvider implements IExternalMessageProvider {
  private onExamDataHandlers: Array<(examData: ExamData) => void> = [];
  private onReadonlyHandlers: Array<(readonly: boolean) => void> = [];
  private onStyleAttributeHandlers: Array<
    (styleAttribute: string) => void
  > = [];
  private onClassifyHandlers: Array<() => void> = [];
  private onClearExamHandlers: Array<() => void> = [];
  private onExternalPortHandlers: Array<() => void> = [];

  private port: MessagePort | null = null;

  constructor(globalWindow: Window = window) {
    // Listen for the initial port transfer message
    globalWindow.addEventListener('message', (e) => this.initPort(e));
  }

  private initPort(e: MessageEvent) {
    if (
      e.data.action &&
      e.data.action === ExternalMessagePortProviderActions.INITIALIZE_PORT
    ) {
      this.port = e.ports[0];
      this.port.onmessage = (e: MessageEvent) => {
        this.validateMessageEvent(e);
        this.onPortMessage(
          e.data.action,
          e.data.readonly,
          e.data.examData,
          e.data.styleAttribute,
        );
      };
      this.dispatchOnExternalPort();
    }
  }

  private onPortMessage(
    action: string,
    readonly: boolean,
    examData: ExamData | null = null,
    styleAttribute: string = '',
  ) {
    if (action === ExternalMessagePortProviderActions.SET_EXAM_DATA) {
      if (!examData) {
        throw new Error('Exam data is required for SET_EXAM_DATA action.');
      }

      this.dispatchOnExamData(examData);
    }

    if (action === ExternalMessagePortProviderActions.SET_READONLY) {
      this.dispatchOnReadonly(readonly);
    }

    if (
      action === ExternalMessagePortProviderActions.SET_STYLE_ATTRIBUTE
    ) {
      this.dispatchOnStyleAttribute(styleAttribute);
    }

    if (action === ExternalMessagePortProviderActions.CLASSIFY) {
      this.dispatchOnClassify();
    }

    if (action === ExternalMessagePortProviderActions.CLEAR_EXAM) {
      this.dispatchOnClearExam();
    }
  }

  public sendOutExamData(examData: ExamData) {
    this.port?.postMessage(examData);
  }

  private dispatchOnExamData(examData: ExamData) {
    this.onExamDataHandlers.forEach((handler) => handler(examData));
  }

  private dispatchOnReadonly(readonly: boolean) {
    this.onReadonlyHandlers.forEach((handler) => handler(readonly));
  }

  private dispatchOnStyleAttribute(styleAttribute: string) {
    this.onStyleAttributeHandlers.forEach((handler) =>
      handler(styleAttribute),
    );
  }

  private dispatchOnClassify() {
    this.onClassifyHandlers.forEach((handler) => handler());
  }

  private dispatchOnClearExam() {
    this.onClearExamHandlers.forEach((handler) => handler());
  }

  private dispatchOnExternalPort() {
    this.onExternalPortHandlers.forEach((handler) => handler());
  }

  private subscribe(handler: Function, handlers: Array<Function>) {
    handlers.push(handler);

    return () => {
      const index: number = handlers.findIndex(
        (value: Function) => value === handler,
      );
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /*
   * returns the unsubscribe function
   */
  public subscribeToOnExamData(handler: (examData: ExamData | null) => void) {
    return this.subscribe(handler, this.onExamDataHandlers);
  }

  /*
   * returns the unsubscribe function
   */
  public subscribeToOnReadonly(handler: (readonly: boolean) => void) {
    return this.subscribe(handler, this.onReadonlyHandlers);
  }

  /*
   * returns the unsubscribe function
   */
  public subscribeToOnStyleAttribute(
    handler: (styleAttribute: string) => void,
  ) {
    return this.subscribe(handler, this.onStyleAttributeHandlers);
  }

  /*
   * returns the unsubscribe function
   */
  public subscribeToOnClassify(handler: () => void) {
    return this.subscribe(handler, this.onClassifyHandlers);
  }

  /*
   * returns the unsubscribe function
   */
  public subscribeToOnClearExam(handler: () => void) {
    return this.subscribe(handler, this.onClearExamHandlers);
  }

  /*
   * returns the unsubscribe function
   */
  public subscribeToOnExternalPort(handler: () => void) {
    return this.subscribe(handler, this.onExternalPortHandlers);
  }

  private validateMessageEvent(e: MessageEvent) {
    if (!e.data.action) {
      throw new Error('Action is required.');
    }

    if (typeof e.data.action !== 'string') {
      throw new Error('Action must be a string.');
    }

    if (e.data.action === ExternalMessagePortProviderActions.SET_EXAM_DATA) {
      if (!e.data.examData) {
        throw new Error('Exam data is required.');
      }
    }

    if (e.data.action === ExternalMessagePortProviderActions.SET_READONLY) {
      if (typeof e.data.readonly !== 'boolean') {
        throw new Error('Readonly must be a boolean.');
      }
    }

    if (
      e.data.action ===
      ExternalMessagePortProviderActions.SET_STYLE_ATTRIBUTE
    ) {
      if (typeof e.data.styleAttribute !== 'string') {
        throw new Error('Classification style must be a string.');
      }
    }
  }
}
