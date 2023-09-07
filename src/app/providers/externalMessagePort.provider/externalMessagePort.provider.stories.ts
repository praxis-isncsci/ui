import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import {Exam} from 'isncsci';
import {BinaryObservation, MotorMuscleValue, SensoryPointValue} from 'isncsci/cjs/interfaces';

const getRandomIsncsciExam = () => {
  const motorValues: MotorMuscleValue[] = ['0', '1', '2', '3', '4', '5'];
  const sensoryValues: SensoryPointValue[] = ['0', '1', '2'];
  const binaryObservation: BinaryObservation[] = ['Yes', 'No'];

  const randomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  }

  const exam: Exam = {
    deepAnalPressure: randomElement(binaryObservation),
    left: {
      motor: {
        C5: randomElement(motorValues),
        C6: randomElement(motorValues),
        C7: randomElement(motorValues),
        C8: randomElement(motorValues),
        T1: randomElement(motorValues),
        L2: randomElement(motorValues),
        L3: randomElement(motorValues),
        L4: randomElement(motorValues),
        L5: randomElement(motorValues),
        S1: randomElement(motorValues),
      },
      lightTouch: {
        C2: randomElement(sensoryValues),
        C3: randomElement(sensoryValues),
        C4: randomElement(sensoryValues),
        C5: randomElement(sensoryValues),
        C6: randomElement(sensoryValues),
        C7: randomElement(sensoryValues),
        C8: randomElement(sensoryValues),
        T1: randomElement(sensoryValues),
        T2: randomElement(sensoryValues),
        T3: randomElement(sensoryValues),
        T4: randomElement(sensoryValues),
        T5: randomElement(sensoryValues),
        T6: randomElement(sensoryValues),
        T7: randomElement(sensoryValues),
        T8: randomElement(sensoryValues),
        T9: randomElement(sensoryValues),
        T10: randomElement(sensoryValues),
        T11: randomElement(sensoryValues),
        T12: randomElement(sensoryValues),
        L1: randomElement(sensoryValues),
        L2: randomElement(sensoryValues),
        L3: randomElement(sensoryValues),
        L4: randomElement(sensoryValues),
        L5: randomElement(sensoryValues),
        S1: randomElement(sensoryValues),
        S2: randomElement(sensoryValues),
        S3: randomElement(sensoryValues),
        S4_5: randomElement(sensoryValues),
      },
      pinPrick: {
        C2: randomElement(sensoryValues),
        C3: randomElement(sensoryValues),
        C4: randomElement(sensoryValues),
        C5: randomElement(sensoryValues),
        C6: randomElement(sensoryValues),
        C7: randomElement(sensoryValues),
        C8: randomElement(sensoryValues),
        T1: randomElement(sensoryValues),
        T2: randomElement(sensoryValues),
        T3: randomElement(sensoryValues),
        T4: randomElement(sensoryValues),
        T5: randomElement(sensoryValues),
        T6: randomElement(sensoryValues),
        T7: randomElement(sensoryValues),
        T8: randomElement(sensoryValues),
        T9: randomElement(sensoryValues),
        T10: randomElement(sensoryValues),
        T11: randomElement(sensoryValues),
        T12: randomElement(sensoryValues),
        L1: randomElement(sensoryValues),
        L2: randomElement(sensoryValues),
        L3: randomElement(sensoryValues),
        L4: randomElement(sensoryValues),
        L5: randomElement(sensoryValues),
        S1: randomElement(sensoryValues),
        S2: randomElement(sensoryValues),
        S3: randomElement(sensoryValues),
        S4_5: randomElement(sensoryValues),
      },
      // lowestNonKeyMuscleWithMotorFunction: convertStringToMotorLevel(examData.LowestNonkeyMotorFunctionLeft),
    },
    right: {
      motor: {
        C5: randomElement(motorValues),
        C6: randomElement(motorValues),
        C7: randomElement(motorValues),
        C8: randomElement(motorValues),
        T1: randomElement(motorValues),
        L2: randomElement(motorValues),
        L3: randomElement(motorValues),
        L4: randomElement(motorValues),
        L5: randomElement(motorValues),
        S1: randomElement(motorValues),
      },
      lightTouch: {
        C2: randomElement(sensoryValues),
        C3: randomElement(sensoryValues),
        C4: randomElement(sensoryValues),
        C5: randomElement(sensoryValues),
        C6: randomElement(sensoryValues),
        C7: randomElement(sensoryValues),
        C8: randomElement(sensoryValues),
        T1: randomElement(sensoryValues),
        T2: randomElement(sensoryValues),
        T3: randomElement(sensoryValues),
        T4: randomElement(sensoryValues),
        T5: randomElement(sensoryValues),
        T6: randomElement(sensoryValues),
        T7: randomElement(sensoryValues),
        T8: randomElement(sensoryValues),
        T9: randomElement(sensoryValues),
        T10: randomElement(sensoryValues),
        T11: randomElement(sensoryValues),
        T12: randomElement(sensoryValues),
        L1: randomElement(sensoryValues),
        L2: randomElement(sensoryValues),
        L3: randomElement(sensoryValues),
        L4: randomElement(sensoryValues),
        L5: randomElement(sensoryValues),
        S1: randomElement(sensoryValues),
        S2: randomElement(sensoryValues),
        S3: randomElement(sensoryValues),
        S4_5: randomElement(sensoryValues),
      },
      pinPrick: {
        C2: randomElement(sensoryValues),
        C3: randomElement(sensoryValues),
        C4: randomElement(sensoryValues),
        C5: randomElement(sensoryValues),
        C6: randomElement(sensoryValues),
        C7: randomElement(sensoryValues),
        C8: randomElement(sensoryValues),
        T1: randomElement(sensoryValues),
        T2: randomElement(sensoryValues),
        T3: randomElement(sensoryValues),
        T4: randomElement(sensoryValues),
        T5: randomElement(sensoryValues),
        T6: randomElement(sensoryValues),
        T7: randomElement(sensoryValues),
        T8: randomElement(sensoryValues),
        T9: randomElement(sensoryValues),
        T10: randomElement(sensoryValues),
        T11: randomElement(sensoryValues),
        T12: randomElement(sensoryValues),
        L1: randomElement(sensoryValues),
        L2: randomElement(sensoryValues),
        L3: randomElement(sensoryValues),
        L4: randomElement(sensoryValues),
        L5: randomElement(sensoryValues),
        S1: randomElement(sensoryValues),
        S2: randomElement(sensoryValues),
        S3: randomElement(sensoryValues),
        S4_5: randomElement(sensoryValues),
      },
      // lowestNonKeyMuscleWithMotorFunction: convertStringToMotorLevel(examData.LowestNonkeyMotorFunctionRight),
    },
    voluntaryAnalContraction: randomElement(binaryObservation),
  };

  return exam;
};

/*
 * Used to initialize the MessageChannel we will use to communicate with the iFrame.
 * The code will be embedded as a string in the template function below.
 * It needs to be written as plain JavaScript, not TypeScript.
 * I was not able to do this using a Storybook decorator, as it would try to execute the decorator before the template was loaded.
 */
const storyInitializer  = () => {
  let iframe = document.querySelector('iframe[isncsci]');

  if (!iframe) {
    return;
  }

  iframe.addEventListener("load", () => {
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
      isncsciIframe.contentWindow.postMessage({action: 'INITIALIZE_PORT'}, '*', [channel.port2]);
    }

    button?.addEventListener(
      'click',
      () => {
        console.log('Message sent to iframe');
        port1.postMessage({action: 'SET_EXAM_DATA', exam: getRandomIsncsciExam()});
      }
    );
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
    <iframe isncsci src="https://ashy-river-029cc4703-12.westeurope.3.azurestaticapps.net"></iframe>
    <button test-button>Load random exam</button>
    <script>
      // We register this way to avoid getting exceptions of functions being already declared when navigating between stories.
      (() => {
        const getRandomIsncsciExam = ${getRandomIsncsciExam.toString()};
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
