/**
 * @tagname praxis-isncsci-app-layout
 */
export class PraxisIsncsciAppLayout extends HTMLElement {
  public static get is() {
    return 'praxis-isncsci-app-layout';
  }

  public static get observedAttributes() {
    return ['readonly'];
  }

  private template() {
    return `
      <style>
        :host {
          container-type: inline-size;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        :host([no-app-bar]) :has(> [name=app-bar]){
          display: none;
        }

        :host([classification-style="visible"]) :has(> [name=classification]),
        :host([classification-style="static"]) :has(> [name=classification]) {
          display: flex;
          flex-direction: column;
        }

        :host([classification-style="static"]) :has(> [name=classification]) {
          position: static;
        }

        :host([classification-style="static"]) :has(> [name=input-layout]) {
          height: auto;
        }

        :host([readonly]) :has(> [name=input-controls]) {
          display: none;
        }

        :has(> [name=app-bar]) {
          order: 1;
        }

        .scrollable-content {
          flex-grow: 1;
          order: 2;
          overflow-y: auto;
          padding: 16px 0;
        }

        :has(> [name=input-controls]) {
          order: 3;
        }

        :has(> [name=classification]) {
          bottom: 0;
          display: none;
          left: 0;
          order: 4;
          position: absolute;
          right: 0;
          top: 0;
          z-index: var(--classification-z-index, 1);
        }

        ::slotted([slot="classification"]) {
          flex-grow: 1;
        }

        @container (min-width: 48rem) {
          .scrollable-content {
            order: 3;
          }

          :has(> [name=input-controls]) {
            order: 2;
          }

          :host([classification-style="visible"]) .scrollable-content {
            padding-bottom: var(--calc-classification-height, 400px);
          }

          :has(> [name=classification]) {
            top: auto;
          }
        }
      </style>
      <div><slot name="app-bar"></slot></div>
      <div class="scrollable-content">
        <slot name="input-layout"></slot>
      </div>
      <div><slot name="input-controls"></slot></div>
      <div><slot name="classification"></slot></div>
    `;
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template();
  }

  private updateReadonly(readonly: boolean) {
    const inputLayout = this.querySelector('[slot="input-layout"]');

    if (!inputLayout) {
      return;
    }

    if (readonly) {
      inputLayout.setAttributeNode(document.createAttribute('readonly'));
    } else {
      inputLayout.removeAttribute('readonly');
    }
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'readonly') {
      this.updateReadonly(newValue !== null);
    }
  }
}

window.customElements.define(PraxisIsncsciAppLayout.is, PraxisIsncsciAppLayout);
