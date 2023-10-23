import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';

import '@web/praxisIsncsciAppBar';
import '@web/praxisIsncsciIcon';

import 'assets/css/_buttons.css';

const iconsPath = 'assets/icons';

const meta = {
  title: 'WebComponents/App bar',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html` <div
      app-bar-container
      style="box-shadow:0 2px 4px rgba(0, 0, 0, 0.16)"
    >
      <praxis-isncsci-app-bar>
        <button class="button icon-button" slot="menu-button">
          <praxis-isncsci-icon
            href="${iconsPath}/regular.svg#icon-hamburger-menu-24"
            size="24"
          ></praxis-isncsci-icon>
        </button>
        <h1 slot="title">Praxis ISNCSCI</h1>
        <div slot="actions">
          <button class="button">
            <praxis-isncsci-icon
              href="${iconsPath}/regular.svg#icon-calculator-24"
              size="24"
            ></praxis-isncsci-icon>
            Calculate
          </button>
        </div>
      </praxis-isncsci-app-bar>
    </div>`,
};
