import type { StorybookConfig } from "@storybook/web-components-webpack5";
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async webpackFinal(config, { configType }) {
    if (config.resolve) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    if (configType === 'DEVELOPMENT') {
      // Modify config for development
    }
    if (configType === 'PRODUCTION') {
      // Modify config for production
    }
    return config;
  },     
};

export default config;
