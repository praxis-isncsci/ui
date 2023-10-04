import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './icons';
import './praxisIsncsciIcon';

const getIcon = (name: string, size: string, theme: string) => html`
  <div class="icon">
    <praxis-isncsci-icon
      component="${theme}-${name}-${size}"
    ></praxis-isncsci-icon>
    <div class="size">${size}</div>
  </div>
`;

const getIconCollection = (iconName: string) => html`
  ${getIconGroup(iconName, 'regular')}
`;

const getIconGroup = (name: string, theme: string) => html`<div
  class="icon-group"
>
  <div class="group-name">${theme}<br />${name}</div>
  ${getIcon(name, '12', theme)} ${getIcon(name, '16', theme)}
  ${getIcon(name, '20', theme)} ${getIcon(name, '24', theme)}
  ${getIcon(name, '28', theme)} ${getIcon(name, '32', theme)}
  ${getIcon(name, '48', theme)}
</div>`;

const meta = {
  title: 'WebComponents/PraxisIsncsciIcon',
  // tags: ['autodocs'],
  render: () =>
    html`<style>
        .icon-grid {
          display: flex;
          flex-direction: row;
        }

        .icon-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: center;
        }

        .group-name {
          color: #666;
          font-size: 0.9rem;
        }

        .icon {
          border: dashed 0.5px #999;
          border-radius: 8px;
          min-width: 48px;
          min-height: 24px;
          padding: 4px;
        }

        .icon .size {
          color: #666;
          font-size: 0.75rem;
        }
      </style>
      <div class="icon-grid">${getIconCollection('close')}</div>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
