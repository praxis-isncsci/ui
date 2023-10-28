/**
 * @tagname praxis-isncsci-dialog-header
 */
export class PraxisIsncsciDialogHeader extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-dialog-header';
  }

  private template() {
    return `
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: row;
          height: var(--height, 3.5rem);
          gap: var(--gap, 0.5rem);
          padding: var(--padding-top, 0) var(--padding-right, 0.75rem) var(--padding-bottom, 0) var(--padding-left, 3.25rem);
        }

        ::slotted([slot="title"]) {
          flex-grow: 1;
          font-family: var(--title-font-family, sans-serif);
          font-size: var(--title-font-size, 1rem);
          font-weight: var(--title-font-weight, 400);
          line-height: var(--title-line-height, 1.375rem);
          text-align: center;
        }
      </style>
      <slot name="title"></slot>
      <slot name="close"></slot>
    `;
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(
  PraxisIsncsciDialogHeader.is,
  PraxisIsncsciDialogHeader,
);
