import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';
import '@web/praxisIsncsciExtraInputs';

import 'assets/css/_extra-inputs.css';

const meta = {
  title: 'WebComponents/PraxisIsncsciExtraInputs',
  render: () =>
    html`
      <style>
        #root-inner {
          container-type: inline-size;
        }
      </style>
      <praxis-isncsci-extra-inputs>
        <div slot="non-key-muscles-header">
          Lowest non-key muscle with motor function
        </div>
        <label for="right-lowest" slot="right-lowest-label">Right:</label>
        <select name="right-lowest" id="right-lowest" slot="right-lowest">
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
    `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
