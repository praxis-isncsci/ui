import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';

import '../../../assets/css/_tokens.css';
import 'assets/css/_buttons.css';
import '../../../assets/css/_text-scale.css';
import '../../../assets/css/_classification.css';
import '../../../assets/css/_classification-grid.css';
import '../../../assets/css/_classification-total.css';
import '../../../assets/css/_dialog-header.css';
import './praxisIsncsciClassification';
import './praxisIsncsciClassificationGrid';
import './praxisIsncsciClassificationTotal';
import '@web/praxisIsncsciDialogHeader';
import '@web/praxisIsncsciIcon';

const getNeurologicalLevelsTemplate = () => {
  return html`<praxis-isncsci-classification-grid slot="neurological-levels">
    <h3 slot="heading">Neurological levels</h3>
    <div slot="grid">
      <div>&nbsp;</div>
      <div class="text-caption-2 col-header">R</div>
      <div class="text-caption-2 col-header">L</div>
      <div class="text-caption-2 row-header">Sensory</div>
      <praxis-isncsci-classification-total
        >C4</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >C5</praxis-isncsci-classification-total
      >
      <div class="text-caption-2 row-header">Motor</div>
      <praxis-isncsci-classification-total
        >C6</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >C7</praxis-isncsci-classification-total
      >
    </div>
  </praxis-isncsci-classification-grid>`;
};

const getNliTemplate = () => {
  return html`<praxis-isncsci-classification-grid slot="nli">
    <h3 slot="heading">Neurological Level of Injury<br />(NLI)</h3>
    <div slot="grid">
      <praxis-isncsci-classification-total
        >C4</praxis-isncsci-classification-total
      >
    </div>
  </praxis-isncsci-classification-grid>`;
};

const getAisTemplate = () => {
  return html`<praxis-isncsci-classification-grid slot="ais">
    <h3 slot="heading">Asia Impairment Scale<br />(AIS)</h3>
    <div slot="grid">
      <praxis-isncsci-classification-total
        >E</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >Incomplete</praxis-isncsci-classification-total
      >
    </div>
  </praxis-isncsci-classification-grid>`;
};

const getZppTemplate = () => {
  return html`<praxis-isncsci-classification-grid slot="zpp">
    <h3 slot="heading">Zone of partial preservation</h3>
    <div slot="grid">
      <div>&nbsp;</div>
      <div class="text-caption-2 col-header">R</div>
      <div class="text-caption-2 col-header">L</div>
      <div class="text-caption-2 row-header">Sensory</div>
      <praxis-isncsci-classification-total
        >C4</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >C5</praxis-isncsci-classification-total
      >
      <div class="text-caption-2 row-header">Motor</div>
      <praxis-isncsci-classification-total
        >C6</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >C7</praxis-isncsci-classification-total
      >
    </div>
  </praxis-isncsci-classification-grid>`;
};

const getSubScoresTemplate = () => {
  return html`<praxis-isncsci-classification-grid slot="sub-scores">
    <h3 slot="heading">Sub-scores</h3>
    <div slot="grid">
      <div>&nbsp;</div>
      <div class="text-caption-2 col-header">R</div>
      <div class="text-caption-2 col-header">L</div>
      <div class="text-caption-2 col-header">Total</div>
      <div class="text-caption-2 row-header">UEMS</div>
      <praxis-isncsci-classification-total
        >25</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >25</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >50</praxis-isncsci-classification-total
      >
      <div class="text-caption-2 row-header">LEMS</div>
      <praxis-isncsci-classification-total
        >25</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >25</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >50</praxis-isncsci-classification-total
      >
      <div class="text-caption-2 row-header">Light touch</div>
      <praxis-isncsci-classification-total
        >56</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >56</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >112</praxis-isncsci-classification-total
      >
      <div class="text-caption-2 row-header">Pin prick</div>
      <praxis-isncsci-classification-total
        >56</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >56</praxis-isncsci-classification-total
      >
      <praxis-isncsci-classification-total
        >112</praxis-isncsci-classification-total
      >
    </div>
  </praxis-isncsci-classification-grid>`;
};

const getTemplate = (args) =>
  html`
    <praxis-isncsci-classification>
      <praxis-isncsci-dialog-header slot="header">
        <h2 slot="title">Classification</h2>
        <div slot="close">
          <button class="button icon-button">
            <praxis-isncsci-icon
              href="assets/icons/regular.svg#icon-close-24"
              size="24"
            ></praxis-isncsci-icon>
          </button>
        </div>
      </praxis-isncsci-dialog-header>
      ${getNeurologicalLevelsTemplate()} ${getNliTemplate()} ${getAisTemplate()}
      ${getZppTemplate()} ${getSubScoresTemplate()}
    </praxis-isncsci-classification>
  `;

const meta = {
  title: 'WebComponents/PraxisIsncsciClassification',
  component: 'praxis-isncsci-classification',
  // tags: ['autodocs'],
  render: getTemplate,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
