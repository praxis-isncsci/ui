import {appStore} from '@app/store';
import {
  Cell,
  MotorLevel,
  MotorLevels,
  SensoryLevel,
  SensoryLevels,
  ValidMotorValues,
  ValidSensoryValues,
} from '@core/domain';
import {getCellColumn, getCellRow} from '@core/helpers';
import {setActiveCellUseCase} from '@core/useCases';

import '@web/praxisIsncsciCell';

/**
 * @tagname praxis-isncsci-grid
 */
export class PraxisIsncsciGrid extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-grid';
  }

  public static get observedAttributes(): string[] {
    return ['highlighted-cells', 'left'];
  }

  private template: string = `
    <style>
      :host {
        column-gap: var(--cell-gap);
        display: grid;
        grid-template-columns: repeat(4, var(--cell-width, 2.5rem));
        grid-template-areas:
          'side side side side'
          '. mh lth pph'
          'label motor light-touch pin-prick';
        grid-template-rows: 1.625rem 1.5rem repeat(28, var(--cell-height, 2.375rem));
        row-gap: var(--cell-gap, 0);
      }

      :host([left]) {
        grid-template-areas:
          'side side side side'
          'lth pph mh .'
          'light-touch pin-prick motor label';
      }

      :host([left]) .label {
        padding-left: 12px;
        padding-right: 0;
      }

      :host([labels-hidden]) .label {
        display: none;
      }

      .header {
        font-weight: lighter;
        margin: 0;
        padding: 0;
        text-align: center;
      }

      .header.side {
        grid-column: side;
      }

      .header.motor {
        grid-column: mh;
      }

      .header.light-touch {
        grid-column: lth;
      }

      .header.pin-prick {
        grid-column: pph;
      }

      .label {
        align-items: center;
        display: flex;
        grid-column: label;
        justify-content: right;
        padding-right: 12px;
      }

      [motor] {
        grid-column: motor;
      }

      [light-touch] {
        grid-column: light-touch;
      }

      [pin-prick] {
        grid-column: pin-prick;
      }
    </style>
  `;

  public constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  public connectedCallback() {
    this.updateView(this.hasAttribute('left'));
    this.addEventListener('keydown', this.handleKeydown.bind(this));
    this.addEventListener('click', this.handleCellClick.bind(this));
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'left') {
      this.updateView(this.hasAttribute('left'));
      console.log('ToDo: Dynamically change side');
      return;
    }

    if (name === 'highlighted-cells') {
      this.updateHighlights(newValue);
      return;
    }
  }

  private getCell(
    side: string,
    observationType: string,
    level: SensoryLevel,
  ): string {
    if (
      observationType === 'motor' &&
      !MotorLevels.includes(level as MotorLevel)
    ) {
      return '';
    }

    const slug = `${side}-${observationType}-${level.toLowerCase()}`;
    const value = this.getAttribute(slug);
    return `<praxis-isncsci-cell data-observation="${slug}" ${observationType} tabindex="0">${
      value ?? ''
    }</praxis-isncsci-cell>`;
  }

  private getHeader(left: boolean) {
    return left
      ? `
          <h3 class="header side">Left</h3>
          <div class="header light-touch">LT</div><div class="header pin-prick">PP</div><div class="header motor">M</div>
        `
      : `
          <h3 class="header side">Right</h3>
          <div class="header motor">M</div><div class="header light-touch">LT</div><div class="header pin-prick">PP</div>
        `;
  }

  private getLevels(left: boolean) {
    let levels = '';

    SensoryLevels.forEach((level) => {
      levels += left
        ? `
            ${this.getCell('left', 'light-touch', level)}
            ${this.getCell('left', 'pin-prick', level)}
            ${this.getCell('left', 'motor', level)}

            <div class="label">${level}</div>
          `
        : `
            <div class="label">${level}</div>
            ${this.getCell('right', 'motor', level)}
            ${this.getCell('right', 'light-touch', level)}
            ${this.getCell('right', 'pin-prick', level)}
          `;
    });

    return levels;
  }

  private updateView(left: boolean) {
    if (!this.shadowRoot) {
      throw new Error(
        `${PraxisIsncsciGrid.is} :: updateView :: No shadow root available`,
      );
    }

    this.shadowRoot.innerHTML = `
      ${this.template}
      ${this.getHeader(left)}
      ${this.getLevels(left)}
    `;
  }

  private updateHighlights(newValue: string) {
    if (!this.shadowRoot) {
      throw new Error('No shadow root available');
    }

    // Clear previous highlights
    this.shadowRoot
      .querySelectorAll('praxis-isncsci-cell[highlighted]')
      .forEach((cell) => cell.removeAttribute('highlighted'));

    // Set new highlights
    if (!newValue) {
      return;
    }

    const attribute = newValue
      .split('|')
      .map((observation) => `[data-observation="${observation}"]`)
      .join(',');

    this.shadowRoot
      .querySelectorAll(attribute)
      .forEach((cell) => cell.setAttribute('highlighted', ''));
  }

  private handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const value = event.key;

    //validate input based on cell type
    if (!this.isValidInput(target, value)) {
      event.preventDefault();
      return;
    }

    if (value.length === 1 && /^[0-9a-zA-Z]$/.test(value)) {
      event.preventDefault();
      this.updateCellValue(target, value);
      this.moveFocusToNextCell(target);
    }
  }

  private isValidInput(cell: HTMLElement, value: string): boolean {
    const isMotorCell = cell.hasAttribute('motor');
    const validValues = isMotorCell ? ValidMotorValues : ValidSensoryValues;
    return validValues.includes(value as any);
  }

  private handleCellClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.matches('praxis-isncsci-cell')) {
      target.focus();
    }
  }

  private updateCellValue(cell: HTMLElement, value: string) {
    cell.textContent = value;
    //Dispatch custom event to update the state
    this.dispatchEvent(
      new CustomEvent('cell-value-changed', {
        detail: {value},
        bubbles: true,
        composed: true,
      }),
    );
    this.moveFocusToNextCell(cell);
  }

  private moveFocusToNextCell(currentCell: HTMLElement) {
    const nextActiveCellName = this.getNextActiveCell(
      currentCell.getAttribute('data-observation')!,
      appStore.getState().gridModel,
    );
    if (nextActiveCellName) {
      const nextActiveCell = this.shadowRoot!.querySelector<HTMLElement>(
        `[data-observation="${nextActiveCellName}"]`,
      );
      if (nextActiveCell) {
        nextActiveCell.focus();
      }
    }
  }

  private getNextActiveCell(
    currentCellName: string,
    gridModel: Array<Cell | null>[],
  ): string | null {
    const cells = gridModel
      .flat()
      .filter((cell): cell is Cell => cell !== null);
    const currentIndex = cells.findIndex(
      (cell) => cell.name === currentCellName,
    );

    if (currentIndex === -1) {
      console.log('currentIndex', currentIndex);
      return null;
    }

    const currentColumn = getCellColumn(currentCellName);
    const currentRow = getCellRow(currentCellName);
    let nextRow = currentRow + 1;
    let nextColumn = currentColumn;

    if (nextRow >= gridModel.length) {
      nextRow = 0; // Move to the top
      nextColumn += 1; // Move to the next column
    }

    const nextCell = gridModel[nextRow][nextColumn];

    return nextCell ? nextCell.name : null;
  }
  // private moveFocusToNextCell(currentCell: HTMLElement) {
  //   const cells = Array.from(
  //     this.shadowRoot!.querySelectorAll<HTMLElement>('praxis-isncsci-cell'),
  //   );
  //   const currentIndex = cells.indexOf(currentCell);
  //   if (currentIndex === -1) {
  //     console.error('currentCell not found');
  //     return;
  //   }

  //   const nextIndex = this.getNextCellIndex(currentIndex, cells);

  //   if (nextIndex !== -1) {
  //     cells[nextIndex].focus();
  //   }
  // }
  // private getNextCellIndex(currentIndex: number, cells: HTMLElement[]): number {
  //   const columns = 4;
  //   const rows = cells.length / columns;
  //   const currentColumn = currentIndex % columns;
  //   const currentRow = Math.floor(currentIndex / columns);
  //   let nextRow = currentRow + 1;
  //   let nextColumn = currentColumn;

  //   if (nextRow >= rows) {
  //     nextRow = 0; // Move to the top
  //     nextColumn += 1; // Move to the next column
  //   }

  //   const nextIndex = nextRow * columns + nextColumn;

  //   return nextIndex < cells.length ? nextIndex : -1; // return -1 if there are no more cells in the column
  // }
}

window.customElements.define(PraxisIsncsciGrid.is, PraxisIsncsciGrid);
