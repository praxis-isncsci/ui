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
      <div slot="non-key-muscles-header">
        Lowest non-key muscle with motor function
      </div>
      <label for="right-lowest" slot="right-lowest-label">Right:</label>
      <select name="right-lowest" id="right-lowest" slot="right-lowest">
        <option value="0"></option>
        <option value="4">C5 - Shoulder: Flexion, extension, abduction, adduction, internal and external rotation - Elbow: Supination</option>
        <option value="5">C6 - Elbow: Pronation - Wrist: Flexion</option>
        <option value="6">C7 - Finger: Flexion at proximal joint, extension. Thumb: Flexion, extension and abduction in plane of thumb</option>
        <option value="7">C8 - Finger: Flexion at MCP joint Thumb: Opposition, adduction and abduction perpendicular to palm</option>
        <option value="8">T1 - Finger: Abduction of the index finger</option>
        <option value="21">L2 - Hip: Adduction</option>
        <option value="22">L3 - Hip: External rotation</option>
        <option value="23">L4 - Hip: Extension, abduction, internal rotation - Knee: Flexion - Ankle: Inversion and eversion - Toe: MP and IP extension</option>
        <option value="24">L5 - Hallux and Toe: DIP and PIP flexion and abduction</option>
        <option value="25">S1 - Hallux: Adduction</option>
      </select>
      <label for="left-lowest" slot="left-lowest-label">Left:</label>
      <select name="left-lowest" id="left-lowest" slot="left-lowest">
        <option value="None"></option>
        <option value="0"></option>
        <option value="4">C5 - Shoulder: Flexion, extension, abduction, adduction, internal and external rotation - Elbow: Supination</option>
        <option value="5">C6 - Elbow: Pronation - Wrist: Flexion</option>
        <option value="6">C7 - Finger: Flexion at proximal joint, extension. Thumb: Flexion, extension and abduction in plane of thumb</option>
        <option value="7">C8 - Finger: Flexion at MCP joint Thumb: Opposition, adduction and abduction perpendicular to palm</option>
        <option value="8">T1 - Finger: Abduction of the index finger</option>
        <option value="21">L2 - Hip: Adduction</option>
        <option value="22">L3 - Hip: External rotation</option>
        <option value="23">L4 - Hip: Extension, abduction, internal rotation - Knee: Flexion - Ankle: Inversion and eversion - Toe: MP and IP extension</option>
        <option value="24">L5 - Hallux and Toe: DIP and PIP flexion and abduction</option>
        <option value="25">S1 - Hallux: Adduction</option>
      </select>
      </div>
      <label for="comments" slot="comments-label">Comments:</label>
      <textarea name="comments" id="comments" slot="comments"></textarea>
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
