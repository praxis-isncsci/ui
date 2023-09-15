/**
 * @tagname color-gradient
 */
export class ColorGradient extends HTMLElement {
  public static get is(): string {
    return 'color-gradient';
  }

  private template: string = `
    <style>
      :host {
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
        display: grid;
        gap: 0;
        grid-template-columns: repeat(auto-fit, minmax(16px, 1fr));
        overflow: hidden;
      }
    </style>
    <slot></slot>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(ColorGradient.is, ColorGradient);
