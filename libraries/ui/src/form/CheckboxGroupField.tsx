import { useId, type ReactNode } from "react";
import type { RequiredFieldProps } from "./types";
import { FormControl, FormControlError, FormControlLabel } from "./FormControl";
import { CheckboxField } from "./CheckboxField";

export interface CheckboxGroupOption<Value> {
  value: Value;
  label: ReactNode;
}

export interface CheckboxGroupFieldProps<Value>
  extends RequiredFieldProps<Value[]> {
  options: CheckboxGroupOption<Value>[];
}

export function CheckboxGroupField<Value>({
  options,
  value: checkedValues = [],
  metrics,
  onChange,
  error,
  label,
  ...rest
}: CheckboxGroupFieldProps<Value>) {
  const id = useId();
  return (
    <FormControl {...rest}>
      <FormControlLabel htmlFor={id}>{label}</FormControlLabel>

      {options.map((option, index) => {
        const metric = metrics?.[String(option.value)];
        const checked = checkedValues.includes(option.value);
        const disabled = metric === 0 && !checked;
        return (
          <CheckboxField
            key={index}
            disabled={disabled}
            label={
              <>
                {option.label}
                {metric !== undefined && ` (${metric})`}
              </>
            }
            value={checked}
            onChange={(newChecked) =>
              onChange?.(
                newChecked
                  ? checkedValues.concat(option.value)
                  : checkedValues.filter((v) => v !== option.value),
              )
            }
          />
        );
      })}

      <FormControlError error={error} />
    </FormControl>
  );
}
