import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';

import '../../../assets/css/_tokens.css';
import '../../../assets/css/_text-scale.css';
import '../../../assets/css/_classification-total.css';
import './praxisIsncsciClassificationTotal';

const meta = {
  title: 'WebComponents/Classification Total',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () => html`
    <praxis-isncsci-classification-total
      >C7</praxis-isncsci-classification-total
    >
  `,
};
