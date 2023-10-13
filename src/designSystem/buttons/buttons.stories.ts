import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import '@web/praxisIsncsciIcon';

import 'assets/css/_buttons.css';

const meta = {
  title: 'DesignSystem/Buttons',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Button: Story = {
  render: () =>
    html`<button class="button icon-button">
        <praxis-isncsci-icon
          href="assets/icons/regular.svg#icon-close-24"
          size="24"
        ></praxis-isncsci-icon>
      </button>
      <button class="button">Button</button>
      <button class="button">
        <praxis-isncsci-icon
          href="assets/icons/regular.svg#icon-close-24"
          size="24"
        ></praxis-isncsci-icon
        >ABC
      </button>
      <a href="#" class="button"><span>Link button</span></a>`,
};

export const IconButton: Story = {
  args: {
    variant: 'md',
  },
  argTypes: {
    variant: {control: 'select', options: ['md', 'sm']},
  },
  render: (args) =>
    args.variant === 'md'
      ? html`<button class="button icon-button">
          <praxis-isncsci-icon
            href="assets/icons/regular.svg#icon-close-32"
            size="32"
          ></praxis-isncsci-icon>
        </button>`
      : html`<button class="button icon-button sm">
          <praxis-isncsci-icon
            href="assets/icons/regular.svg#icon-close-24"
            size="24"
          ></praxis-isncsci-icon>
        </button>`,
};
