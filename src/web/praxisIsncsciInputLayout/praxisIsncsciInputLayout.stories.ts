import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './praxisIsncsciInputLayout';
import '/assets/css/design-system.css';

const meta = {
  title: 'WebComponents/PraxisIsncsciInputLayout',
  tags: ['autodocs'],
  render: () =>
    html`
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
    </praxis-isncsci-grid-input-layout>
    `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
