import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import '/assets/css/design-system.css';
import './';

import * as Primitives from 'assets/tokens/primitives.value.tokens.json';

const getColorGradient = (
  colorName: string,
  color: {[key: string]: {type: string; value: string}},
) => {
  return html`<color-gradient>
    ${Object.getOwnPropertyNames(color)
      .sort((a, b) => (parseInt(a) > parseInt(b) ? 1 : -1))
      .map(
        (variant) =>
          html`<div
            style="background-color: var(--color-${colorName}-${variant});"
          ></div>`,
      )}
  </color-gradient>`;
};

const getColorGroup = (
  colorName: string,
  color: {[key: string]: {type: string; value: string}},
) => {
  return html`<color-group>
    ${Object.getOwnPropertyNames(color)
      .sort((a, b) => (parseInt(a) > parseInt(b) ? 1 : -1))
      .map(
        (variant) => html`<color-swatch
          style="--swatch: var(--color-${colorName}-${variant})"
        >
          <div slot="variant">${variant}</div>
          <div slot="value">${color[variant].value}</div>
          <div slot="token">--color-${colorName}-${variant}</div>
        </color-swatch>`,
      )}
  </color-group>`;
};

const getColors = () => {
  return html`<style>
      h2 {
        margin-bottom: 32px;
      }

      .color-header {
        display: flex;
        margin-bottom: 24px;
      }

      .color-header h3 {
        margin-right: 24px;
        text-transform: capitalize;
      }

      .color-header color-gradient {
        flex-grow: 1;
      }

      color-group {
        margin-bottom: 80px;
      }
    </style>
    ${Object.getOwnPropertyNames(Primitives.color).map(
      (colorName) => html`
        <div class="color-header">
          <h3>${colorName}</h3>
          ${getColorGradient(colorName, Primitives.color[colorName])}
        </div>
        ${getColorGroup(colorName, Primitives.color[colorName])}
      `,
    )}`;
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
export const PrimitivesStory: Story = {};
