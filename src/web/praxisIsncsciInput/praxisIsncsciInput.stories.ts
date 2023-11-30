import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';

import './praxisIsncsciInput';

import 'assets/css/_buttons.css';

const meta = {
  title: 'WebComponents/ISNCSCI Input',
} satisfies Meta;

export default meta;
type Story = StoryObj;

const motorValues = [
  '0',
  '0*',
  '1',
  '1*',
  '2',
  '2*',
  '3',
  '3*',
  '4',
  '4*',
  '5',
  'NT',
  'NT*',
];
const sensoryValues = ['0', '0*', '1', '1*', '2', 'NT', 'NT*'];

export const Sensory: Story = {
  args: {
    selectedValue: '',
  },
  argTypes: {
    selectedValue: {control: 'select', options: sensoryValues},
  },
  render: (args) =>
    html`<praxis-isncsci-input
      sensory
      selected-value="${args.selectedValue}"
    ></praxis-isncsci-input>`,
};

export const Motor: Story = {
  args: {
    selectedValue: '',
  },
  argTypes: {
    selectedValue: {control: 'select', options: motorValues},
  },
  render: (args) =>
    html`<praxis-isncsci-input
      selected-value="${args.selectedValue}"
    ></praxis-isncsci-input>`,
};
