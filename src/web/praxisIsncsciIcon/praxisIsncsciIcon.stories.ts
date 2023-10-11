import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './praxisIsncsciIcon';

const iconsPath = 'assets/icons';

const getIcon = (name: string, size: string, theme: string) => html`
  <div class="icon">
    <praxis-isncsci-icon
      href="${iconsPath}/${theme}.svg#icon-${name}-${size}"
      size="${size}"
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

const iconsTemplate = html`<style>
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
  <div class="icon-grid">${getIconCollection('close')}</div>`;

const meta = {
  title: 'WebComponents/PraxisIsncsciIcon',
  render: () => iconsTemplate,
} satisfies Meta;

export default meta;
type Story = StoryObj;

const iconNames = ['close'];
const sizes = ['12', '16', '20', '24', '28', '32', '48'];
const themes = ['regular'];

export const Primary: Story = {
  args: {
    theme: themes[0],
    iconName: iconNames[0],
    size: sizes[3],
  },
  argTypes: {
    iconName: {control: 'select', options: iconNames},
    size: {control: 'select', options: sizes},
    theme: {control: 'select', options: themes},
  },
  render: (args) =>
    html` <praxis-isncsci-icon
      href="${iconsPath}/${args.theme}.svg#icon-${args.iconName}-${args.size}"
      size="${args.size}"
    ></praxis-isncsci-icon>`,
};

export const Icons: Story = {render: () => iconsTemplate};
