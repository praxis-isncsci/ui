import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './colorGradient';

const template = () => html`<color-gradient>
    <div style="background-color: rgba(0, 0, 0, 0);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.1);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.2);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.3);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.4);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.5);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.6);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.7);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.8);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 0.9);">&nbsp;</div>
    <div style="background-color: rgba(0, 0, 0, 1);">&nbsp;</div>
  </color-gradient>
  <br /><color-gradient>
    <div style="background-color: rgba(190, 37, 160, 1);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.9);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.8);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.7);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.6);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.5);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.4);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.3);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.2);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0.1);">&nbsp;</div>
    <div style="background-color: rgba(190, 37, 160, 0);">&nbsp;</div>
  </color-gradient>`;

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'DesignSystem/ColorGradient',
  // tags: ['autodocs'],
  render: () => template(),
} satisfies Meta;

export default meta;
type Story = StoryObj;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {};
