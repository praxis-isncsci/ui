import {Actions, IDataStore, appStore} from '@app/store';
import {IAppState, IIsncsciAppStoreProvider} from '@core/boundaries';
import {Cell, Totals} from '@core/domain';
import {setActiveCellUseCase} from '@core/useCases/setActiveCell.useCase';

export class InputLayoutController {
  private cells: HTMLElement[] = [];
  private classificationTotals: HTMLElement[] = [];
  private rightGrid: HTMLElement | null = null;
  private leftGrid: HTMLElement | null = null;

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

    this.registerGrids(
      inputLayout.shadowRoot.querySelectorAll('praxis-isncsci-grid'),
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

      const gridCells = grid.shadowRoot.querySelectorAll('praxis-isncsci-cell');
      gridCells.forEach(
        (cell) =>
          (this.cells[`${prefix}-${cell.getAttribute('data-observation')}`] =
            cell),
      );

      grid.shadowRoot.addEventListener('click', (e) =>
        this.grid_onClick(e as MouseEvent),
      );
    });
  }

  private updateView(gridModel: Array<Cell | null>[]) {
    gridModel.forEach((row) => {
      row.forEach((cell) => {
        if (!cell) {
          return;
        }

        const cellElement = this.cells[`${cell?.name}`];

        if (cellElement) {
          cellElement.innerHTML = cell?.value ?? '';
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

  private updateTotals(totals: Totals) {
    this.classificationTotals.forEach((classificationTotal) => {
      const key = (
        classificationTotal.getAttribute('data-total') ?? ''
      ).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      classificationTotal.innerHTML = totals[key] ?? '';
    });
  }

  private stateChanged(state: IAppState, actionType: string) {
    if (actionType === Actions.SET_GRID_MODEL) {
      this.updateView(state.gridModel);
    }

    if (actionType === Actions.SET_TOTALS) {
      this.updateTotals(state.totals);
    }

    if (actionType === Actions.SET_ACTIVE_CELL) {
      this.updateGridSelection(state.activeCell ? state.activeCell.name : null);
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

    setActiveCellUseCase(
      name,
      state.activeCell,
      'single',
      state.selectedCells,
      state.gridModel,
      this.appStoreProvider,
    );
  }
}
