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
      cell.error
        ? cellElement.setAttribute('error', cell.error)
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

  private updateGridSelection(selectedPoint: string | null) {
    if (!this.leftGrid || !this.rightGrid) {
      throw new Error('The grids have not been initialized');
    }

    if (!selectedPoint) {
      this.rightGrid.removeAttribute('highlighted-cells');
      this.leftGrid.removeAttribute('highlighted-cells');
    } else if (selectedPoint.startsWith('left')) {
      this.rightGrid.removeAttribute('highlighted-cells');
      this.leftGrid.setAttribute('highlighted-cells', selectedPoint);
    } else {
      this.leftGrid.removeAttribute('highlighted-cells');
      this.rightGrid.setAttribute('highlighted-cells', selectedPoint);
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
      !activeCell || activeCell.error || !/\*$/.test(activeCell.value)
        ? ''
        : /\*\*$/.test(activeCell.value)
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
        this.updateTotals(state.totals);
        break;
      case Actions.SET_ACTIVE_CELL:
        this.updateGridSelection(
          state.activeCell ? state.activeCell.name : null,
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
