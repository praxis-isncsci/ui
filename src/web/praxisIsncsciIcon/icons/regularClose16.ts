/**
 * @tagname regular-close-16
 */
export class RegularClose16 extends HTMLElement {
  public static get is(): string {
    return 'regular-close-16';
  }

  private template: string = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 3L13 13M13 3L3 13" stroke="black" stroke-width="1.5"/>
  </svg>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(RegularClose16.is, RegularClose16);
