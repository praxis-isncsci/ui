/**
 * @tagname regular-close-20
 */
export class RegularClose20 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-20';
  }

  private template: string = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.5 4.5L15.5 15.5M15.5 4.5L4.5 15.5" stroke="black" stroke-width="1.5"/>
  </svg>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose20.is, RegularClose20);
