/**
 * @tagname praxis-isncsci-cell
 */
export class PraxisIsncsciCell extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-cell';
  }

  public static get observedAttributes(): string[] {
    return ['message'];
  }

  private template: string = `
    <style>
      :host {
        align-items: center;
        background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8));
        box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
        border: solid .5px #525252;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        gap: 1px;
        justify-content: center;
        min-height: 32px;
        min-width: 32px;
        transition: transform .3s ease-in-out, border-color .3s ease-in-out;
        user-select: none;
      }

      :host([highlighted]) {
        transform: scale(1.1);
        border: solid 1px var(--highlighted-cell-border-color, orange);
      }

      :host([error]) {
        background-color: var(--error, rgba(184, 69, 28, 0.1));
        color: var(--on-error, #682710);
      }

      :host([error])::before {
        content: '!';
        font-size: 0.5rem;
        font-weight: bold;
        display: inline-block;
        border: solid 0.03125rem var(--on-error, #682710);
        width: 10px;
        height: 10px;
        line-height: 10px;
        border-radius: 5px;
        text-align: center;
      }
    </style>
    <slot></slot>
  `;

  private messageElement: HTMLElement | null = null;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'message' && this.messageElement) {
      this.messageElement.textContent = newValue;
      return;
    }
  }
}

window.customElements.define(PraxisIsncsciCell.is, PraxisIsncsciCell);
