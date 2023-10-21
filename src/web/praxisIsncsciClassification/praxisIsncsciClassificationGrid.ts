/**
 * @tagname praxis-isncsci-classification-grid
 */
export class PraxisIsncsciClassificationGrid extends HTMLElement {
  public static get is() {
    return 'praxis-isncsci-classification-grid';
  }

  private template() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: var(--gap, 0.5rem);
        }

        ::slotted([slot="heading"]) {
          color: var(--heading-foreground, #5E5E5E);
          font-family: var(--heading-font-family, sans-serif);
          font-size: var(--heading-font-size, 0.625rem);
          font-weight: var(--heading-weight, 400);
          line-height: var(--heading-line-height, 1.875rem);
          text-align: var(--heading-text-align, center);
        }

        ::slotted([slot="grid"]) {
          align-items: center;
          display: inline-grid;
          gap: var(--grid-gap, 0.25rem);
          grid-template-columns: var(--grid-template-columns, auto auto auto);
        }]
      </style>
      <slot name="heading"></slot>
      <slot name="grid"></slot>
    `;
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(
  PraxisIsncsciClassificationGrid.is,
  PraxisIsncsciClassificationGrid,
);
