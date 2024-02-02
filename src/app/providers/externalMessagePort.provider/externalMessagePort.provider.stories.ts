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
const storyInitializer = (getRandomExamData) => {
  let iframe = document.querySelector('iframe[isncsci]');

  if (!iframe) {
    return;
  }

  iframe.addEventListener('load', () => {
    const isncsciIframe = document.querySelector('iframe');
    const randomExamButton = document.querySelector('button[random-exam]');
    const incompleteExamButton = document.querySelector(
      'button[random-incomplete-exam]',
    );
    const readonlyButton = document.querySelector('button[readonly]');
    const flipFlagButton = document.querySelector('button[flip-flag]');
    const channel = new MessageChannel();
    const port1 = channel.port1;
    let readonly = false;

    const getRandomEmptyValue = () => {
      const emptyValues = [null, undefined, 'unknown', ''];
      return emptyValues[Math.floor(Math.random() * emptyValues.length)];
    };

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

    randomExamButton?.addEventListener('click', () => {
      readonly = false;
      port1.postMessage({
        action: 'SET_EXAM_DATA',
        readonly,
        examData: getRandomExamData(),
      });
    });

    incompleteExamButton?.addEventListener('click', () => {
      const examData = getRandomExamData();
      ['T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4_5'].forEach(
        (level) => {
          examData[`rightLightTouch${level}`] = getRandomEmptyValue();
          examData[`leftLightTouch${level}`] = getRandomEmptyValue();
          examData[`rightPinPrick${level}`] = getRandomEmptyValue();
          examData[`leftPinPrick${level}`] = getRandomEmptyValue();
        },
      );

      port1.postMessage({
        action: 'SET_EXAM_DATA',
        readonly: false,
        examData,
      });
    });

    readonlyButton?.addEventListener('click', () => {
      readonly = true;
      port1.postMessage({
        action: 'SET_EXAM_DATA',
        readonly,
        examData: getRandomExamData(),
      });
    });

    flipFlagButton?.addEventListener('click', () => {
      readonly = !readonly;

      port1.postMessage({
        action: 'SET_READONLY',
        readonly,
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

    [controls] {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
  </style>
  <iframe
    isncsci
    src="https://brave-meadow-05543dc10.4.azurestaticapps.net/"
  ></iframe>
  <ul controls>
    <li><button random-exam>Load random exam</button></li>
    <li><button random-incomplete-exam>Load random incomplete exam</button></li>
    <li><button readonly>Load random exam as readonly</button></li>
    <li><button flip-flag>Flip readonly flag</button></li>
  </ul>
  <script>
    // We register this way to avoid getting exceptions of functions being already declared when navigating between stories.
    (() => {
      const SensoryLevels = ${JSON.stringify(SensoryLevels)};
      const MotorLevels = ${JSON.stringify(MotorLevels)};
      const getRandomExamData = ${getRandomExamData.toString()};
      const storyInitializer = ${storyInitializer.toString()};
      storyInitializer(getRandomExamData);
    })();
  </script>
`;

const meta = {
  title: 'App/ExternalMessagePortProvider',
  render: () => template(),
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
