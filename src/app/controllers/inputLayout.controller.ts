import {Actions, IDataStore} from '@app/store';
import {IAppState} from '@core/boundaries';
import {Cell, Totals} from '@core/domain';

export class InputLayoutController {
  private cells: HTMLElement[] = [];
  private classificationTotals: HTMLElement[] = [];

  public constructor(
    appStore: IDataStore<IAppState>,
    inputLayout: HTMLElement,
    classificationView: HTMLElement,
  ) {
    if (!inputLayout.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    if (!classificationView.shadowRoot) {
      throw new Error('The totals have not been initialized');
    }

    inputLayout.shadowRoot
      .querySelectorAll('praxis-isncsci-grid')
      .forEach((grid) => {
        if (!grid.shadowRoot) {
          throw new Error('The grid has not been initialized');
        }

        const prefix = grid.hasAttribute('left') ? 'left' : 'right';
        const gridCells = grid.shadowRoot.querySelectorAll(
          'praxis-isncsci-cell',
        );
        gridCells.forEach(
          (cell) =>
            (this.cells[`${prefix}-${cell.getAttribute('data-observation')}`] =
              cell),
        );
      });

    this.classificationTotals = Array.from(
      classificationView.querySelectorAll('[data-total]'),
    );

    appStore.subscribe((state: IAppState, actionType: string) =>
      this.stateChanged(state, actionType),
    );
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
  }
}
