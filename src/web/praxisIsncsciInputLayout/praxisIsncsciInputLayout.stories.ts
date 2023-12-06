import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './praxisIsncsciInputLayout';
import '/assets/css/design-system.css';

const meta = {
  title: 'WebComponents/PraxisIsncsciInputLayout',
  tags: ['autodocs'],
  render: () =>
    html`
    <style>
      #root-inner {
        container-type: inline-size;
      }
    </style>
    <praxis-isncsci-input-layout>
      <div slot="vac" class="anal-function right">
          <label for="vac"><span class="intermittent">(</span>VAC<span class="intermittent">) Voluntary anal contraction</span></label>
          <select name="dap" id="dap">
            <option value=""></option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="nt">NT</option>
          </select>
      </div>
      <div slot="dap" class="anal-function">
        <select name="dap" id="dap">
          <option value="None"></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="NT">NT</option>
        </select>
        <label for="dap"><span class="intermittent">(</span>DAP<span class="intermittent">) Deep anal pressure</span></label>
      </div>
      <div slot="non-key-muscles-header">
        Lowest non-key muscle with motor function
      </div>
      <label for="right-lowest" slot="right-lowest-label">Right:</label>
      <select name="right-lowest" id="right-lowest" slot="right-lowest">
        <option value="None"></option>
        <option value="C5">C5 - Shoulder: Flexion, extension, abduction, adduction, internal and external rotation - Elbow: Supination</option>
        <option value="C6">C6 - Elbow: Pronation - Wrist: Flexion</option>
        <option value="C7">C7 - Finger: Flexion at proximal joint, extension. Thumb: Flexion, extension and abduction in plane of thumb</option>
        <option value="C8">C8 - Finger: Flexion at MCP joint Thumb: Opposition, adduction and abduction perpendicular to palm</option>
        <option value="T1">T1 - Finger: Abduction of the index finger</option>
        <option value="L2">L2 - Hip: Adduction</option>
        <option value="L3">L3 - Hip: External rotation</option>
        <option value="L4">L4 - Hip: Extension, abduction, internal rotation - Knee: Flexion - Ankle: Inversion and eversion - Toe: MP and IP extension</option>
        <option value="L5">L5 - Hallux and Toe: DIP and PIP flexion and abduction</option>
        <option value="S1">S1 - Hallux: Adduction</option>
      </select>
      <label for="left-lowest" slot="left-lowest-label">Left:</label>
      <select name="left-lowest" id="left-lowest" slot="left-lowest">
        <option value="None"></option>
        <option value="C5">C5 - Shoulder: Flexion, extension, abduction, adduction, internal and external rotation - Elbow: Supination</option>
        <option value="C6">C6 - Elbow: Pronation - Wrist: Flexion</option>
        <option value="C7">C7 - Finger: Flexion at proximal joint, extension. Thumb: Flexion, extension and abduction in plane of thumb</option>
        <option value="C8">C8 - Finger: Flexion at MCP joint Thumb: Opposition, adduction and abduction perpendicular to palm</option>
        <option value="T1">T1 - Finger: Abduction of the index finger</option>
        <option value="L2">L2 - Hip: Adduction</option>
        <option value="L3">L3 - Hip: External rotation</option>
        <option value="L4">L4 - Hip: Extension, abduction, internal rotation - Knee: Flexion - Ankle: Inversion and eversion - Toe: MP and IP extension</option>
        <option value="L5">L5 - Hallux and Toe: DIP and PIP flexion and abduction</option>
        <option value="S1">S1 - Hallux: Adduction</option>
      </select>
      <label for="comments" slot="comments-label">Comments:</label>
      <textarea name="comments" id="comments" slot="comments"></textarea>
    </praxis-isncsci-grid-input-layout>
    `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
