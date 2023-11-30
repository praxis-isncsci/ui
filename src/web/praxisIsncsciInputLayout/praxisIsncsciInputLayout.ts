import '@web/praxisIsncsciGrid';
import '@web/praxisIsncsciInput';

/**
 * @tagname praxis-isncsci-input-layout
 */
export class PraxisIsncsciInputLayout extends HTMLElement {
  public static get is(): string {
    return 'praxis-isncsci-input-layout';
  }

  private template: string = `
    <style>
    :host {
      display: block;
      padding-bottom: 120px;
      position: relative;
    }

    [grid-section] {
      --grid-gap: 4px;
      display: flex;
      --input-layout-mobile-breakpoint: 600px;
    }

    [right-dermatomes] {
      margin-right: var(--grid-gap);
    }

    [diagram] {
      background-color: #E2E2E2;
      display: none;
      flex-grow: 1;
    }

    praxis-isncsci-input {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    @media (min-width: 22.5rem) {
      :host {
        padding-bottom: 0;
        padding-top: 120px;
      }
      
      [diagram] {
        display: block;
      }

      praxis-isncsci-input {
        bottom: auto;
        top: 0;
      }
    }
    </style>
    <div grid-section>
      <div right-dermatomes>
        <praxis-isncsci-grid></praxis-isncsci-grid>
      </div>
      <div diagram>Body diagram</div>
      <div left-dermatomes>
        <praxis-isncsci-grid left></praxis-isncsci-grid>
      </div>
    </div>
    <praxis-isncsci-input disabled></praxis-isncsci-input>
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }
}

window.customElements.define(
  PraxisIsncsciInputLayout.is,
  PraxisIsncsciInputLayout,
);
