import {html} from 'lit';
import type {Args, Meta, StoryObj} from '@storybook/web-components';
import {PraxisIsncsciTotals} from './praxisIsncsciTotals';

const getArgTypes = () => {
  const argTypes = {};
  PraxisIsncsciTotals.observedAttributes.forEach((attribute) => {
    argTypes[attribute] = {control: {type: 'text'}};
  });

  return argTypes;
};

const getArgs = () => {
  const args = {};
  PraxisIsncsciTotals.observedAttributes.forEach((attribute) => {
    args[attribute] = '';
  });

  return args;
};

const getTemplateAttributes = (args: Args) => {
  const attributes = Object.getOwnPropertyNames(args)
    .map((attribute) => `${attribute}="${args[attribute]}"`)
    .join(' ');
  return attributes;
};

const getTemplate = (args) =>
  html`
    <praxis-isncsci-totals
      asia-impairment-scale="${args['asia-impairment-scale']}"
      injury-complete="${args['injury-complete']}"
      left-light-touch-total="${args['left-light-touch-total']}"
      left-lower-motor-total="${args['left-lower-motor-total']}"
      left-motor="${args['left-motor']}"
      left-motor-total="${args['left-motor-total']}"
      left-motor-zpp="${args['left-motor-zpp']}"
      left-pin-prick-total="${args['left-pin-prick-total']}"
      left-sensory="${args['left-sensory']}"
      left-sensory-zpp="${args['left-sensory-zpp']}"
      left-touch-total="${args['left-touch-total']}"
      left-upper-motor-total="${args['left-upper-motor-total']}"
      lower-motor-total="${args['lower-motor-total']}"
      neurological-level-of-injury="${args['neurological-level-of-injury']}"
      pin-prick-total="${args['pin-prick-total']}"
      right-light-touch-total="${args['right-light-touch-total']}"
      right-lower-motor-total="${args['right-lower-motor-total']}"
      right-motor="${args['right-motor']}"
      right-motor-total="${args['right-motor-total']}"
      right-motor-zpp="${args['right-motor-zpp']}"
      right-pin-prick-total="${args['right-pin-prick-total']}"
      right-sensory="${args['right-sensory']}"
      right-sensory-zpp="${args['right-sensory-zpp']}"
      right-touch-total="${args['right-touch-total']}"
      right-upper-motor-total="${args['right-upper-motor-total']}"
      touch-total="${args['touch-total']}"
      upper-motor-total="${args['upper-motor-total']}"
    ></praxis-isncsci-totals>
  `;

const meta = {
  title: 'WebComponents/PraxisIsncsciTotals',
  component: 'praxis-isncsci-totals',
  argTypes: getArgTypes(),
  args: getArgs(),
  // tags: ['autodocs'],
  render: getTemplate,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
