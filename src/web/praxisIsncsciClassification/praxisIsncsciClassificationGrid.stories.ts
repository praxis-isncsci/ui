import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';

import '../../../assets/css/_tokens.css';
import '../../../assets/css/_text-scale.css';
import '../../../assets/css/_classification-total.css';
import '../../../assets/css/_classification-grid.css';
import './praxisIsncsciClassificationTotal';
import './praxisIsncsciClassificationGrid';

const meta = {
  title: 'WebComponents/Classification Grid',
  // tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  name: 'Neurological levels',
  render: () => html`
    <div style="display: inline-block;">
      <praxis-isncsci-classification-grid>
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
      </praxis-isncsci-classification-grid>
    </div>
  `,
};

export const Subscores: Story = {
  name: 'Subscores',
  render: () => html`
    <style>
      praxis-isncsci-classification-grid {
        --grid-template-columns: auto var(--totals-cell-width)
          var(--totals-cell-width);
      }

      praxis-isncsci-classification-grid.sub-scores {
        --grid-template-columns: auto var(--totals-cell-width)
          var(--totals-cell-width) var(--totals-cell-width);
      }
    </style>
    <div style="display: inline-block;">
      <praxis-isncsci-classification-grid class="sub-scores">
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
      </praxis-isncsci-classification-grid>
    </div>
  `,
};
