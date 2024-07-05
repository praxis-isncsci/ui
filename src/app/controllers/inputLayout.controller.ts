import {Actions, IDataStore, appStore} from '@app/store';
import {
  IAppState,
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import {Cell, MotorLevel, Totals} from '@core/domain';
import {cellsMatch, sensoryCellRegex} from '@core/helpers';
import {
  setActiveCellUseCase,
  setCellsValueUseCase,
  setExtraInputsUseCase,
  setStarDetailsUseCase,
  setVacDapUseCase,
} from '@core/useCases';
import {BinaryObservation} from '@core/domain';

const allCellsHaveSameValues = (selectedCells: Cell[]) => {
  if (selectedCells.length === 0) {
    return false;
  }

  const firstCell = selectedCells[0];
  return selectedCells.every((cell) => cellsMatch(cell, firstCell));
};

export class InputLayoutController {
  private classificationTotals: HTMLElement[] = [];
  private rightGrid: HTMLElement | null = null;
  private leftGrid: HTMLElement | null = null;
  private vac: HTMLSelectElement | null = null;
  private dap: HTMLSelectElement | null = null;
  private considerNormal: HTMLSelectElement | null = null;
  private reasonImpairmentNotDueToSci: HTMLSelectElement | null = null;
  private reasonImpairmentNotDueToSciSpecify: HTMLTextAreaElement | null = null;
  private rightLowest: HTMLSelectElement | null = null;
  private leftLowest: HTMLSelectElement | null = null;
  private comments: HTMLTextAreaElement | null = null;

  public constructor(
    appStore: IDataStore<IAppState>,
    private appStoreProvider: IIsncsciAppStoreProvider,
    private externalMessageProvider: IExternalMessageProvider,
    inputLayout: HTMLElement,
    private inputButtons: HTMLElement,
    classificationView: HTMLElement,
  ) {
    if (!inputLayout.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    if (!classificationView.shadowRoot) {
      throw new Error('The totals have not been initialized');
    }

    this.classificationTotals = Array.from(
      classificationView.querySelectorAll('[data-total]'),
    );

    this.registerGrids(
      inputLayout.shadowRoot.querySelectorAll('praxis-isncsci-grid'),
    );

    // - Input Buttons --------------
    // [ToDo: Extract this section into its own controller]
    this.inputButtons.addEventListener('value_click', (e) =>
      this.inputValue_onClick(e as CustomEvent),
    );

    this.considerNormal = this.inputButtons.querySelector('#consider-normal');
    this.reasonImpairmentNotDueToSci = this.inputButtons.querySelector(
      '#reason-for-impairment-not-due-to-sci',
    );
    this.reasonImpairmentNotDueToSciSpecify = this.inputButtons.querySelector(
      '#reason-for-impairment-not-due-to-sci-specify',
    );

    if (
      !this.considerNormal ||
      !this.reasonImpairmentNotDueToSci ||
      !this.reasonImpairmentNotDueToSciSpecify
    ) {
      throw new Error(
        'The input buttons for consider normal, reason for impairment not due to sci and reason for impairment not due to sci specify have not been initialized',
      );
    }

    this.considerNormal.addEventListener('change', (e: Event) =>
      this.starInput_change(e),
    );

    this.reasonImpairmentNotDueToSci.addEventListener('change', (e: Event) =>
      this.starInput_change(e),
    );

    this.reasonImpairmentNotDueToSciSpecify.addEventListener(
      'change',
      (e: Event) => this.starInput_change(e),
    );

    // - VAC & DAP ------------------

    this.vac = inputLayout.querySelector('#vac');
    this.dap = inputLayout.querySelector('#dap');

    // VAC & DAP
    if (!this.vac || !this.dap) {
      throw new Error(
        'The input buttons for VAC and DAP have not been initialized',
      );
    }

    this.vac.addEventListener('change', () => this.vacDap_onChange());
    this.dap.addEventListener('change', () => this.vacDap_onChange());

    // Extra inputs - Right and left lowest non-key muscle with motor function and comments
    this.rightLowest = inputLayout.querySelector('#right-lowest');
    this.leftLowest = inputLayout.querySelector('#left-lowest');
    this.comments = inputLayout.querySelector('#comments');

    if (!this.rightLowest || !this.leftLowest || !this.comments) {
      throw new Error(
        'The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized',
      );
    }

    this.rightLowest.addEventListener('change', () =>
      this.extraInputs_onChange(),
    );
    this.leftLowest.addEventListener('change', () =>
      this.extraInputs_onChange(),
    );
    this.comments.addEventListener('change', () => this.extraInputs_onChange());

    // Subscribe to the application's store
    appStore.subscribe((state: IAppState, actionType: string) =>
      this.stateChanged(state, actionType),
    );

    // Enable keyboard entry
    document.addEventListener('keydown', (e) => {
      this.inputValue_onKeydown(e as KeyboardEvent);
    });
  }

  private inputValue_onKeydown(e: KeyboardEvent) {
    const state = appStore.getState();
    if (!state.activeCell) {
      return;
    }
    const inputs =
      this.inputButtons.shadowRoot?.querySelectorAll(
        'button:not([disabled])',
      ) ?? [];
    if (!inputs || inputs.length === 0) {
      return;
    }
    const validValues = Array.from(inputs).map(
      (i) => (i as HTMLButtonElement).value,
    );

    let value = e.key;
    if ((e.ctrlKey || e.metaKey) && /^[1-5]$/.test(e.key)) {
      e.preventDefault();
      value += '*';
    }

    switch (value) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '1*':
      case '2*':
      case '3*':
      case '4*':
      case '5*':
        if (validValues.includes(value)) {
          setCellsValueUseCase(
            value,
            state.selectedCells.slice(),
            state.gridModel.slice(),
            state.vac,
            state.dap,
            state.rightLowestNonKeyMuscleWithMotorFunction,
            state.leftLowestNonKeyMuscleWithMotorFunction,
            state.comments,
            true,
            this.appStoreProvider,
            this.externalMessageProvider,
          );
          const nextActiveCell = this.getNextActiveCell(
            state.activeCell.name,
            state.gridModel,
          );
          setActiveCellUseCase(
            nextActiveCell,
            state.activeCell,
            'single',
            state.selectedCells,
            state.gridModel.slice(),
            this.appStoreProvider,
          );
        }
        break;
      case '*':
        const lastValue = state.activeCell?.value;
        if (lastValue && validValues.includes(lastValue + '*')) {
          setCellsValueUseCase(
            lastValue + '*',
            state.selectedCells.slice(),
            state.gridModel.slice(),
            state.vac,
            state.dap,
            state.rightLowestNonKeyMuscleWithMotorFunction,
            state.leftLowestNonKeyMuscleWithMotorFunction,
            state.comments,
            true,
            this.appStoreProvider,
            this.externalMessageProvider,
          );
        }
        break;
    }
  }

  private getNextActiveCell(
    currentCellName: string,
    gridModel: Array<Cell | null>[],
  ): string {
    const order = [
      'right-motor-c5',
      'right-motor-c6',
      'right-motor-c7',
      'right-motor-c8',
      'right-motor-t1',
      'right-motor-l2',
      'right-motor-l3',
      'right-motor-l4',
      'right-motor-l5',
      'right-motor-s1',
      'right-light-touch-c2',
      'right-light-touch-c3',
      'right-light-touch-c4',
      'right-light-touch-c5',
      'right-light-touch-c6',
      'right-light-touch-c7',
      'right-light-touch-c8',
      'right-light-touch-t1',
      'right-light-touch-t2',
      'right-light-touch-t3',
      'right-light-touch-t4',
      'right-light-touch-t5',
      'right-light-touch-t6',
      'right-light-touch-t7',
      'right-light-touch-t8',
      'right-light-touch-t9',
      'right-light-touch-t10',
      'right-light-touch-t11',
      'right-light-touch-t12',
      'right-light-touch-l1',
      'right-light-touch-l2',
      'right-light-touch-l3',
      'right-light-touch-l4',
      'right-light-touch-l5',
      'right-light-touch-s1',
      'right-light-touch-s2',
      'right-light-touch-s3',
      'right-light-touch-s4_5',
      'right-pin-prick-c2',
      'right-pin-prick-c3',
      'right-pin-prick-c4',
      'right-pin-prick-c5',
      'right-pin-prick-c6',
      'right-pin-prick-c7',
      'right-pin-prick-c8',
      'right-pin-prick-t1',
      'right-pin-prick-t2',
      'right-pin-prick-t3',
      'right-pin-prick-t4',
      'right-pin-prick-t5',
      'right-pin-prick-t6',
      'right-pin-prick-t7',
      'right-pin-prick-t8',
      'right-pin-prick-t9',
      'right-pin-prick-t10',
      'right-pin-prick-t11',
      'right-pin-prick-t12',
      'right-pin-prick-l1',
      'right-pin-prick-l2',
      'right-pin-prick-l3',
      'right-pin-prick-l4',
      'right-pin-prick-l5',
      'right-pin-prick-s1',
      'right-pin-prick-s2',
      'right-pin-prick-s3',
      'right-pin-prick-s4_5',
      'left-light-touch-c2',
      'left-light-touch-c3',
      'left-light-touch-c4',
      'left-light-touch-c5',
      'left-light-touch-c6',
      'left-light-touch-c7',
      'left-light-touch-c8',
      'left-light-touch-t1',
      'left-light-touch-t2',
      'left-light-touch-t3',
      'left-light-touch-t4',
      'left-light-touch-t5',
      'left-light-touch-t6',
      'left-light-touch-t7',
      'left-light-touch-t8',
      'left-light-touch-t9',
      'left-light-touch-t10',
      'left-light-touch-t11',
      'left-light-touch-t12',
      'left-light-touch-l1',
      'left-light-touch-l2',
      'left-light-touch-l3',
      'left-light-touch-l4',
      'left-light-touch-l5',
      'left-light-touch-s1',
      'left-light-touch-s2',
      'left-light-touch-s3',
      'left-light-touch-s4_5',
      'left-pin-prick-c2',
      'left-pin-prick-c3',
      'left-pin-prick-c4',
      'left-pin-prick-c5',
      'left-pin-prick-c6',
      'left-pin-prick-c7',
      'left-pin-prick-c8',
      'left-pin-prick-t1',
      'left-pin-prick-t2',
      'left-pin-prick-t3',
      'left-pin-prick-t4',
      'left-pin-prick-t5',
      'left-pin-prick-t6',
      'left-pin-prick-t7',
      'left-pin-prick-t8',
      'left-pin-prick-t9',
      'left-pin-prick-t10',
      'left-pin-prick-t11',
      'left-pin-prick-t12',
      'left-pin-prick-l1',
      'left-pin-prick-l2',
      'left-pin-prick-l3',
      'left-pin-prick-l4',
      'left-pin-prick-l5',
      'left-pin-prick-s1',
      'left-pin-prick-s2',
      'left-pin-prick-s3',
      'left-pin-prick-s4_5',
      'left-motor-c5',
      'left-motor-c6',
      'left-motor-c7',
      'left-motor-c8',
      'left-motor-t1',
      'left-motor-l2',
      'left-motor-l3',
      'left-motor-l4',
      'left-motor-l5',
      'left-motor-s1',
    ];

    const currentIndex = order.indexOf(currentCellName);
    if (currentIndex === -1) {
      throw new Error('Current cell name is not in the defined order');
    }

    const nextIndex = (currentIndex + 1) % order.length;
    return order[nextIndex];
  }

  private registerGrids(grids: NodeListOf<HTMLElement>) {
    grids.forEach((grid) => {
      if (!grid.shadowRoot) {
        throw new Error('The grid has not been initialized');
      }

      const prefix = grid.hasAttribute('left') ? 'left' : 'right';

      if (prefix === 'left') {
        this.leftGrid = grid;
      } else {
        this.rightGrid = grid;
      }

      grid.shadowRoot.addEventListener('click', (e) =>
        this.grid_onClick(e as MouseEvent),
      );
    });
  }

  private updateCellView(cell: Cell) {
    const grid = /^right-/.test(cell.name) ? this.rightGrid : this.leftGrid;
    const cellElement = grid?.shadowRoot?.querySelector(
      `[data-observation="${cell.name}"]`,
    );

    if (cellElement) {
      cellElement.innerHTML = cell.label;
      /\*/.test(cell.value) && cell.considerNormal === null
        ? cellElement.setAttribute('error', '')
        : cellElement.removeAttribute('error');
    }
  }

  private updateCellViews(updatedCells: Cell[]) {
    updatedCells.forEach((cell) => this.updateCellView(cell));
  }

  private updateView(gridModel: Array<Cell | null>[]) {
    gridModel.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          this.updateCellView(cell);
        }
      });
    });
  }

  private updateGridSelection(selectedPoints: string[] | null) {
    if (!this.leftGrid || !this.rightGrid) {
      throw new Error('The grids have not been initialized');
    }

    if (!selectedPoints) {
      this.rightGrid.removeAttribute('highlighted-cells');
      this.leftGrid.removeAttribute('highlighted-cells');
      return;
    }
    const leftSelectedPoints = selectedPoints
      .filter((p) => p.startsWith('left'))
      .join('|');
    const rightSelectedPoints = selectedPoints
      .filter((p) => p.startsWith('right'))
      .join('|');

    if (leftSelectedPoints) {
      this.leftGrid.setAttribute('highlighted-cells', leftSelectedPoints);
    } else {
      this.leftGrid.removeAttribute('highlighted-cells');
    }

    if (rightSelectedPoints) {
      this.rightGrid.setAttribute('highlighted-cells', rightSelectedPoints);
    } else {
      this.rightGrid.removeAttribute('highlighted-cells');
    }
  }

  private updateInputButtons(
    activeCell: Cell | null,
    selectedCells: Cell[] = [],
    inputButtons: HTMLElement,
    considerNormal: HTMLSelectElement,
    reasonImpairmentNotDueToSci: HTMLSelectElement,
    reasonImpairmentNotDueToSciSpecify: HTMLTextAreaElement,
  ) {
    considerNormal.value =
      !activeCell || activeCell.error || activeCell.considerNormal === null
        ? ''
        : activeCell.considerNormal === true
        ? '1'
        : '2';

    reasonImpairmentNotDueToSci.value =
      activeCell?.reasonImpairmentNotDueToSci ?? '';
    reasonImpairmentNotDueToSciSpecify.value =
      activeCell?.reasonImpairmentNotDueToSciSpecify ?? '';

    if (activeCell) {
      inputButtons.removeAttribute('disabled');

      if (activeCell.value) {
        inputButtons.setAttribute('selected-value', activeCell.value);

        if (
          /\*$/.test(activeCell.value) &&
          allCellsHaveSameValues(selectedCells)
        ) {
          inputButtons.setAttribute('show-star-input', '');
        } else {
          inputButtons.removeAttribute('show-star-input');
        }
      } else {
        inputButtons.removeAttribute('selected-value');
        inputButtons.removeAttribute('show-star-input');
      }

      if (sensoryCellRegex.test(activeCell.name)) {
        inputButtons.setAttribute('sensory', '');
      } else {
        inputButtons.removeAttribute('sensory');
      }
    } else {
      inputButtons.removeAttribute('selected-value');
      inputButtons.removeAttribute('sensory');
      inputButtons.setAttribute('disabled', '');
      inputButtons.removeAttribute('show-star-input');
    }
  }

  private updateTotals(totals: Totals) {
    this.classificationTotals.forEach((classificationTotal) => {
      const key = (
        classificationTotal.getAttribute('data-total') ?? ''
      ).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      classificationTotal.innerHTML = totals[key] ?? '';
    });
  }

  private updateDropdowns(
    vac: BinaryObservation | null,
    dap: BinaryObservation | null,
  ) {
    if (!this.vac || !this.dap) {
      throw new Error(
        'The input buttons for VAC and DAP have not been initialized',
      );
    }

    this.vac.value = vac ?? 'None';
    this.dap.value = dap ?? 'None';
  }

  private updateExtraInputs(
    rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null,
    comments: string,
  ) {
    if (!this.rightLowest || !this.leftLowest || !this.comments) {
      throw new Error(
        'The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized',
      );
    }

    this.rightLowest.value = rightLowestNonKeyMuscleWithMotorFunction ?? 'None';
    this.leftLowest.value = leftLowestNonKeyMuscleWithMotorFunction ?? 'None';
    this.comments.value = comments;
  }

  private inputValue_onClick(e: CustomEvent) {
    const state = appStore.getState();

    if (!state.activeCell) {
      return;
    }

    setCellsValueUseCase(
      e.detail.value,
      state.selectedCells.slice(),
      state.gridModel.slice(),
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      true,
      this.appStoreProvider,
      this.externalMessageProvider,
    );
  }

  private vacDap_onChange() {
    if (!this.vac || !this.dap) {
      throw new Error(
        'The input buttons for VAC and DAP have not been initialized',
      );
    }

    const state = appStore.getState();
    const vac =
      this.vac.value === 'None' ? null : (this.vac.value as BinaryObservation);
    const dap =
      this.dap.value === 'None' ? null : (this.dap.value as BinaryObservation);

    setVacDapUseCase(
      state.gridModel,
      vac,
      dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      this.appStoreProvider,
      this.externalMessageProvider,
    );
  }

  private extraInputs_onChange() {
    if (!this.rightLowest || !this.leftLowest || !this.comments) {
      throw new Error(
        'The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized',
      );
    }

    const state = appStore.getState();

    setExtraInputsUseCase(
      state.gridModel.slice(),
      state.vac,
      state.dap,
      this.rightLowest.value as MotorLevel,
      this.leftLowest.value as MotorLevel,
      this.comments.value,
      this.appStoreProvider,
      this.externalMessageProvider,
    );
  }

  private stateChanged(state: IAppState, actionType: string) {
    if (
      !this.considerNormal ||
      !this.reasonImpairmentNotDueToSci ||
      !this.reasonImpairmentNotDueToSciSpecify
    ) {
      throw new Error(
        'The input buttons for consider normal, reason for impairment not due to sci and reason for impairment not due to sci specify have not been initialized',
      );
    }

    switch (actionType) {
      case Actions.SET_GRID_MODEL:
        this.updateView(state.gridModel.slice());
        break;
      case Actions.SET_TOTALS:
      case Actions.CLEAR_TOTALS_AND_ERRORS:
        this.updateTotals(state.totals);
        break;
      case Actions.SET_ACTIVE_CELL:
        this.updateGridSelection(
          state.selectedCells ? state.selectedCells.map((c) => c.name) : null,
        );
        this.updateInputButtons(
          state.activeCell,
          state.selectedCells,
          this.inputButtons,
          this.considerNormal,
          this.reasonImpairmentNotDueToSci,
          this.reasonImpairmentNotDueToSciSpecify,
        );
        break;
      case Actions.SET_CELLS_VALUE:
        this.updateCellViews(state.updatedCells.slice());
        this.updateInputButtons(
          state.activeCell,
          state.selectedCells,
          this.inputButtons,
          this.considerNormal,
          this.reasonImpairmentNotDueToSci,
          this.reasonImpairmentNotDueToSciSpecify,
        );
        break;
      case Actions.SET_VAC_DAP:
        this.updateDropdowns(state.vac, state.dap);
        break;
      case Actions.SET_EXTRA_INPUTS:
        this.updateExtraInputs(
          state.rightLowestNonKeyMuscleWithMotorFunction,
          state.leftLowestNonKeyMuscleWithMotorFunction,
          state.comments,
        );
        break;
    }
  }

  private grid_onClick(e: MouseEvent) {
    if (!e.target || !(e.target instanceof HTMLElement)) {
      return;
    }

    const name = (e.target as HTMLElement).getAttribute('data-observation');

    if (!name) {
      return;
    }

    const state = appStore.getState();
    const selectionMode =
      e.ctrlKey || e.metaKey ? 'multiple' : e.shiftKey ? 'range' : 'single';

    setActiveCellUseCase(
      name,
      state.activeCell,
      selectionMode,
      state.selectedCells,
      state.gridModel.slice(),
      this.appStoreProvider,
    );
  }

  private starInput_change(e: Event) {
    if (
      !this.considerNormal ||
      !this.reasonImpairmentNotDueToSci ||
      !this.reasonImpairmentNotDueToSciSpecify
    ) {
      throw new Error(
        'The input buttons for consider normal, reason for impairment not due to sci and reason for impairment not due to sci specify have not been initialized',
      );
    }

    const state = appStore.getState();
    const considerNormal =
      this.considerNormal.value === '1'
        ? true
        : this.considerNormal.value === '2'
        ? false
        : null;

    setStarDetailsUseCase(
      considerNormal,
      this.reasonImpairmentNotDueToSci.value,
      this.reasonImpairmentNotDueToSciSpecify.value,
      state.selectedCells,
      state.gridModel,
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      true,
      this.appStoreProvider,
      this.externalMessageProvider,
    );
  }
}
