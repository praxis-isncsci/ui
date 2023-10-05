/**
 * @tagname regular-close-12
 */
export class RegularClose12 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-12';
  }

  private template: string = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.5 2.5L2.5 9.5M2.5 2.5L9.5 9.5" stroke="black"/>
  </svg>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose12.is, RegularClose12);
