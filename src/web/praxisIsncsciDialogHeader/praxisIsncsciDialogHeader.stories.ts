import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';

import '@web/praxisIsncsciIcon';
import '@web/praxisIsncsciDialogHeader';

import 'assets/css/_tokens.css';
import 'assets/css/_buttons.css';
import 'assets/css/_dialog-header.css';

const iconsPath = 'assets/icons';

const meta = {
  title: 'WebComponents/Dialog header',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html` <div
      dialog-header-container
      style="box-shadow:0 2px 4px rgba(0, 0, 0, 0.16)"
    >
      <praxis-isncsci-dialog-header>
        <h2 slot="title">Classification</h2>
        <div slot="close">
          <button class="button icon-button">
            <praxis-isncsci-icon
              href="${iconsPath}/regular.svg#icon-close-24"
              size="24"
            ></praxis-isncsci-icon>
          </button>
        </div>
      </praxis-isncsci-dialog-header>
    </div>`,
};
