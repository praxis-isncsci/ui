import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';

import '@web/praxisIsncsciCell';
import '@web/praxisIsncsciIcon';

import 'assets/css/_cell.css';

const meta = {
  title: 'WebComponents/Input cell',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html`<praxis-isncsci-cell style="width:45px">2</praxis-isncsci-cell>`,
};

export const Highlighted: Story = {
  render: () =>
    html`<praxis-isncsci-cell highlighted style="width:45px"
      >2</praxis-isncsci-cell
    >`,
};
