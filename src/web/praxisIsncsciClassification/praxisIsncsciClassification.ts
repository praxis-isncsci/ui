/**
 * @tagname praxis-isncsci-classification
 */
export class PraxisIsncsciClassification extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-classification';
  }

  private template() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        
        [content] {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap, 2.5rem);
          justify-content: center;
          padding: var(--padding, 1rem);
        }
      </style>
      <slot name="header"></slot>
      <div content>
        <slot name="neurological-levels"></slot>
        <slot name="nli"></slot>
        <slot name="ais"></slot>
        <slot name="zpp"></slot>
        <slot name="sub-scores"></slot>
      </div>
    `;
  }

  public constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.updateView();
  }

  private updateView() {
    if (!this.shadowRoot) {
      throw new Error(
        `${PraxisIsncsciClassification.is} :: updateView :: No shadow-root available`,
      );
    }

    this.shadowRoot.innerHTML = `${this.template()}`;
  }
}

window.customElements.define(
  PraxisIsncsciClassification.is,
  PraxisIsncsciClassification,
);
