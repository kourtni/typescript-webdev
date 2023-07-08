import type { AnyZodObject, ZodType } from "zod";
import type { ComponentType } from "react";
import type { Store } from "./Store";

export interface ComposableFormOptions {
  schema?: AnyZodObject;
  layout?: FormLayout;
  components?: FormComponentFactory;
}

export type ComposableFormProps = {
  schema?: AnyZodObject;
  children?: InlineFormLayout;
  data?: Record<string, unknown>;
};

export type ComposableForm = ComponentType<ComposableFormProps> & {
  extend(options: ComposableFormOptions): ComposableForm;
};

/**
 * Not a ComponentType to be able to be used as non-memoized inline render prop
 */
export type InlineFormLayout = (props: FormLayoutProps) => JSX.Element;

export type FormLayoutProps = {
  fields: FormFields;
};

export type FormLayout = ComponentType<FormLayoutProps>;

export interface FormFieldProps extends FieldState {
  name: string;
  onChange: (newValue: unknown) => unknown;
}

export type FormFields = Record<string, FormFieldWithDefaultProps>;
export type FormField = ComponentType<FormFieldProps>;

export type FormFieldWithDefaultProps = ComponentType<Partial<FormFieldProps>>;

export type FormComponentFactory = (
  builder: FormComponentBuilder,
) => FormComponentBuilder;

export type FormComponentBuilder = {
  type(type: ZodType, component: FormField): FormComponentBuilder;
  field(name: string, component: FormField): FormComponentBuilder;
};

export type FormStore = Store<FormState>;

export interface FormState {
  data: Record<string, unknown>;
  errors: Record<string, unknown[]>;
}

export interface FieldState {
  value: unknown;
  errors: unknown[];
}
