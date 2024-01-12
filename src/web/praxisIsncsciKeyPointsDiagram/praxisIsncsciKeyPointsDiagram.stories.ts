import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';

import './praxisIsncsciKeyPointsDiagram';

const meta = {
  title: 'WebComponents/Key points diagram',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html`<praxis-isncsci-key-points-diagram></praxis-isncsci-key-points-diagram>`,
};
