/**
 * @tagname regular-close-24
 */
export class RegularClose24 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-24';
  }

  private template: string = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5L5 19M5 5L19 19" stroke="black" stroke-width="2"/>
    </svg>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose24.is, RegularClose24);
