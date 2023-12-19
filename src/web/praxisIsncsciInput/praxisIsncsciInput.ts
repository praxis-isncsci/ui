export class PraxisIsncsciInput extends HTMLElement {
  public static get is() {
    return 'praxis-isncsci-input';
  }

  public static get observedAttributes() {
    return ['disabled', 'sensory', 'selected-value'];
  }

  private template() {
    return `
      <style>
        :host {
          container-type: inline-size;
          display: flex;
          flex-direction: column;
          gap: var(--gap, 1rem);
          align-items: center;
        }

        /* Button styles */

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
          align-items: center;
          background-color: var(--button-surface, #fff);
          border: solid var(--button-border-width, 0.0625rem) var(--button-border-color, #ccc);
          border-radius: var(--button-border-radius, 0.25rem);
          color: var(--button-on-surface, #6a6a6a);
          display: flex;
          font-family: var(--button-font-family, sans-serif);
          font-size: var(--button-font-size, 0.875rem);
          font-weight: var(--button-font-weight, 400);
          height: var(--button-height, 2.375rem);
          justify-content: center;
          line-height: var(--button-line-height, 1.25rem);
          padding: 0;
          transition: background-color ease 200ms, font-size ease 200ms;
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

        button:disabled {
          background-color: var(--button-disabled-surface, #f5f5f5);
          color: var(--button-disabled-on-surface, #9e9e9e);
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          background-color: var(--button-hover-surface, #faecff);
          color: var(--button-on-surface, #6a6a6a);
        }

        button:active:not(:disabled) {
          background-color: var(--button-active-surface, #f1c6ff);
          font-size: var(--button-active-font-size, 0.75rem);
        }

        button[selected] {
          background-color: var(--button-selected-surface, purple);
          color: var(--button-selected-on-surface, #fff);
        }

        .button-group {
          border-radius: var(--button-border-radius, 0.25rem);
          display: flex;
          flex-direction: row;
          transition: box-shadow ease 200ms;
        }

        .button-group > *:first-child {
          flex-grow: 1;
        }

        .button-group:has(button:hover:not(:disabled)) {
          box-shadow: var(--button-hover-box-shadow, 0 2px 4px rgba(95, 24, 119, 0.1), 0 1px 6px rgba(95, 24, 119, 0.05));
        }

        /* Star input styles */

        :host([show-star-input]) [star-input] {
          max-height: 13.75rem;
        }

        [star-input] {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: var(--gap, 1rem);
          max-height: 0px;
          max-width: 63.75rem;
          overflow: hidden;
          transition: max-height ease 250ms;
        }

        [star-entries] {
          display: flex;
          flex-direction: column;
          gap: var(--gap, 1rem);
          padding: 0 0.25rem;
        }

        .star-input-entry {
          align-items: center;
          display: flex;
          flex-direction: row;
          gap: .5rem;
        }

        .star-textarea-entry {
          align-items: stretch;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .divider {
          background-color: var(--divider-color, #d9d9d9);
          height: var(--divider-height, 0.0625rem);
        }

        .label-container {
          color: var(--label-color, #5e5e5e);
          flex-grow: 1;
          font-family: var(--label-font-family, sans-serif);
          font-size: var(--label-font-size, 0.75rem);
          font-weight: var(--label-font-weight, 400);
          line-height: var(--label-line-height, 0.875rem);
        }

        .input-container {
          display: flex;
        }

        ::slotted(select) {
          height: var(--input-height, 2.25rem);
          width: var(--select-width, 11.25rem);
        }

        ::slotted(textarea) {
          height: var(--textarea-height, 3.5rem);
          width: 100%;
        }

        @container (min-width: 48rem) {
          :host {
            flex-direction: row;
          }

          [star-input] {
            transition: none;
          }

          [star-entries] {
            flex-direction: row;
            padding: 0;
          }

          .star-input-entry {
            align-items: stretch;
            flex-direction: column;
            max-width: 180px;
          }

          .star-textarea-entry {
            flex-grow: 1;
          }

          .divider {
            display: none;
          }

          ::slotted(select) {
            flex-grow: 1;
          }
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
          <button class="isncsci-input-button right" value="2*" motor-only><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="3" motor-only>3</button>
          <button class="isncsci-input-button right" value="3*" motor-only><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="4" motor-only>4</button>
          <button class="isncsci-input-button right" value="4*" motor-only><span>*</span></button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button" value="5" motor-only>5</button>
        </div>
        <div class="button-group">
          <button class="isncsci-input-button left" value="NT">NT</button>
          <button class="isncsci-input-button right" value="NT*"><span>*</span></button>
        </div>
      </div>
      <div star-input>
        <div class="divider">&nbsp;</div>
        <div star-entries>
          <div class="star-input-entry">
            <div class="label-container">
              <slot name="consider-normal-label"></slot>
            </div>
            <div class="input-container">
              <slot name="consider-normal"></slot>
            </div>
          </div>
          <div class="star-input-entry">
            <div class="label-container">
              <slot name="reason-for-impairment-not-due-to-sci-label"></slot>
            </div>
            <div class="input-container">
              <slot name="reason-for-impairment-not-due-to-sci"></slot>
            </div>
          </div>
          <div class="star-textarea-entry">
            <div class="label-container">
              <slot name="reason-for-impairment-not-due-to-sci-specify-label"></slot>
            </div>
            <div class="input-container">
              <slot name="reason-for-impairment-not-due-to-sci-specify"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }

  public connectedCallback() {
    this.shadowRoot
      ?.querySelectorAll('button')
      .forEach((b) =>
        b.addEventListener('click', (e) => this.buttons_onClick(b)),
      );
  }

  private buttons_onClick(button: HTMLButtonElement) {
    const value = button.value;

    if (!value || !/^([0-4]\*?|5|NT\*{0,2})$/.test(value)) {
      return;
    }

    this.dispatchEvent(new CustomEvent('value_click', {detail: {value}}));
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'sensory') {
      if (newValue === null) {
        this.shadowRoot?.querySelectorAll('[motor-only]').forEach((b) => {
          b.removeAttribute('disabled');
        });
      } else {
        this.shadowRoot?.querySelectorAll('[motor-only]').forEach((b) => {
          b.setAttribute('disabled', '');
        });
      }
    }

    if (name === 'selected-value') {
      this.shadowRoot
        ?.querySelectorAll('[selected]')
        .forEach((b) => b.removeAttribute('selected'));

      this.shadowRoot
        ?.querySelectorAll(`button[value="${newValue}"]`)
        .forEach((b) => b.setAttribute('selected', ''));
    }

    if (name === 'disabled') {
      if (newValue === null) {
        const selector = this.hasAttribute('sensory')
          ? 'button:not([motor-only])'
          : 'button';
        this.shadowRoot?.querySelectorAll(selector).forEach((b) => {
          b.removeAttribute('disabled');
        });
      } else {
        this.shadowRoot?.querySelectorAll('button').forEach((b) => {
          b.setAttribute('disabled', '');
        });
      }
    }
  }
}

window.customElements.define(PraxisIsncsciInput.is, PraxisIsncsciInput);
