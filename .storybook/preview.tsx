import type { Preview } from "@storybook/nextjs-vite";
import {
  decorators as nextjsDecorators,
  loaders as nextjsLoaders,
  parameters as nextjsParameters,
} from "@storybook/nextjs-vite/preview";
import "../src/app/globals.css";

const preview: Preview = {
  decorators: [...nextjsDecorators],
  loaders: [...nextjsLoaders],
  parameters: {
    ...nextjsParameters,
    nextjs: {
      appDirectory: true,
    },
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      ...nextjsParameters.docs,
      toc: true,
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
