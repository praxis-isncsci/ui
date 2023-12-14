import {
  IAppState,
  IIsncsciAppStoreProvider,
  IIsncsciExamProvider,
  StatusCodes,
} from '@core/boundaries';
import {
  calculateUseCase,
  initializeAppUseCase,
  loadExternalExamDataUseCase,
} from '@core/useCases';

import {IDataStore} from '@app/store';
import {
  ExternalMessagePortProvider,
  ExternalMessagePortProviderActions,
} from '@app/providers';
import {InputLayoutController} from '@app/controllers/inputLayout.controller';
import {getEmptyExamData} from '@core/helpers/examData.helper';
import {ExamData} from '@core/domain';

export class PraxisIsncsciWebApp extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-web-app';
  }

  private template() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }

        ::slotted(praxis-isncsci-app-layout) {
          height: 25rem;
          flex-grow: 1;
        }
      </style>
      <slot></slot>
    `;
  }

  private appLayout: HTMLElement | null = null;
  private classification: HTMLElement | null = null;
  private appStore: IDataStore<IAppState> | null = null;
  private appStoreProvider: IIsncsciAppStoreProvider | null = null;
  private externalMessagePortProvider = new ExternalMessagePortProvider();
  private isncsciExamProvider: IIsncsciExamProvider | null = null;
  private unsubscribeFromStoreHandler: Function | null = null;
  private unsubscribeFromExternalChannelHandler: Function | null = null;
  private ready = false;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }

  public initialize(
    appStore: IDataStore<IAppState>,
    appStoreProvider: IIsncsciAppStoreProvider,
    isncsciExamProvider: IIsncsciExamProvider,
  ) {
    this.appStore = appStore;
    this.appStoreProvider = appStoreProvider;
    this.isncsciExamProvider = isncsciExamProvider;

    this.unsubscribeFromStoreHandler = this.appStore.subscribe(
      (state: IAppState, actionType: string) =>
        this.stateChanged(state, actionType),
    );

    this.unsubscribeFromExternalChannelHandler =
      this.externalMessagePortProvider.subscribe(
        (action: string, examData: ExamData | null) =>
          this.externalMessagePortProvider_onAction(action, examData),
      );

    this.appLayout = document.querySelector('praxis-isncsci-app-layout');

    // Calculate button
    const calculate = document.querySelector('[action-calculate]');

    if (calculate) {
      calculate.addEventListener('click', () => this.calculate_onClick());
    }

    // Close classification dialog button
    const closeClassification = document.querySelector(
      '[action-close-classification]',
    );

    if (closeClassification) {
      closeClassification.addEventListener('click', () =>
        this.closeClassification_onClick(),
      );
    }

    // Input layout

    const inputLayout = document.querySelector('praxis-isncsci-input-layout');
    this.classification = document.querySelector(
      'praxis-isncsci-classification',
    );

    const inputButtons = document.querySelector('praxis-isncsci-input');

    if (!inputLayout || !this.classification || !inputButtons) {
      throw new Error('The views have not been initialized');
    }

    new InputLayoutController(
      this.appStore,
      this.appStoreProvider,
      inputLayout as HTMLElement,
      inputButtons as HTMLElement,
      this.classification as HTMLElement,
    );

    initializeAppUseCase(this.appStoreProvider);
  }

  public disconnectedCallback() {
    if (this.unsubscribeFromStoreHandler) {
      this.unsubscribeFromStoreHandler();
    }

    if (this.unsubscribeFromExternalChannelHandler) {
      this.unsubscribeFromExternalChannelHandler();
    }
  }

  private calculate_onClick() {
    if (!this.appLayout || !this.classification) {
      return;
    }

    if (
      !this.appStoreProvider ||
      !this.isncsciExamProvider ||
      !this.externalMessagePortProvider ||
      !this.appStore
    ) {
      throw new Error(
        'The application store provider, the exam provider, the external message port provider, or the app store have not been initialized',
      );
    }

    if (this.appLayout.getAttribute('classification-style') !== 'fixed') {
      this.appLayout.setAttribute('classification-style', 'visible');
      document.documentElement.style.setProperty(
        '--calc-classification-height',
        `${this.classification.clientHeight / 16}rem`,
      );
    }

    const state = this.appStore.getState();

    calculateUseCase(
      state.gridModel ?? [],
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      this.appStoreProvider,
      this.isncsciExamProvider,
      this.externalMessagePortProvider,
    );

    return false;
  }

  private closeClassification_onClick() {
    if (!this.appLayout) {
      return;
    }

    if (
      this.appLayout.hasAttribute('classification-style') &&
      this.appLayout.getAttribute('classification-style') !== 'fixed'
    ) {
      this.appLayout.removeAttribute('classification-style');
    }

    return false;
  }

  private externalMessagePortProvider_onAction(
    actionType: string,
    examData: ExamData | null,
  ) {
    if (!this.appStoreProvider) {
      throw new Error(
        'The application store provider has not been initialized',
      );
    }

    switch (actionType) {
      case ExternalMessagePortProviderActions.ON_EXTERNAL_PORT:
        console.log('An external message port has been registered');
        break;
      case ExternalMessagePortProviderActions.ON_EXAM_DATA:
        loadExternalExamDataUseCase(
          this.appStoreProvider,
          examData ?? getEmptyExamData(),
        );
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

customElements.define(PraxisIsncsciWebApp.is, PraxisIsncsciWebApp);
