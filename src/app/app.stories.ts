import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';
import {AppStoreProvider} from '@app/providers';
import {PraxisIsncsciWebApp} from '@app/webApp';
import {getAppLayoutTemplate} from '@web/praxisIsncsciAppLayout';
import {appStore} from './store';
import {IsncsciExamProvider} from './providers/isncsciExam.provider';

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
    }
  </style>
`;

class webAppStory extends HTMLElement {
  private template() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        ::slotted(praxis-isncsci-web-app) {
          flex-grow: 1;
        }
      </style>
      <slot></slot>
    `;
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = this.template();
  }

  public connectedCallback() {
    const webApp = document.querySelector(
      'praxis-isncsci-web-app',
    ) as PraxisIsncsciWebApp;

    if (webApp) {
      webApp.initialize(
        appStore,
        new AppStoreProvider(appStore),
        new IsncsciExamProvider(),
      );
    }
  }
}
window.customElements.define('web-app-story', webAppStory);

const meta = {
  title: 'App/App',
  args: {
    readonly: false,
    staticHeight: false,
  },
  argTypes: {
    readonly: {control: 'boolean'},
    staticHeight: {control: 'boolean'},
  },
  render: (args) =>
    html`
      ${styles}
      <web-app-story>
        <praxis-isncsci-web-app ?static-height="${args.staticHeight}">
          ${unsafeHTML(
            getAppLayoutTemplate(
              args.classificationStyle,
              'assets/icons',
              args.readonly,
            ),
          )}
        </praxis-isncsci-web-app>
      </web-app-story>
    `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {parameters: {layout: 'fullscreen'}};
