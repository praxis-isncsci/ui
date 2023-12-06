import '@web/praxisIsncsciExtraInputs';
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
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
      padding-bottom: 120px;
      position: relative;
    }

    [grid-section] {
      --grid-gap: var(--space-1);
      display: flex;
      --input-layout-mobile-breakpoint: 600px;
    }

    [right-dermatomes],
    [left-dermatomes] {
      display: flex;
      flex-direction: column;
    }

    [right-dermatomes] {
      align-items: end;
      margin-right: var(--grid-gap);
    }

    [left-dermatomes] {
      align-items: start;
      margin-left: var(--grid-gap);
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
        <slot name="vac"></slot>
      </div>
      <div diagram>Body diagram</div>
      <div left-dermatomes>
        <praxis-isncsci-grid left></praxis-isncsci-grid>
        <slot name="dap"></slot>
      </div>
    </div>
    <praxis-isncsci-extra-inputs>
      <slot name="non-key-muscles-header" slot="non-key-muscles-header"></slot>
      <slot name="right-lowest-label" slot="right-lowest-label"></slot>
      <slot name="right-lowest" slot="right-lowest"></slot>
      <slot name="left-lowest-label" slot="left-lowest-label"></slot>
      <slot name="left-lowest" slot="left-lowest"></slot>
      <slot name="comments-label" slot="comments-label"></slot>
      <slot name="comments" slot="comments"></slot>
    </praxis-isncsci-extra-inputs>
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
