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

import 'assets/css/design-system.css';

const styles = html`
  <style>
    #root-inner {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    #root-inner:has(praxis-isncsci-app-layout[classification-style='static']) {
      height: auto;
      overflow: visible;
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
    readonly: false,
  },
  argTypes: {
    classificationStyle: {
      control: 'select',
      options: ['', 'visible', 'static'],
    },
    readonly: {control: 'boolean'},
  },
  parameters: {layout: 'fullscreen'},
  render: (args) =>
    html`${styles}${unsafeHTML(
      getAppLayoutTemplate(
        args.classificationStyle,
        'assets/icons',
        args.readonly,
      ),
    )}`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
