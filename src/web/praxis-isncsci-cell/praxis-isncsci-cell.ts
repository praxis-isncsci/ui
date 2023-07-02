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
      border: solid 1px #999;
      display: block;
      height: 40px;
      width: 48px;
    }
    </style>
  `;

  private messageElement: HTMLElement;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;

    const messageElement = shadowRoot.querySelector('[bind-to=message]') as HTMLElement;

    if (!messageElement) {
      throw new Error('Message element not available');
    }

    this.messageElement = messageElement;
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

    if (name === 'message') {
      this.messageElement.textContent = newValue;
      return;
    }
  }
}

window.customElements.define(PraxisIsncsciCell.is, PraxisIsncsciCell);
