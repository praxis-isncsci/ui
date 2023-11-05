import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';
import {getAppLayoutTemplate} from './appLayoutTemplate';

import '@web/praxisIsncsciAppBar';
import '@web/praxisIsncsciDialogHeader';
import '@web/praxisIsncsciAppLayout';
import '@web/praxisIsncsciIcon';
import '@web/praxisIsncsciInputLayout';
import '@web/praxisIsncsciClassification';

const styles = html`
  <style>
    #root-inner {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    praxis-isncsci-app-layout {
      flex-grow: 1;
    }
  </style>
`;

const meta = {
  title: 'WebComponents/PraxisIsncsciAppLayout',
  args: {
    classificationStyle: '',
  },
  argTypes: {
    classificationStyle: {
      control: 'select',
      options: ['', 'visible', 'static'],
    },
  },
  parameters: {layout: 'fullscreen'},
  render: (args) =>
    html`${styles}${unsafeHTML(
      getAppLayoutTemplate(args.classificationStyle, 'assets/icons'),
    )}`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
