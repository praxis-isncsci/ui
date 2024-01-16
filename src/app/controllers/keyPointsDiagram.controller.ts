import {IAppState} from '@core/boundaries';
import {Actions, IDataStore} from '@app/store';
import {Cell} from '@core/domain';
import {levelNameRegex} from '@core/helpers';

export class KeyPointDiagramController {
  public constructor(
    appStore: IDataStore<IAppState>,
    private keyPointsDiagram: HTMLElement,
  ) {
    if (!keyPointsDiagram.shadowRoot) {
      throw new Error('The input layout has not been initialized');
    }

    // Subscribe to the application's store
    appStore.subscribe((state: IAppState, actionType: string) =>
      this.stateChanged(state, actionType),
    );
  }

  private getColor(cell: Cell | null) {
    if (!cell) {
      return '';
    }

    return /\*\*$/.test(cell.value)
      ? '2'
      : cell.value.replace(/((NT)?\**)$/, '');
  }

  private getKeyPointColor(lightTouch: Cell | null, pinPrick: Cell | null) {
    const colorValues = [this.getColor(lightTouch), this.getColor(pinPrick)]
      .sort()
      .join('-');

    return `--surface-${colorValues}`;
  }

  private updateRowKeyPoints(
    row: (Cell | null)[],
    keyPointsDiagram: HTMLElement,
  ) {
    const levelNameExec = levelNameRegex.exec(row[1]?.name ?? '');
    const levelName = levelNameExec ? levelNameExec[0] : '';
    const rightColor: string = this.getKeyPointColor(row[1], row[2]);
    const leftColor: string = this.getKeyPointColor(row[3], row[4]);

    keyPointsDiagram.shadowRoot
      ?.querySelectorAll(`[data-level="right-${levelName}"]`)
      .forEach((cn) => cn.setAttribute('fill', `var(${rightColor})`));

    keyPointsDiagram.shadowRoot
      ?.querySelectorAll(`[data-level="left-${levelName}"]`)
      .forEach((cn) => cn.setAttribute('fill', `var(${leftColor})`));
  }

  private updateKeyPointsDiagram(
    keyPointsDiagram: HTMLElement,
    gridModel: (Cell | null)[][],
  ) {
    gridModel.forEach((row: (Cell | null)[], rowIndex: number) =>
      this.updateRowKeyPoints(row, keyPointsDiagram),
    );
  }

  private stateChanged(state: IAppState, actionType: string) {
    switch (actionType) {
      case Actions.SET_GRID_MODEL:
      case Actions.SET_CELLS_VALUE:
        this.updateKeyPointsDiagram(this.keyPointsDiagram, state.gridModel);
        break;
    }
  }
}
