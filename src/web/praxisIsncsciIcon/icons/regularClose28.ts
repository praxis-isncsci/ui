/**
 * @tagname regular-close-28
 */
export class RegularClose28 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-28';
  }

  private template: string = `
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 5.5L22.5 22.5M22.5 5.5L5.5 22.5" stroke="black" stroke-width="2"/>
  </svg>  
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose28.is, RegularClose28);
