import {Actions, IDataStore} from '@app/store';
import {IAppState} from '@core/boundaries';
import {Cell} from '@core/domain';

export class InputLayoutController {
  private cells: HTMLElement[] = [];

  public constructor(appStore: IDataStore<IAppState>, inputLayout: HTMLElement) {
    if (!inputLayout.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    inputLayout.shadowRoot.querySelectorAll('praxis-isncsci-grid')
      .forEach((grid) => {
        if (!grid.shadowRoot) {
          throw new Error('The grid has not been initialized');
        }

        const prefix = grid.hasAttribute('left') ? 'left' : 'right';
        const gridCells = grid.shadowRoot.querySelectorAll('praxis-isncsci-cell');
        gridCells.forEach((cell) => this.cells[`${prefix}-${cell.getAttribute('data-observation')}`] = cell);
      });

    appStore.subscribe((state: IAppState, actionType: string) => this.stateChanged(state, actionType));
  }

  private updateView(gridModel: Array<Cell | null>[]): void {
    gridModel.forEach((row) => {
      row.forEach((cell, cellIndex) => {
        if (!cell) {
          return;
        }
        
        const prefix = cellIndex < 3 ? 'left' : 'right';
        const cellElement = this.cells[`${cell?.name}`];
        console.log('cellElement', cellElement, `${cell?.name}`);
        if (cellElement) {
          cellElement.innerHTML = cell?.value ?? '';
        }
      });
    });
  }

  private stateChanged(state: IAppState, actionType: string): void {
    if (actionType === Actions.SET_GRID_MODEL) {
      this.updateView(state.gridModel);
    }
  }
}
