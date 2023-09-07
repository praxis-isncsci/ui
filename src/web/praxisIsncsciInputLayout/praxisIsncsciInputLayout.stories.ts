import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './praxisIsncsciInputLayout';
import '/assets/css/design-system.css';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'Example/PraxisIsncsciInputLayout',
  tags: ['autodocs'],
  render: () => html`<praxis-isncsci-input-layout></praxis-isncsci-grid-input-layout>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
