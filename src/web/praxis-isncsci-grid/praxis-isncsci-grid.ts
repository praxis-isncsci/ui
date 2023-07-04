'use strict';

import '@web/praxis-isncsci-cell';

export class PraxisIsncsciGrid extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-grid';
  }

  private template: string = `
    <style>
    :host {
      display: block;
    }
    </style>
    <h1>ISNCSCI Grid</h1>
    <praxis-isncsci-cell></praxis-isncsci-cell>
    <praxis-isncsci-cell></praxis-isncsci-cell>
    <praxis-isncsci-cell></praxis-isncsci-cell>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(PraxisIsncsciGrid.is, PraxisIsncsciGrid);
