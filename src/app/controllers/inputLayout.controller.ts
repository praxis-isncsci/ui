import {Actions, IDataStore} from '@app/store';
import {IAppState} from '@core/boundaries';
import {Cell, Totals} from '@core/domain';

export class InputLayoutController {
  private cells: HTMLElement[] = [];

  public constructor(
    appStore: IDataStore<IAppState>,
    inputLayout: HTMLElement,
    private totalsView: HTMLElement,
  ) {
    if (!inputLayout.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    if (!totalsView.shadowRoot) {
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
    Object.keys(totals).forEach((key) => {
      const kebabCaseKey = key
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
      this.totalsView.setAttribute(kebabCaseKey, totals[key]);
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
