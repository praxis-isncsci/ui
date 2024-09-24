import { Actions, IDataStore, appStore } from '@app/store';
import {
  IAppState,
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
} from '@core/boundaries';
import { Cell, MotorLevel, Totals } from '@core/domain';
import { cellsMatch, getCellPosition, getCellRange, sensoryCellRegex } from '@core/helpers';
import {
  setActiveCellUseCase,
  setCellsValueUseCase,
  setExtraInputsUseCase,
  setStarDetailsUseCase,
  setVacDapUseCase,
  getNextActiveCellUseCase
} from '@core/useCases';
import { BinaryObservation } from '@core/domain';
import { setCellCommentsUseCase } from '@core/useCases/setCellComments.useCase';

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
  private cellCommentsDisplay: HTMLElement | null = null;
  private keyMap: { [key: string]: string } = {};
  private inputLayout: HTMLElement;

  public constructor(
    appStore: IDataStore<IAppState>,
    private appStoreProvider: IIsncsciAppStoreProvider,
    private externalMessageProvider: IExternalMessageProvider,
    inputLayout: HTMLElement,
    private inputButtons: HTMLElement,
    classificationView: HTMLElement,
  ) {
    this.inputLayout = inputLayout;

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
    this.keyMap['0'] = '0';
    this.keyMap['1'] = '1';
    this.keyMap['2'] = '2';
    this.keyMap['3'] = '3';
    this.keyMap['4'] = '4';
    this.keyMap['5'] = '5';
    this.keyMap['n'] = 'NT';
    this.keyMap['u'] = 'UNK';
    this.keyMap[')'] = '0*';
    this.keyMap['!'] = '1*';
    this.keyMap['@'] = '2*';
    this.keyMap['#'] = '3*';
    this.keyMap['$'] = '4*';
    this.keyMap['N'] = 'NT*';
    this.keyMap['Delete'] = '';
    this.keyMap['Backspace'] = '';

    if (!this.inputLayout.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    this.cellCommentsDisplay = this.inputLayout.querySelector('#cell-comments-display');
    console.log('cellCommentsDisplay:', this.cellCommentsDisplay);
  }

  private inputValue_onKeydown(e: KeyboardEvent) {

    //Check for non textbox input
    if (e.target instanceof HTMLTextAreaElement
      || e.target instanceof HTMLInputElement) {
      return;
    }

    //Check for active cell
    const state = appStore.getState();
    if (!state.activeCell) {
      return;
    }

    //Check for there are at least 1 enabled button for input
    const inputs =
      this.inputButtons.shadowRoot?.querySelectorAll(
        'button:not([disabled])',
      ) ?? [];
    if (!inputs || inputs.length === 0) {
      return;
    }

    //Check for valid value
    const validValues = Array.from(inputs).map(
      (i) => (i as HTMLButtonElement).value,
    );
    validValues.push('');
    const value = this.keyMap[e.key];
    if ((!value && value !== '') || !validValues.includes(value)) {
      return;
    }

    setCellsValueUseCase(
      value,
      state.selectedCells.slice(),
      state.gridModel.slice(),
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      state.cellComments,
      true,
      this.appStoreProvider,
      this.externalMessageProvider,
    );
    const nextActiveCell = getNextActiveCellUseCase(
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
    cellComments: string | null,
  ) {
    console.log('updateExtraInputs called with cellComments:', cellComments);

    if (!this.rightLowest || !this.leftLowest || !this.comments) {
      throw new Error(
        'The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized',
      );
    }

    this.rightLowest.value = rightLowestNonKeyMuscleWithMotorFunction ?? 'None';
    this.leftLowest.value = leftLowestNonKeyMuscleWithMotorFunction ?? 'None';
    this.comments.value = comments;
    if (this.cellCommentsDisplay) {
      this.cellCommentsDisplay.innerHTML = cellComments ?? '';
    }
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
      state.cellComments,
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
      state.cellComments,
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
      state.cellComments,
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
      case Actions.SET_CELL_COMMENTS:
        this.updateExtraInputs(
          state.rightLowestNonKeyMuscleWithMotorFunction,
          state.leftLowestNonKeyMuscleWithMotorFunction,
          state.comments,
          state.cellComments,
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
          state.cellComments,
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

    let state = appStore.getState();

    const isMultipleSelection = e.ctrlKey || e.metaKey;

    // If not in multiple selection mode
    if (!isMultipleSelection) {
      // If there is an activeCell and selectedCells.length > 1 (after a range selection)
      if (state.activeCell && state.selectedCells.length > 1) {
        // Reset activeCell and selectedCells to start a new selection
        this.appStoreProvider.setActiveCell(null, []);
        // Update the state after resetting
        state = appStore.getState();
      }
    }

    // Determine the selection mode
    const selectionMode = isMultipleSelection
      ? 'multiple'
      : state.activeCell
        ? 'range'
        : 'single';

    setActiveCellUseCase(
      name,
      state.activeCell,
      selectionMode,
      state.selectedCells,
      state.gridModel.slice(),
      this.appStoreProvider,
    );
  }

  private reasonOptionsMap: { [key: string]: string } = {
    '1': 'Plexopathy',
    '2': 'Peripheral neuropathy',
    '3': 'Pre-existing myoneural disease (e.g. Stroke, MS, etc.)',
    '6': 'Other (specify:)',
  };
  
  private considerNormalMap: { [key: string]: string } = {
    '1': 'Consider Normal',
    '2': 'Consider Not Normal',
  };

  private typeMap: { [key: string]: string } = {
    'LIGHT TOUCH': 'LT',
    'PIN PRICK': 'PP',
    'MOTOR': 'M',
  };

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
    const selectedCells = state.selectedCells;
    const reasonValue = this.reasonImpairmentNotDueToSci.value;
    const reasonText = this.reasonOptionsMap[reasonValue] || reasonValue;
  
    const considerNormalValue = this.considerNormal.value;
    const considerNormalText = this.considerNormalMap[considerNormalValue] || considerNormalValue;
  
    const specifyText = this.reasonImpairmentNotDueToSciSpecify.value;
  
    let cellComments = state.cellComments || '';
  
    if (selectedCells.length > 0) {
      
      // Group cells by side and type
      const cellsBySideAndType: { [key: string]: Cell[] } = {};
      selectedCells.forEach((cell) => {
        // Determine side
        const side = cell.name.startsWith('right') ? 'Right' : 'Left';
  
        // Determine type
        const typeMatch = cell.name.match(/(light-touch|pin-prick|motor)/i);
        const typeKey = typeMatch ? typeMatch[1].toUpperCase().replace('-', ' ') : '';
        const type = this.typeMap[typeKey] || typeKey;
  
        const key = `${side}-${type}`;
  
        if (!cellsBySideAndType[key]) {
          cellsBySideAndType[key] = [];
        }
        cellsBySideAndType[key].push(cell);
      });
  
      let commentsArray = cellComments ? cellComments.split('\n') : [];
  
      // For each group
      for (const key in cellsBySideAndType) {
        const groupCells = cellsBySideAndType[key];
        const [groupSide, groupType] = key.split('-');
  
        // Extract levels
        const levels = groupCells.map((cell) => {
          const match = cell.name.match(/-([CTLS]\d+_?\d?)/i);
          return match ? match[1].toUpperCase() : '';
        });
  
        // Remove duplicates and sort levels
        const uniqueLevels = Array.from(new Set(levels));
        uniqueLevels.sort((a, b) => {
          const parseLevel = (level: string) => {
            const match = level.match(/^([A-Z])(\d+(\.\d+)?)/);
            if (!match) return { region: '', number: 0 };
            const region = match[1];
            const number = parseFloat(match[2]);
            return { region, number };
          };
  
          const regionOrder: { [key: string]: number } = {
            'C': 1,
            'T': 2,
            'L': 3,
            'S': 4,
          };
  
          const levelA = parseLevel(a);
          const levelB = parseLevel(b);
  
          const regionAOrder = regionOrder[levelA.region];
          const regionBOrder = regionOrder[levelB.region];
  
          if (regionAOrder !== regionBOrder) {
            return regionAOrder - regionBOrder;
          } else {
            return levelA.number - levelB.number;
          }
        });
  
        // Determine the range
        const range = uniqueLevels.length > 1
          ? `${uniqueLevels[0]}-${uniqueLevels[uniqueLevels.length - 1]}`
          : uniqueLevels[0];
  
        // Build the comment
        let newComment = `${range} ${groupSide} ${groupType}: `;
        newComment += considerNormalText ? `${considerNormalText} for classification. ` : '';
        if (reasonText) {
          newComment += `Reason: ${reasonText}. `;
        }
        if (specifyText) {
          newComment += `Specify: ${specifyText};`;
        }
  
        // Remove existing comments for the same range and type
        const commentIdentifier = `${range} ${groupSide} ${groupType}:`;
        commentsArray = commentsArray.filter(
          (comment) => !comment.startsWith(commentIdentifier)
        );
  
        // Append the new comment
        commentsArray.push(newComment);
      }
  
      // Join the comments back into a string
      cellComments = commentsArray.join('\n');
    }

    // Update cell comments
    setCellCommentsUseCase(
      cellComments,
      state.gridModel.slice(),
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      this.appStoreProvider,
      this.externalMessageProvider,
    );

    setStarDetailsUseCase(
      considerNormalValue === '1' ? true : considerNormalValue === '2' ? false : null,
      this.reasonImpairmentNotDueToSci.value,
      this.reasonImpairmentNotDueToSciSpecify.value,
      specifyText,
      state.selectedCells,
      state.gridModel,
      state.vac,
      state.dap,
      state.rightLowestNonKeyMuscleWithMotorFunction,
      state.leftLowestNonKeyMuscleWithMotorFunction,
      state.comments,
      cellComments,
      true,
      this.appStoreProvider,
      this.externalMessageProvider,
    );
  }
}