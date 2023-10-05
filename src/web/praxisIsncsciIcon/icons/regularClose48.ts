/**
 * @tagname regular-close-48
 */
export class RegularClose48 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-48';
  }

  private template: string = `
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10L38 38M38 10L10 38" stroke="black" stroke-width="2"/>
  </svg>  
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose48.is, RegularClose48);
