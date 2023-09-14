import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import {MotorLevel, MotorLevels as ML, SensoryLevels as SL} from '@core/domain';

const SensoryLevels = SL.splice(0);
const MotorLevels = ML.splice(0);

const getRandomExamData = () => {
  const motorValues = ['0', '1', '2', '3', '4', '5'];
  const sensoryValues = ['0', '1', '2'];
  const binaryObservation = ['Yes', 'No'];

  const randomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const examData = {
    deepAnalPressure: randomElement(binaryObservation),
    voluntaryAnalContraction: randomElement(binaryObservation),
    asiaImpairmentScale: Math.floor(Math.random() * 56).toString(),
    injuryComplete: Math.floor(Math.random() * 56).toString(),
    leftLightTouchTotal: Math.floor(Math.random() * 56).toString(),
    leftLowerMotorTotal: Math.floor(Math.random() * 56).toString(),
    leftMotor: Math.floor(Math.random() * 56).toString(),
    leftMotorTotal: Math.floor(Math.random() * 56).toString(),
    leftMotorZpp: Math.floor(Math.random() * 56).toString(),
    leftPinPrickTotal: Math.floor(Math.random() * 56).toString(),
    leftSensory: Math.floor(Math.random() * 56).toString(),
    leftSensoryZpp: Math.floor(Math.random() * 56).toString(),
    leftTouchTotal: Math.floor(Math.random() * 56).toString(),
    leftUpperMotorTotal: Math.floor(Math.random() * 56).toString(),
    lowerMotorTotal: Math.floor(Math.random() * 56).toString(),
    neurologicalLevelOfInjury: Math.floor(Math.random() * 56).toString(),
    pinPrickTotal: Math.floor(Math.random() * 56).toString(),
    rightLightTouchTotal: Math.floor(Math.random() * 56).toString(),
    rightLowerMotorTotal: Math.floor(Math.random() * 56).toString(),
    rightMotor: Math.floor(Math.random() * 56).toString(),
    rightMotorTotal: Math.floor(Math.random() * 56).toString(),
    rightMotorZpp: Math.floor(Math.random() * 56).toString(),
    rightPinPrickTotal: Math.floor(Math.random() * 56).toString(),
    rightSensory: Math.floor(Math.random() * 56).toString(),
    rightSensoryZpp: Math.floor(Math.random() * 56).toString(),
    rightTouchTotal: Math.floor(Math.random() * 56).toString(),
    rightUpperMotorTotal: Math.floor(Math.random() * 56).toString(),
    touchTotal: Math.floor(Math.random() * 56).toString(),
    upperMotorTotal: Math.floor(Math.random() * 56).toString(),
  };

  SensoryLevels.forEach((level) => {
    examData[`rightLightTouch${level}`] = randomElement(sensoryValues);
    examData[`rightPinPrick${level}`] = randomElement(sensoryValues);
    examData[`leftLightTouch${level}`] = randomElement(sensoryValues);
    examData[`leftPinPrick${level}`] = randomElement(sensoryValues);

    if (MotorLevels.includes(level as MotorLevel)) {
      examData[`rightMotor${level}`] = randomElement(motorValues);
      examData[`leftMotor${level}`] = randomElement(motorValues);
    }
  });

  return examData;
};

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
    src="https://ashy-river-029cc4703.3.azurestaticapps.net/"
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
