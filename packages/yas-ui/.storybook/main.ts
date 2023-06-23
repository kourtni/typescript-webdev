import type { StorybookConfig } from "@storybook/react-vite";
import { enhanceStoryIndexers } from "./enhanceStoryIndexers";

const config: StorybookConfig = {
  stories: ["./**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    disableTelemetry: true,
  },
  storyIndexers: enhanceStoryIndexers,
};

export default config;
