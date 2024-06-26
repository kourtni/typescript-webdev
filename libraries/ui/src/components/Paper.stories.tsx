import type { Meta, StoryObj } from "@yas/test/storybook";
import { Paper } from "./Paper";

export default {
  component: Paper,
  tags: ["autodocs"],
} satisfies Meta<typeof Paper>;

export const Default: StoryObj<Meta<typeof Paper>> = {
  args: { style: { width: 250, height: 250 } },
};
