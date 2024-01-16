import {html} from 'lit-html';
import type {Meta, StoryObj} from '@storybook/web-components';

import './praxisIsncsciKeyPointsDiagram';

const meta = {
  title: 'WebComponents/Key points diagram',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html`
      <praxis-isncsci-key-points-diagram></praxis-isncsci-key-points-diagram>
      <div>
        <h3>Update a segment color</h3>
        <div style="display:flex;flex-direction:row;">
          <div style="display:flex;flex-direction:column;">
            <label for="side">Side</label>
            <select id="side" name="side">
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;">
            <label for="level">Level</label>
            <select id="level" name="level">
              <option value="c2">C2</option>
              <option value="c3">C3</option>
              <option value="c4">C4</option>
              <option value="c5">C5</option>
              <option value="c6">C6</option>
              <option value="c7">C7</option>
              <option value="c8">C8</option>
              <option value="t1">T1</option>
              <option value="t2">T2</option>
              <option value="t3">T3</option>
              <option value="t4">T4</option>
              <option value="t5">T5</option>
              <option value="t6">T6</option>
              <option value="t7">T7</option>
              <option value="t8">T8</option>
              <option value="t9">T9</option>
              <option value="t10">T10</option>
              <option value="t11">T11</option>
              <option value="t12">T12</option>
              <option value="l1">L1</option>
              <option value="l2">L2</option>
              <option value="l3">L3</option>
              <option value="l4">L4</option>
              <option value="l5">L5</option>
              <option value="s1">S1</option>
              <option value="s2">S2</option>
              <option value="s3">S3</option>
              <option value="s4_5">S4-5</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;">
            <label for="color">Color</label>
            <select id="color" name="color">
              <option value="-">--surface--</option>
              <option value="-0">--surface--0</option>
              <option value="0-0">--surface-0-0</option>
              <option value="0-1">--surface-0-1</option>
              <option value="0-2">--surface-0-2</option>
              <option value="-1">--surface--1</option>
              <option value="1-1">--surface-1-1</option>
              <option value="1-2">--surface-1-2</option>
              <option value="-2">--surface--2</option>
              <option value="2-2">--surface-2-2</option>
            </select>
          </div>
          <div>
            <button id="set-color">Set color</button>
          </div>
        </div>
      </div>
      <script>
        document.querySelector('#set-color').addEventListener('click', (e) => {
          const side = document.querySelector('#side').value;
          const level = document.querySelector('#level').value;
          const color = document.querySelector('#color').value;
          document
            .querySelector('praxis-isncsci-key-points-diagram')
            .setAttribute(side + '-' + level, color);
        });
      </script>
    `,
};
