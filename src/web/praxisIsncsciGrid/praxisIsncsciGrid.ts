import {MotorLevel, MotorLevels, SensoryLevel, SensoryLevels} from '@core/domain';

import '@web/praxisIsncsciCell';

export class PraxisIsncsciGrid extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-grid';
  }

  public static get observedAttributes(): string[] {
    return ['left'];
  }

  private template: string = `
    <style>
      :host {
        --cell-gap: 0;
        --cell-height: 38px;
        --cell-width: 40px;
        column-gap: var(--cell-gap);
        display: grid;
        grid-template-columns: var(--cell-width) var(--cell-width) var(--cell-width) var(--cell-width);
        /*grid-template-rows: var(--cell-height) var(--cell-height) repeat(28, var(--cell-height));*/
        grid-template-areas:
          'side side side side'
          '. mh lth pph'
          'label motor light-touch pin-prick';
        grid-template-rows: 26px 24px repeat(28, var(--cell-height));
        row-gap: var(--cell-gap);
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

      [data-observation^="motor-"] {
        grid-column: motor;
      }

      [data-observation^="light-touch-"] {
        grid-column: light-touch;
      }

      [data-observation^="pin-prick-"] {
        grid-column: pin-prick;
      }
    </style>
  `;

  public constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  public connectedCallback() {
    this.updateView(this.hasAttribute('left'));
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'left') {
      console.log('ToDo: Dynamically change side');
    }
  }

  private getCell(level: SensoryLevel, observationType: string): string {
    if (observationType === 'motor' && !MotorLevels.includes(level as MotorLevel)) {
      return '';
    }

    const slug = `${observationType}-${level}`;
    const value = this.getAttribute(slug);
    return `<praxis-isncsci-cell data-observation="${slug}">${value ?? ''}</praxis-isncsci-cell>`;
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
        `
  }

  private getLevels(left: boolean) {
    let levels = '';

    SensoryLevels.forEach(level => {
      levels += left
        ? `
            ${this.getCell(level, 'light-touch')}
            ${this.getCell(level, 'pin-prick')}
            ${this.getCell(level, 'motor')}
            <div class="label">${level}</div>
          `
        : `
            <div class="label">${level}</div>
            ${this.getCell(level, 'motor')}
            ${this.getCell(level, 'light-touch')}
            ${this.getCell(level, 'pin-prick')}
          `;
    });

    return levels;
  }

  private updateView(left: boolean) {
    if (!this.shadowRoot) {
      throw new Error(`${PraxisIsncsciGrid.is} :: updateView :: No shadowroot available`);
    }

    this.shadowRoot.innerHTML = `
      ${this.template}
      ${this.getHeader(left)}
      ${this.getLevels(left)}
    `;
  }
}

window.customElements.define(PraxisIsncsciGrid.is, PraxisIsncsciGrid);
