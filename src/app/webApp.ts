import {
  IAppState,
  IIsncsciAppStoreProvider,
  IIsncsciExamProvider,
  StatusCodes,
} from '@core/boundaries';
import {
  calculateUseCase,
  clearExamUseCase,
  initializeAppUseCase,
  loadExternalExamDataUseCase,
  setReadonlyUseCase,
} from '@core/useCases';

import { Actions, IDataStore } from '@app/store';
import {
  ExternalMessagePortProvider,
  ExternalMessagePortProviderActions,
} from '@app/providers';
import {
  InputLayoutController,
  KeyPointDiagramController,
} from '@app/controllers';
import { getEmptyExamData } from '@core/helpers';
import { ExamData } from '@core/domain';

export class PraxisIsncsciWebApp extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-web-app';
  }

  private template() {
    return `
      <style>
        :host {
          background: var(--light-app-surface);
          display: flex;
          flex-direction: column;
        }

        :host([static-height]) ::slotted(praxis-isncsci-app-layout) {
          height: auto;
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
  private unsubscribeFromExternalPortHandler: Function | null = null;
  private unsubscribeFromReadonlyHandler: Function | null = null;
  private unsubscribeFromExamDataHandler: Function | null = null;
  private unsubscribeFromClassificationStyleHandler: Function | null = null;
  private unsubscribeFromClassifyHandler: Function | null = null;
  private unsubscribeFromClearExamHandler: Function | null = null;
  private ready = false;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
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

    this.unsubscribeFromExternalPortHandler =
      this.externalMessagePortProvider.subscribeToOnExternalPort(() =>
        this.externalMessagePortProvider_onExternalPort(),
      );

    this.unsubscribeFromReadonlyHandler =
      this.externalMessagePortProvider.subscribeToOnReadonly(
        (readonly: boolean) =>
          this.externalMessagePortProvider_onReadonly(readonly),
      );

    this.unsubscribeFromExamDataHandler =
      this.externalMessagePortProvider.subscribeToOnExamData(
        (examData: ExamData | null) =>
          this.externalMessagePortProvider_onExamData(examData),
      );

    this.unsubscribeFromClassificationStyleHandler =
      this.externalMessagePortProvider.subscribeToOnStyleAttribute(
        (styleAttribute: string) =>
          this.externalMessagePortProvider_onStyleAttribute(
            styleAttribute,
          ),
      );

    this.unsubscribeFromClassifyHandler =
      this.externalMessagePortProvider.subscribeToOnClassify(() =>
        this.classify(),
      );

    this.unsubscribeFromClearExamHandler =
      this.externalMessagePortProvider.subscribeToOnClearExam(() =>
        this.clearExam(),
      );

    this.appLayout = document.querySelector('praxis-isncsci-app-layout');

    // Clear exam button
    const clearExam = document.querySelector('[action-clear-exam]');

    if (clearExam) {
      clearExam.addEventListener('click', () => this.clearExam_onClick());
    }

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
    const keyPointsDiagram = document.querySelector(
      'praxis-isncsci-key-points-diagram',
    );

    if (!inputLayout || !this.classification || !inputButtons) {
      throw new Error('The views have not been initialized');
    }

    new InputLayoutController(
      this.appStore,
      this.appStoreProvider,
      this.externalMessagePortProvider,
      inputLayout as HTMLElement,
      inputButtons as HTMLElement,
      this.classification as HTMLElement,
    );

    new KeyPointDiagramController(
      this.appStore,
      keyPointsDiagram as HTMLElement,
    );

    initializeAppUseCase(this.appStoreProvider);
  }

  public disconnectedCallback() {
    if (this.unsubscribeFromStoreHandler) {
      this.unsubscribeFromStoreHandler();
    }

    if (this.unsubscribeFromClassificationStyleHandler) {
      this.unsubscribeFromClassificationStyleHandler();
    }

    if (this.unsubscribeFromExamDataHandler) {
      this.unsubscribeFromExamDataHandler();
    }

    if (this.unsubscribeFromExternalPortHandler) {
      this.unsubscribeFromExternalPortHandler();
    }

    if (this.unsubscribeFromReadonlyHandler) {
      this.unsubscribeFromReadonlyHandler();
    }

    if (this.unsubscribeFromClassifyHandler) {
      this.unsubscribeFromClassifyHandler();
    }

    if (this.unsubscribeFromClearExamHandler) {
      this.unsubscribeFromClearExamHandler();
    }
  }

  private closeClassification() {
    if (!this.appLayout) {
      return;
    }

    if (
      this.appLayout.hasAttribute('classification-style') &&
      this.appLayout.getAttribute('classification-style') !== 'fixed'
    ) {
      this.appLayout.removeAttribute('classification-style');
    }
  }

  private clearExam_onClick() {
    this.clearExam();
    return false;
  }

  private calculate_onClick() {
    this.classify();
    return false;
  }

  private clearExam() {
    if (!this.appLayout || !this.classification) {
      return;
    }

    if (!this.appStoreProvider || !this.externalMessagePortProvider) {
      throw new Error(
        'The application store provider, or the external message port provider have not been initialized',
      );
    }

    clearExamUseCase(this.appStoreProvider, this.externalMessagePortProvider);
  }

  private classify() {
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

    const state = this.appStore.getState();
    calculateUseCase(
      state.gridModel ?? [],
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      this.appStoreProvider,
      this.isncsciExamProvider,
      this.externalMessagePortProvider,
    );

    const { calculationError } = this.appStore.getState();
    if (!calculationError) {
      //Show result panel
      if (this.appLayout.getAttribute('classification-style') !== 'fixed') {
        this.appLayout.setAttribute('classification-style', 'visible');
        document.documentElement.style.setProperty(
          '--calc-classification-height',
          `${this.classification.clientHeight / 16}rem`,
        );
      }
    }

    return false;
  }

  private closeClassification_onClick() {
    this.closeClassification();
    return false;
  }

  private externalMessagePortProvider_onExternalPort() {
    console.log('An external message port has been registered');
  }

  private externalMessagePortProvider_onExamData(examData: ExamData | null) {
    if (!this.appStoreProvider) {
      throw new Error(
        'The application store provider has not been initialized',
      );
    }

    this.closeClassification();

    loadExternalExamDataUseCase(
      this.appStoreProvider,
      examData ?? getEmptyExamData(),
    );
  }

  private externalMessagePortProvider_onReadonly(readonly: boolean) {
    if (!this.appStoreProvider) {
      throw new Error(
        'The application store provider has not been initialized',
      );
    }

    setReadonlyUseCase(readonly, this.appStoreProvider);
  }

  private externalMessagePortProvider_onStyleAttribute(
    styleAttribute: string,
  ) {
    this.querySelector('praxis-isncsci-app-layout')?.setAttribute(
      styleAttribute,
      '',
    );
  }

  private stateChanged(state: IAppState, actionType: string): void {
    if (!this.ready && state.status === StatusCodes.Ready) {
      console.log(`The application has been initialized and is ready`);
      this.ready = true;
    }

    if (actionType === Actions.SET_READONLY) {
      if (state.readonly) {
        this.setAttributeNode(document.createAttribute('static-height'));
        this.appLayout?.setAttributeNode(document.createAttribute('readonly'));
      } else {
        this.removeAttribute('static-height');
        this.appLayout?.removeAttribute('readonly');
      }
    }

    if (
      actionType === Actions.SET_TOTALS ||
      actionType === Actions.CLEAR_TOTALS_AND_ERRORS
    ) {
      if (!state.totals.asiaImpairmentScale) {
        this.closeClassification();
      }
    }

    if (
      actionType === Actions.SET_CALCULATION_ERROR &&
      state.calculationError
    ) {
      alert(state.calculationError);
    }
  }
}

customElements.define(PraxisIsncsciWebApp.is, PraxisIsncsciWebApp);
