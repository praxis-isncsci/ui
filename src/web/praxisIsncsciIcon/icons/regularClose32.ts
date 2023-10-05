/**
 * @tagname regular-close-32
 */
export class RegularClose32 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-32';
  }

  private template: string = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 7L7 25" stroke="black" stroke-width="2.5"/>
    <path d="M7 7L25 25" stroke="black" stroke-width="2.5"/>
    </svg>  
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose32.is, RegularClose32);
