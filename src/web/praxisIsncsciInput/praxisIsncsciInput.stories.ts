import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';

import './praxisIsncsciInput';

import 'assets/css/_buttons.css';

const meta = {
  title: 'WebComponents/ISNCSCI Input',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () => html`<praxis-isncsci-input></praxis-isncsci-input>`,
};
