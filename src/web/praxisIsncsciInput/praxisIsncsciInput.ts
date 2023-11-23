export class PraxisIsncsciInput extends HTMLElement {
  public static get is() {
    return 'praxis-isncsci-input';
  }

  private template() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }

        [buttons] {
          display: grid;
          gap: var(--buttons-gap, 0.25rem);
          grid-template-columns: repeat(4, 1fr);
          width: var(--buttons-width, 20.75rem);
        }

        [buttons] > *:last-child {
          grid-column: 3 / 5;
        }

        button {
          background-color: var(--button-surface, #fff);
          border: solid var(--button-border-width, 0.0625rem) var(--button-border-color, #ccc);
          border-radius: var(--button-border-radius, 0.25rem);
          color: var(--button-on-surface, #6a6a6a);
          height: var(--button-height, 2.375rem);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
        }
        
        button.left {
          border-radius: var(--button-border-radius, 0.25rem)
            var(--button-border-radius-none, 0)
            var(--button-border-radius-none, 0)
            var(--button-border-radius, 0.25rem);
          border-right: none;
        }
        
        button.right {
          border-radius: var(--button-border-radius-none, 0)
            var(--button-border-radius, 0.25rem)
            var(--button-border-radius, 0.25rem)
            var(--button-border-radius-none, 0);
          border-left: none;
          width: 2.5rem;
        }
        
        button.right::before {
          content: '';
          display: inline-block;
          background-color: var(--button-divider-color, #ccc);
          width: var(--button-divider-width, 0.0625rem);
          height: calc(100% - var(--button-divider-gap, 0.5rem));
        }
        
        button.right *:last-child {
          flex-grow: 1;
        }

        .button-group {
          display: flex;
          flex-direction: row;
        }

        .button-group > *:first-child {
          flex-grow: 1;
        }
      </style>
      <div buttons>
        <div class="button-group">
          <button class="isncsci-input-button left" value="0">0</button>
          <button class="isncsci-input-button right" value="0*"><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="1">1</button>
          <button class="isncsci-input-button right" value="1*"><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="2">2</button>
          <button class="isncsci-input-button right" value="2*"><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="3">3</button>
          <button class="isncsci-input-button right" value="3*"><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="4">4</button>
          <button class="isncsci-input-button right" value="4*"><span>*</span></button>
        </div>
        <button class="isncsci-input-button" value="5">5</button>
        <div class="button-group">
          <button class="isncsci-input-button left" value="NT">NT</button>
          <button class="isncsci-input-button right" value="NT*"><span>*</span></button>
        </div>
      </div>
    `;
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(PraxisIsncsciInput.is, PraxisIsncsciInput);
