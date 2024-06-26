import type { ComponentProps, ReactNode } from "react";
import { useMemo } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@yas/icons";
import { styled } from "@yas/style";
import { Stack } from "../layout/Stack";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { separator } from "./Pagination.css";

export interface PaginationProps
  extends Omit<ComponentProps<typeof Stack>, "children" | "onChange"> {
  totalPages: number;
  currentPage: number;
  onChange: (newPage: number) => void;
  visibleRange?: number;
}

export function Pagination({
  totalPages,
  currentPage,
  visibleRange = 5,
  onChange,
  ...rest
}: PaginationProps) {
  let [from, to] = useMemo(
    () =>
      clampSpan(
        currentPage - visibleRange,
        currentPage + visibleRange,
        1,
        totalPages || 1,
      ),
    [totalPages, visibleRange, currentPage],
  );

  const isLeftSeparatorVisible = from > 1;
  if (isLeftSeparatorVisible) {
    from += 2;
  }

  const isRightSeparatorVisible = to < totalPages;
  if (isRightSeparatorVisible) {
    to -= 2;
  }

  return (
    <Stack direction="row" align="center" gap="s" {...rest}>
      <PageButton
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon />
      </PageButton>

      {isLeftSeparatorVisible ? (
        <>
          <PageButton onClick={() => onChange(1)}>
            <Text intent="caption">1</Text>
          </PageButton>
          <Separator />
        </>
      ) : null}

      <PageButtons
        from={from}
        to={to}
        currentPage={currentPage}
        onChange={onChange}
      />

      {isRightSeparatorVisible ? (
        <>
          <Separator />
          <PageButton onClick={() => onChange(totalPages)}>
            <Text intent="caption">{totalPages}</Text>
          </PageButton>
        </>
      ) : null}

      <PageButton
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowRightIcon />
      </PageButton>
    </Stack>
  );
}

interface PageButtonsProps {
  from: number;
  to: number;
  currentPage: number;
  onChange: (newPage: number) => void;
}

function PageButtons({ from, to, currentPage, onChange }: PageButtonsProps) {
  let output: ReactNode = null;
  for (let page = from; page <= to; page++) {
    output = (
      <>
        {output}
        <PageButton
          key={page}
          color="primary"
          onClick={() => onChange(page)}
          disabled={page === currentPage}
        >
          <Text intent="caption">{page}</Text>
        </PageButton>
      </>
    );
  }

  return output;
}

const PageButton = styled(Button).attrs({
  round: true,
  intent: "text",
  style: { textAlign: "center" },
});

const Separator = styled(Text, separator).attrs({ children: "..." });

function clampSpan(from: number, to: number, min: number, max: number) {
  if (from < min) {
    to += min - from;
    from = min;
  }
  if (to > max) {
    from -= to - max;
    to = max;
  }
  return [from, to] as const;
}
