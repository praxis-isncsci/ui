import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import '/assets/css/design-system.css';
import  './';

import * as Primitives from 'assets/tokens/primitives.value.tokens.json';

const getColorGroup = (colorName: string, color: {[key: string]: {type: string, value: string}}) => {
  return html`<color-group>
    ${Object.getOwnPropertyNames(color)
      .sort((a, b) => parseInt(a) > parseInt(b) ? 1 : -1)
      .map((variant) => html`
        <color-swatch style="--swatch: var(--color-${colorName}-${variant})">
          <div slot="variant">${variant}</div>
          <div slot="value">${color[variant].value}</div>
          <div slot="token">--color-${colorName}-${variant}</div>
        </color-swatch>`)}
  </color-group>`;
};

const getColors = () => {
  return html`<div>
    <h2>Colors</h2>
    <div>
      ${Object.getOwnPropertyNames(Primitives.color)
        .map((colorName) => html`
          <h3>${colorName}</h3>
          ${getColorGroup(colorName, Primitives.color[colorName])}
        `)
      }
    </div>
  </div>`;
};

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'DesignSystem/Color',
  // tags: ['autodocs'],
  render: () => getColors(),
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
