import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import {MotorLevels as ML, SensoryLevels as SL} from '@core/domain';
import {getRandomExamData} from '@testHelpers/examDataHelper';

const SensoryLevels = SL.slice(0);
const MotorLevels = ML.slice(0);

/*
 * Used to initialize the MessageChannel we will use to communicate with the iFrame.
 * The code will be embedded as a string in the template function below.
 * It needs to be written as plain JavaScript, not TypeScript.
 * I was not able to do this using a Storybook decorator, as it would try to execute the decorator before the template was loaded.
 */
const storyInitializer = () => {
  let iframe = document.querySelector('iframe[isncsci]');

  if (!iframe) {
    return;
  }

  iframe.addEventListener('load', () => {
    const isncsciIframe = document.querySelector('iframe');
    const button = document.querySelector('[test-button]');
    const channel = new MessageChannel();
    const port1 = channel.port1;

    // Listen for messages on port1
    port1.onmessage = (e) => {
      console.log('Message received from iframe', e.data);
    };

    // Transfer port2 to the iframe
    if (isncsciIframe && isncsciIframe.contentWindow) {
      isncsciIframe.contentWindow.postMessage(
        {action: 'INITIALIZE_PORT'},
        '*',
        [channel.port2],
      );
    }

    button?.addEventListener('click', () => {
      console.log('Message sent to iframe');
      port1.postMessage({
        action: 'SET_EXAM_DATA',
        examData: getRandomExamData(),
      });
    });
  });
};

const template = () => html`
  <style>
    iframe {
      border: none;
      height: 100%;
      min-height: 600px;
      width: 100%;
    }
  </style>
  <iframe
    isncsci
    src="https://agreeable-dune-0ccb46f1e-139.westus2.4.azurestaticapps.net"
  ></iframe>
  <button test-button>Load random exam</button>
  <script>
    // We register this way to avoid getting exceptions of functions being already declared when navigating between stories.
    (() => {
      const SensoryLevels = ${JSON.stringify(SensoryLevels)};
      const MotorLevels = ${JSON.stringify(MotorLevels)};
      const getRandomExamData = ${getRandomExamData.toString()};
      const storyInitializer = ${storyInitializer.toString()};
      storyInitializer();
    })();
  </script>
`;

const meta = {
  title: 'App/ExternalMessagePortProvider',
  // tags: ['autodocs'],
  render: () => template(),
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
