/**
 * @tagname praxis-isncsci-app-layout
 */
export class PraxisIsncsciAppLayout extends HTMLElement {
  public static get is() {
    return 'praxis-isncsci-app-layout';
  }

  private template() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        :host([classification-style="static"]) {
          overflow: visible;
          overflow-y: scroll;
        }
        
        :host([classification-style="visible"]) :has(> [name="classification"]) {
          display: block;
        }

        :host([classification-style="static"]) :has(> [name="classification"]) {
          display: block;
          position: static;
        }

        :host([classification-style="visible"]) :has(> [name="input-layout"]) {
          padding-bottom: var(--calc-classification-height, 0);
        }

        :host([classification-style="static"]) :has(> [name="input-layout"]) {
          overflow-y: visible;
        }

        :has(> [name="classification"]) {
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        :has(> [name="input-layout"]) {
          overflow-y: auto;
        }
      </style>
      <div>
        <slot name="app-bar"></slot>
      </div>
      <div content>
        <slot name="input-layout"></slot>
      </div>
      <div>
        <slot name="classification"></slot>
      </div>
    `;
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(PraxisIsncsciAppLayout.is, PraxisIsncsciAppLayout);
