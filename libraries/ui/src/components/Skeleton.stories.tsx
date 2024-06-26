import type { Meta, StoryObj } from "@yas/test/storybook";
import { Skeleton } from "./Skeleton";

export default {
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export const Default: StoryObj<Meta<typeof Skeleton>> = {
  args: { style: { width: 250, height: 250 } },
};
