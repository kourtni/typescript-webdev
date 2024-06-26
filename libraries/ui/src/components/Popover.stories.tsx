import type { Meta, StoryObj } from "@yas/test/storybook";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

export default {
  component: PopoverShowcase,
  tags: ["autodocs"],
} satisfies Meta;

export const Default: StoryObj = {};

function PopoverShowcase() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Open</button>
      </PopoverTrigger>
      <PopoverContent
        style={{ padding: 12, background: "gray", color: "black" }}
      >
        Content
      </PopoverContent>
    </Popover>
  );
}
