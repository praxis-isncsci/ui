import {IAppState, StatusCodes} from '@core/boundaries';
import {
  setExamFromExternalSourceUseCase,
} from '@core/useCases';
import {AppStoreProvider} from './providers';
import {appStore} from './store';
import {ExternalMessagePortProvider, ExternalMessagePortProviderActions} from './providers';
import {Exam} from 'isncsci';

export class App {
  private externalMessagePortProvider = new ExternalMessagePortProvider();
  private unsubscribeFromStoreHandler: Function | null = null;
  private unsubscribeFromExternalChannelHandler: Function | null = null;
  private ready = false;
  private appStoreProvider = new AppStoreProvider();

  public constructor() {
    this.unsubscribeFromStoreHandler = appStore.subscribe((state: IAppState, actionType: string) => this.stateChanged(state, actionType));
    this.unsubscribeFromExternalChannelHandler =
      this.externalMessagePortProvider.subscribe((action: string, exam: Exam | null) => this.externalMessagePortProvider_onAction(action, exam));
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
