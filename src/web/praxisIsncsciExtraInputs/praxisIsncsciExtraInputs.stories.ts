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
          <option value="C5">C5</option>
        </select>
        <label for="left-lowest" slot="left-lowest-label">Left:</label>
        <select name="left-lowest" id="left-lowest" slot="left-lowest">
          <option value="None"></option>
          <option value="C5">C5</option>
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
