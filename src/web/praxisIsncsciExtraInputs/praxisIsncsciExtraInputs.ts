export class PraxisIsncsciExtraInputs extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-extra-inputs';
  }

  private template(): string {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: var(--gap, 1.5rem);
          justify-content: center;
          padding: var(--padding, 0 1rem);
        }

        .non-key-muscles {
          display: flex;
          flex-direction: column;
        }

        .non-key-muscles,
        .non-key-muscles .inputs,
        .comments {
          gap: var(--input-gap, 0.5rem);
        }

        .non-key-muscles,
        .comments {
          width: 100%
        }

        .inputs {
          align-items: center;
          display: grid;
          grid-template-columns: minmax(min-content, max-content) 1fr;
        }

        .comments {
          display: flex;
          flex-direction: column;
        }

        ::slotted([slot="non-key-muscles-header"]) {
          color: var(--header-color, #5e5e5e);
          font-family: var(--header-font-family, sans-serif);
          font-size: var(--header-font-size, 0.75rem);
          font-weight: var(--header-font-weight, 600);
          line-height: var(--header-line-height, 1rem);
        }

        ::slotted(label) {
          color: var(--label-color, #5e5e5e);
          font-family: var(--label-font-family, sans-serif);
          font-size: var(--label-font-size, 0.75rem);
          font-weight: var(--label-font-weight, 400);
          line-height: var(--label-line-height, 1rem);
        }

        ::slotted(select),
        ::slotted(textarea) {
          border-color: var(--input-border-color, #848484);
          border-radius: var(--input-border-radius, 0.125rem);
        }

        ::slotted(select) {
          height: var(--input-height, 2.26rem);
          min-width: 0;
        }

        ::slotted(textarea) {
          height: 4.625rem;
          resize: none;
        }

        @container (min-width: 48rem) {
          :host {
            flex-direction: row;
          }

          .non-key-muscles,
          .comments {
            max-width: 22.5rem;
          }
        }
      </style>
      <div class="non-key-muscles">
        <slot name="non-key-muscles-header"></slot>
        <div class="inputs">
          <slot name="right-lowest-label"></slot>
          <slot name="right-lowest"></slot>
          <slot name="left-lowest-label"></slot>
          <slot name="left-lowest"></slot>
        </div>
      </div>
      <div class="comments">
        <slot name="comments-label"></slot>
        <slot name="comments"></slot>
      </div>
    `;
  }

  public constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(
  PraxisIsncsciExtraInputs.is,
  PraxisIsncsciExtraInputs,
);
