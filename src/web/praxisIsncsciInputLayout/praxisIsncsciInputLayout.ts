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

  public static get observedAttributes(): string[] {
    return ['readonly'];
  }

  private template: string = `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }

      [grid-section] {
        --grid-gap: var(--space-1);
        display: flex;
        justify-content: center;
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
        display: none;
        flex-grow: 1;
        padding-top: 1rem;
        position: relative;
      }

      [diagram] ::slotted([slot="key-points-diagram"]) {
        left: 50%;
        position: fixed;
        transform: translateX(-50%);
      }

      @container (min-width: 48rem) {
        [diagram] {
          display: block;
        }
      }
    </style>
    <div grid-section>
      <div right-dermatomes>
        <praxis-isncsci-grid></praxis-isncsci-grid>
        <slot name="vac"></slot>
      </div>
      <div diagram>
        <slot name="key-points-diagram"></slot>
      </div>
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
  `;

  public constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template;
  }

  private updateReadonly(readonly: boolean) {
    this.querySelectorAll('select, input, textarea').forEach((input) => {
      const attributeName =
        input instanceof HTMLSelectElement ? 'disabled' : 'readonly';

      if (readonly) {
        input.setAttributeNode(document.createAttribute(attributeName));
      } else {
        input.removeAttribute(attributeName);
      }
    });
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'readonly') {
      this.updateReadonly(newValue !== null);
    }
  }
}

window.customElements.define(
  PraxisIsncsciInputLayout.is,
  PraxisIsncsciInputLayout,
);
