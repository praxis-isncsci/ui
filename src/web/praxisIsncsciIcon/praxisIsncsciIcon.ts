/**
 * @tagname praxis-isncsci-icon
 */
export class PraxisIsncsciIcon extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-icon';
  }

  public static get observedAttributes(): string[] {
    return ['href', 'size'];
  }

  private template = (href: string, size: string): string => `
    <style>
      :host {
        align-items: center;
        display: inline-flex;
        justify-content: center;
      }
    </style>
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <use xlink:href="${href}"></use>
    </svg>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) {
      return;
    }

    if (/^(href|size)$/.test(name) && this.shadowRoot) {
      this.shadowRoot.innerHTML = this.template(
        this.getAttribute('href') || '',
        this.getAttribute('size') || '24',
      );
    }
  }
}

window.customElements.define(PraxisIsncsciIcon.is, PraxisIsncsciIcon);
