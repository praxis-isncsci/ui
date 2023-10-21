/**
 * @tagname praxis-isncsci-classification-total
 */
export class PraxisIsncsciClassificationTotal extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-classification-total';
  }

  private template() {
    return `
      <style>
        :host {
          font-family: var(--font-family, sans-serif);
          font-size: var(--font-size, 0.625rem);
          font-weight: var(--font-weight, 400);
          line-height: var(--line-height, 1.875rem);
          text-align: var(--text-align, center);

          border-bottom: solid 0.0625rem var(--border-color, rgba(0, 0, 0, 0.6));
          display: inline-block;
          padding: 0.25rem 0;
        }
      </style>
      <slot></slot>
    `;
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(
  PraxisIsncsciClassificationTotal.is,
  PraxisIsncsciClassificationTotal,
);
