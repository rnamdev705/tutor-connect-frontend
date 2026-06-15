import { definePreview } from "@storybook/nextjs-vite";
import {
  decorators as nextjsDecorators,
  loaders as nextjsLoaders,
  parameters as nextjsParameters,
} from "@storybook/nextjs-vite/preview";
import "@/app/globals.css";
import { withStoryProviders } from "../src/stories/decorators/story-providers";

export default definePreview({
  decorators: [withStoryProviders, ...nextjsDecorators],
  loaders: [nextjsLoaders],
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
});
