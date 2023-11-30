import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import '/assets/css/_tokens.css';

const getShadows = () => {
  return html`
    <div>
      <style>
        .shadows {
          align-items: center;
          display: grid;
          grid-gap: 0.5rem;
          grid-template-columns: repeat(2, minmax(min-content, max-content));
        }

        .shadow {
          background-color: #fff;
          border-radius: 0.5rem;
          height: 3.125rem;
          margin: 2rem;
          width: 3.125rem;
        }

        .description {
          color: #666;
          font-family: sans-serif;
          font-size: 1.5rem;
          font-weight: 100;
        }
      </style>
      <div class="shadows">
        <!-- Inset small -->
        <div class="shadow" style="box-shadow: var(--shadow-inset-small)"></div>
        <div class="description">Inset small</div>
        <!-- Inset medium-->
        <div
          class="shadow"
          style="box-shadow: var(--shadow-inset-medium)"
        ></div>
        <div class="description">Inset medium</div>
        <!-- Inset large-->
        <div class="shadow" style="box-shadow: var(--shadow-inset-large)"></div>
        <div class="description">Inset large</div>
        <!-- None-->
        <div class="shadow" style="box-shadow: var(--shadow-none)"></div>
        <div class="description">None</div>
        <!-- Extra small-->
        <div class="shadow" style="box-shadow: var(--shadow-extra-small)"></div>
        <div class="description">Extra small</div>
        <!-- Medium -->
        <div class="shadow" style="box-shadow: var(--shadow-medium)"></div>
        <div class="description">Medium</div>
        <!-- Large -->
        <div class="shadow" style="box-shadow: var(--shadow-large)"></div>
        <div class="description">Large</div>
        <!-- Extra large -->
        <div class="shadow" style="box-shadow: var(--shadow-extra-large)"></div>
        <div class="description">Extra large</div>
        <!-- XXL -->
        <div class="shadow" style="box-shadow: var(--shadow-xxl)"></div>
        <div class="description">XXL</div>
      </div>
    </div>
  `;
};

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'DesignSystem/Shadows',
  // tags: ['autodocs'],
  render: () => getShadows(),
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
