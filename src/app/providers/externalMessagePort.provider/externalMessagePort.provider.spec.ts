import {describe, expect, it, jest} from '@jest/globals';
import {
  ExternalMessagePortProvider,
  ExternalMessagePortProviderActions,
} from './externalMessagePort.provider';
import {ExamData} from '@core/domain';
import {getEmptyExamData} from '@core/helpers';

describe('ExternalMessagePortProvider', () => {
  it('should initialize the port', async () => {
    let windowEventHandler: (event) => void = () => {};
    const handler = jest.fn();
    const port = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
    };

    const window = {
      addEventListener: (_, handler) => (windowEventHandler = handler),
    };

    const externalMessagePortProvider = new ExternalMessagePortProvider(
      window as Window,
    );
    externalMessagePortProvider.subscribeToOnExternalPort(handler);

    windowEventHandler.call(
      ExternalMessagePortProviderActions.INITIALIZE_PORT,
      {
        data: {
          action: ExternalMessagePortProviderActions.INITIALIZE_PORT,
        },
        ports: [port],
      },
    );

    expect(handler).toHaveBeenCalled();
  });

  it('should send out exam data when `sendOutExamData` is called', () => {
    const examData: ExamData = getEmptyExamData();
    let windowEventHandler: (event) => void = () => {};
    const port = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
    };

    const window = {
      addEventListener: (_, handler) => (windowEventHandler = handler),
    };

    const externalMessagePortProvider = new ExternalMessagePortProvider(
      window as Window,
    );

    windowEventHandler.call(
      ExternalMessagePortProviderActions.INITIALIZE_PORT,
      {
        data: {
          action: ExternalMessagePortProviderActions.INITIALIZE_PORT,
        },
        ports: [port],
      },
    );

    port.postMessage = jest.fn();

    externalMessagePortProvider.sendOutExamData(examData);

    expect(port.postMessage).toHaveBeenCalledWith(examData);
  });

  it('Updates event listeners when `SET_EXAM_DATA` event is received', () => {
    const handler = jest.fn();
    const examData = getEmptyExamData();
    const port = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
    };
    let windowEventHandler: (event) => void = () => {};

    const window = {
      addEventListener: (_, handler) => (windowEventHandler = handler),
    };

    const externalMessagePortProvider = new ExternalMessagePortProvider(
      window as Window,
    );

    externalMessagePortProvider.subscribeToOnExamData(handler);

    windowEventHandler.call(
      ExternalMessagePortProviderActions.INITIALIZE_PORT,
      {
        data: {
          action: ExternalMessagePortProviderActions.INITIALIZE_PORT,
        },
        ports: [port],
      },
    );

    port.onmessage({
      data: {
        action: ExternalMessagePortProviderActions.SET_EXAM_DATA,
        examData,
      },
    });

    expect(handler).toHaveBeenCalledWith(examData);
  });

  it('triggers the classification when `CLASSIFY` is passed as action', () => {
    const handler = jest.fn();
    const port = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
    };
    let windowEventHandler: (event) => void = () => {};

    const window = {
      addEventListener: (_, handler) => (windowEventHandler = handler),
    };

    const externalMessagePortProvider = new ExternalMessagePortProvider(
      window as Window,
    );

    externalMessagePortProvider.subscribeToOnClassify(handler);

    windowEventHandler.call(
      ExternalMessagePortProviderActions.INITIALIZE_PORT,
      {
        data: {
          action: ExternalMessagePortProviderActions.INITIALIZE_PORT,
        },
        ports: [port],
      },
    );

    port.onmessage({
      data: {
        action: ExternalMessagePortProviderActions.CLASSIFY,
      },
    });

    expect(handler).toHaveBeenCalled();
  });

  it('triggers the clear exam action when `CLEAR_EXAM` is passed as action', () => {
    const handler = jest.fn();
    const port = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
    };
    let windowEventHandler: (event) => void = () => {};

    const window = {
      addEventListener: (_, handler) => (windowEventHandler = handler),
    };

    const externalMessagePortProvider = new ExternalMessagePortProvider(
      window as Window,
    );

    externalMessagePortProvider.subscribeToOnClearExam(handler);

    windowEventHandler.call(
      ExternalMessagePortProviderActions.INITIALIZE_PORT,
      {
        data: {
          action: ExternalMessagePortProviderActions.INITIALIZE_PORT,
        },
        ports: [port],
      },
    );

    port.onmessage({
      data: {
        action: ExternalMessagePortProviderActions.CLEAR_EXAM,
      },
    });

    expect(handler).toHaveBeenCalled();
  });

  it('Throws an exception when `SET_EXAM_DATA` event is received but the event has no exam data', () => {
    const handler = jest.fn();
    const port = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
    };
    let windowEventHandler: (event) => void = () => {};

    const window = {
      addEventListener: (_, handler) => (windowEventHandler = handler),
    };

    const externalMessagePortProvider = new ExternalMessagePortProvider(
      window as Window,
    );

    externalMessagePortProvider.subscribeToOnExamData(handler);

    windowEventHandler.call(
      ExternalMessagePortProviderActions.INITIALIZE_PORT,
      {
        data: {
          action: ExternalMessagePortProviderActions.INITIALIZE_PORT,
        },
        ports: [port],
      },
    );

    expect(() => {
      port.onmessage({
        data: {
          action: ExternalMessagePortProviderActions.SET_EXAM_DATA,
        },
      });
    }).toThrowError('Exam data is required.');
  });
});
