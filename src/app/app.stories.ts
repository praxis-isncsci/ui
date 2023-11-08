import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';
import {getAppLayoutTemplate} from '@web/praxisIsncsciAppLayout';

import '@app/webApp';
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

    praxis-isncsci-web-app {
      flex-grow: 1;
    }
  </style>
`;

const meta = {
  title: 'App/App',
  render: (args) =>
    html`${styles}<praxis-isncsci-web-app
        >${unsafeHTML(
          getAppLayoutTemplate(args.classificationStyle, 'assets/icons'),
        )}</praxis-isncsci-web-app
      >`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
