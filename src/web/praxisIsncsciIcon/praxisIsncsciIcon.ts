/**
 * @tagname praxis-isncsci-icon
 */
export class PraxisIsncsciIcon extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-icon';
  }

  public static get observedAttributes(): string[] {
    return ['component'];
  }

  private template = (component: string): string => `
    <style>
      :host {
        --placeholder-border-radius: 4px;
        display: inline-block;
        color: red;
      }

      .placeholder {
        border-radius: var(--placeholder-border-radius);
        border: 1px solid #ccc;
        display: inline-block;
        height: 1em;
        width: 1em;
      }
    </style>
    ${component}
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template('<span class="placeholder"></span>');
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) {
      return;
    }

    if ('component' === name && this.shadowRoot) {
      this.shadowRoot.innerHTML = this.template(`<${newValue}></${newValue}>`);
    }
  }
}

window.customElements.define(PraxisIsncsciIcon.is, PraxisIsncsciIcon);
