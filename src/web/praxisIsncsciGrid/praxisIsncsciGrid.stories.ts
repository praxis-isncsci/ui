import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './praxisIsncsciGrid';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'Example/PraxisIsncsciGrid',
  tags: ['autodocs'],
  render: () => html`<praxis-isncsci-grid></praxis-isncsci-grid>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
