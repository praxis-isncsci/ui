'use strict';

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
        /*backdrop-filter: blur(150px);*/
        box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
        border: solid .5px rgba(0, 0, 0, .2);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        min-height: 32px;
        min-width: 32px;
      }

      :host([selected]) {
        transform: scale(1.1);
      }
    </style>
    <slot></slot>
  `;

  private messageElement: HTMLElement | null = null;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
    namespace: string,
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
