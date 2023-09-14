/**
 * @tagname color-group
 */
export class ColorGroup extends HTMLElement {
  public static get is(): string {
    return 'color-group';
  }

  private template: string = `
    <style>
      :host {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fill, 124px);
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

window.customElements.define(ColorGroup.is, ColorGroup);
