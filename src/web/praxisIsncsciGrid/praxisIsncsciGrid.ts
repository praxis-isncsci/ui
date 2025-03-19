import {
  MotorLevel,
  MotorLevels,
  SensoryLevel,
  SensoryLevels,
} from '@core/domain';

import '@web/praxisIsncsciCell';

/**
 * @tagname praxis-isncsci-grid
 */
export class PraxisIsncsciGrid extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-grid';
  }

  public static get observedAttributes(): string[] {
    return ['highlighted-cells', 'left', 'help-mode'];
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
        padding-right: 12px;
        white-space: nowrap;
      }
      
      .help-icon {
        color: #333;
        padding: 0.15rem 0.5rem;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
      }

      .help-icon.sensory {
        background-color: #ff4961;
        color: #ffffff;
      }

      .help-icon.sensory:hover {
        background-color: #e04056;
      }

      .help-icon.motor {
        background-color: #3780ff;
        color: #ffffff;
        margin-right: 10px
      }

      .help-icon.motor:hover {
        background-color: #2f6be0;
      }
      
      .left {
        justify-content: space-between;
        width: 50px;
      }

      .right {
        justify-content: right;
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

    this.attachShadow({ mode: 'open' });
  }

  public connectedCallback() {
    this.updateView(this.hasAttribute('left'));
  }

  private toggleHelpIcons(on: boolean) {
    if (!this.shadowRoot) return;
  
    const sensoryIcons = this.shadowRoot.querySelectorAll<HTMLButtonElement>(
      'button.help-icon.sensory',
    );
    const motorIcons = this.shadowRoot.querySelectorAll<HTMLButtonElement>(
      'button.help-icon.motor',
    );
  
    if (on) {
    } else {
      sensoryIcons.forEach((icon) => (icon.style.display = 'none'));
      motorIcons.forEach((icon) => (icon.style.display = 'none'));
    }
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
      console.log('ToDo: Dynamically change side');
      return;
    }

    if (name === 'highlighted-cells') {
      this.updateHighlights(newValue);
      return;
    }

    if (name === 'help-mode') {
      this.toggleHelpIcons(newValue != null);
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
    return `<praxis-isncsci-cell data-observation="${slug}" ${observationType}>${value ?? ''
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
    const helpMode = this.hasAttribute('help-mode');

    let levels = '';

    SensoryLevels.forEach((level) => {
      const isMotorLevel = MotorLevels.includes(level as MotorLevel);
      const isSensoryLevel = SensoryLevels.includes(level as SensoryLevel);
      levels += left
        ? `
            ${this.getCell('left', 'light-touch', level)}
            ${this.getCell('left', 'pin-prick', level)}
            ${this.getCell('left', 'motor', level)}

            <div class="label left">
            ${level}
            <button
              class="help-icon sensory"
              data-type="sensory"
              data-level="${level}"
              data-side="left"
              style="display: ${helpMode && isSensoryLevel ? 'inline-block' : 'none'}"
            >
              i
            </button>
          </div>
          `
        : `
            <div class="label right">
              <button
                class="help-icon motor"
                data-type="motor"
                data-level="${level}"
                data-side="right"
                style="display: ${helpMode && isMotorLevel ? 'inline-block' : 'none'}"
              >
                i
              </button>
              ${level}
            </div>
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
    const buttons = this.shadowRoot.querySelectorAll('button.help-icon');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const buttonEl = e.currentTarget as HTMLButtonElement;
        const level = buttonEl.getAttribute('data-level') || '';
        const side = buttonEl.getAttribute('data-side') || (left ? 'left' : 'right');
        const type = buttonEl.getAttribute('data-type') || 'sensory';

        // Dispatch a custom event for the outside to catch
        this.dispatchEvent(
          new CustomEvent('help-icon-clicked', {
            detail: { level, side, type },
            bubbles: true,
            composed: true
          })
        );
      });
    });
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
}

window.customElements.define(PraxisIsncsciGrid.is, PraxisIsncsciGrid);
