import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';

import './praxisIsncsciInput';

import 'assets/css/_buttons.css';
import {getIsncsciInputTemplate} from '@web/praxisIsncsciAppLayout/appLayoutTemplate';

const meta = {
  title: 'WebComponents/ISNCSCI Input',
} satisfies Meta;

export default meta;
type Story = StoryObj;

const styles = html`
  <style>
    #root-inner {
      container-type: inline-size;
    }
  </style>
`;

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
    disabled: false,
    selectedValue: '',
    showStarInput: false,
    showUnknown: false,
  },
  argTypes: {
    disabled: {control: 'boolean'},
    selectedValue: {control: 'select', options: sensoryValues},
    showStarInput: {control: 'boolean'},
    showUnknown: {control: 'boolean'},
  },
  render: (args) =>
    html`${styles}${unsafeHTML(
      getIsncsciInputTemplate(
        args.disabled,
        args.selectedValue,
        args.showStarInput,
        args.showUnknown,
        true,
      ),
    )}`,
};

export const Motor: Story = {
  args: {
    disabled: false,
    selectedValue: '',
    showStarInput: false,
    showUnknown: false,
  },
  argTypes: {
    disabled: {control: 'boolean'},
    selectedValue: {control: 'select', options: motorValues},
    showStarInput: {control: 'boolean'},
    showUnknown: {control: 'boolean'},
  },
  render: (args) =>
    html`${styles}${unsafeHTML(
      getIsncsciInputTemplate(
        args.disabled,
        args.selectedValue,
        args.showStarInput,
        args.showUnknown,
        false,
      ),
    )}`,
};
