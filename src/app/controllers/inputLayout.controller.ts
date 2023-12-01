import {Actions, IDataStore, appStore} from '@app/store';
import {IAppState, IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell, Totals} from '@core/domain';
import {sensoryCellRegex} from '@core/helpers';
import {setCellsValueUseCase} from '@core/useCases';
import {setActiveCellUseCase} from '@core/useCases/setActiveCell.useCase';

export class InputLayoutController {
  private classificationTotals: HTMLElement[] = [];
  private rightGrid: HTMLElement | null = null;
  private leftGrid: HTMLElement | null = null;
  private inputButtons: HTMLElement | null = null;

  public constructor(
    appStore: IDataStore<IAppState>,
    private appStoreProvider: IIsncsciAppStoreProvider,
    inputLayout: HTMLElement,
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

    this.inputButtons = inputLayout.shadowRoot.querySelector(
      'praxis-isncsci-input',
    );

    if (!this.inputButtons) {
      throw new Error('The input buttons have not been initialized');
    }

    this.registerGrids(
      inputLayout.shadowRoot.querySelectorAll('praxis-isncsci-grid'),
    );

    inputLayout.shadowRoot
      .querySelector('praxis-isncsci-input')
      ?.addEventListener('value_click', (e) =>
        this.inputValue_onClick(e as CustomEvent),
      );

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
      cellElement.innerHTML = cell.value;
    }
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

  private updateCellViews(updatedCells: Cell[]) {
    updatedCells.forEach((cell) => this.updateCellView(cell));
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

  private updateInputButtons(activeCell: Cell | null) {
    if (!this.inputButtons) {
      throw new Error('The input buttons have not been initialized');
    }

    if (activeCell) {
      this.inputButtons.removeAttribute('disabled');

      if (activeCell.value) {
        this.inputButtons.setAttribute('selected-value', activeCell.value);
      } else {
        this.inputButtons.removeAttribute('selected-value');
      }

      if (sensoryCellRegex.test(activeCell.name)) {
        this.inputButtons.setAttribute('sensory', '');
      } else {
        this.inputButtons.removeAttribute('sensory');
      }
    } else {
      this.inputButtons.removeAttribute('selected-value');
      this.inputButtons.removeAttribute('sensory');
      this.inputButtons.setAttribute('disabled', '');
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

  private inputValue_onClick(e: CustomEvent) {
    const state = appStore.getState();

    if (!state.activeCell) {
      return;
    }

    setCellsValueUseCase(
      e.detail.value,
      state.selectedCells.slice(),
      state.gridModel.slice(),
      true,
      this.appStoreProvider,
    );
  }

  private stateChanged(state: IAppState, actionType: string) {
    if (actionType === Actions.SET_GRID_MODEL) {
      this.updateView(state.gridModel.slice());
    }

    if (actionType === Actions.SET_TOTALS) {
      this.updateTotals(state.totals);
    }

    if (actionType === Actions.SET_ACTIVE_CELL) {
      this.updateGridSelection(state.activeCell ? state.activeCell.name : null);
      this.updateInputButtons(state.activeCell);
    }

    if (actionType === Actions.SET_CELLS_VALUE) {
      this.updateCellViews(state.updatedCells.slice());
      this.updateInputButtons(state.activeCell);
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
}
