import '@web/praxisIsncsciGrid';

export class PraxisIsncsciInputLayout extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-input-layout';
  }

  private template: string = `
    <style>
    :host {
      --grid-gap: 4px;
      display: flex;
      --input-layout-mobile-breakpoint: 600px;
    }

    [right-dermatomes] {
      margin-right: var(--grid-gap);
    }

    /*
    [right-dermatomes],
    [left-dermatomes] {
      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .3));
    }
    */

    [diagram] {
      background-color: #E2E2E2;
      display: none;
      flex-grow: 1;
    }

    @media (min-width: 22.5rem) {
      [diagram] {
        display: block;
      }
    }
    </style>
    <div right-dermatomes>
      <praxis-isncsci-grid></praxis-isncsci-grid>
    </div>
    <div diagram>Body diagram</div>
    <div left-dermatomes>
      <praxis-isncsci-grid left labels-hidden C5-light-touch="2" C6-pin-prick="2" C7-motor="NT"></praxis-isncsci-grid>
    </div>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(PraxisIsncsciInputLayout.is, PraxisIsncsciInputLayout);
