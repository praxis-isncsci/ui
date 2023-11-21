import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './praxisIsncsciGrid';

const points = ['right-light-touch-c5', 'right-pin-prick-c6', 'right-motor-c7'];

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'WebComponents/PraxisIsncsciGrid',
  args: {
    highlightedCells: [],
    labelsHidden: false,
    left: false,
  },
  argTypes: {
    highlightedCells: {control: 'multi-select', options: points},
    labelsHidden: {control: 'boolean'},
    left: {control: 'boolean'},
  },
  render: (args) =>
    html`<praxis-isncsci-grid
      highlighted-cells="${args.highlightedCells.join('|')}"
      ?labels-hidden="${args.labelsHidden}"
      ?left="${args.left}"
    ></praxis-isncsci-grid>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
