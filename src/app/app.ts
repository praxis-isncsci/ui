import {Exam} from 'isncsci';

import {IAppState, IIsncsciAppStoreProvider, StatusCodes} from '@core/boundaries';
import {
  initializeAppUseCase,
  setExamFromExternalSourceUseCase,
} from '@core/useCases';

import {IDataStore} from '@app/store';
import {ExternalMessagePortProvider, ExternalMessagePortProviderActions} from '@app/providers';
import {InputLayoutController} from '@app/controllers/inputLayout.controller';

export class App {
  private externalMessagePortProvider = new ExternalMessagePortProvider();
  private unsubscribeFromStoreHandler: Function | null = null;
  private unsubscribeFromExternalChannelHandler: Function | null = null;
  private ready = false;

  public constructor(private appStore: IDataStore<IAppState>, private appStoreProvider: IIsncsciAppStoreProvider) {
    this.unsubscribeFromStoreHandler = appStore.subscribe((state: IAppState, actionType: string) => this.stateChanged(state, actionType));
    this.unsubscribeFromExternalChannelHandler =
      this.externalMessagePortProvider.subscribe((action: string, exam: Exam | null) => this.externalMessagePortProvider_onAction(action, exam));

    window.addEventListener('load', () => this.window_onLoad());
  }

  public disconnect(): void {
    if (this.unsubscribeFromStoreHandler) {
      this.unsubscribeFromStoreHandler();
    }

    if (this.unsubscribeFromExternalChannelHandler) {
      this.unsubscribeFromExternalChannelHandler();
    }
  }

  public loadExam() {
    console.log('loadExam');
  }

  private window_onLoad() {
    const inputLayout = document.querySelector('praxis-isncsci-input-layout');
    
    if (!inputLayout || !inputLayout.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    new InputLayoutController(this.appStore, inputLayout as HTMLElement);

    initializeAppUseCase(this.appStoreProvider);
  };

  private externalMessagePortProvider_onAction(actionType: string, exam: Exam | null) {
    switch(actionType) {
      case ExternalMessagePortProviderActions.ON_EXTERNAL_PORT:
        console.log('An external message port has been registered');
        break;
      case ExternalMessagePortProviderActions.ON_EXAM_DATA:
        console.log('An exam has been received from the external message port', exam);
        setExamFromExternalSourceUseCase(this.appStoreProvider, exam as Exam);
        break;
    }
  }

  private stateChanged(state: IAppState, actionType: string): void {
    if (!this.ready && state.status === StatusCodes.Ready) {
      console.log(`The application has been initialized and is ready`);
      this.ready = true;
    }
  }
}
