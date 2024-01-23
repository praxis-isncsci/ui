import '@web/praxisIsncsciIcon';

/**
 * @tagname praxis-isncsci-app-bar
 */
export class PraxisIsncsciAppBar extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-app-bar';
  }

  private template() {
    return `
      <style>
        :host {
          align-items: center;
          background: var(--background, rgba(255, 255, 255, 0.1));
          box-shadow: var(--box-shadow, 0 0 0.125rem rgba(95, 24, 119, 0.24));
          display: flex;
          flex-direction: row;
          gap: var(--gap, 1.25rem);
          height: var(--height, 3.5rem);
          padding: var(--padding, 0.75rem);
        }

        ::slotted([slot="title"]) {
          flex-grow: 1;
          font-family: var(--title-font-family, sans-serif);
          font-size: var(--title-font-size, 1rem);
          font-weight: var(--title-font-weight, 400);
          line-height: var(--title-line-height, 1.375rem);
        }
      </style>
      <slot name="menu-button"></slot>
      <slot name="title"></slot>
      <slot name="actions"></slot>
    `;
  }

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }
}

window.customElements.define(PraxisIsncsciAppBar.is, PraxisIsncsciAppBar);
