import type { output, ZodType } from "zod";
import type { AnyZodObject, ZodEffects, ZodRawShape } from "zod";

export type FormSchema = ValueType;

export type ValueType<T = any> = ZodType<T>;

export type AnyError = unknown;

export type ErrorList = AnyError[];

export const formValidationModes = [
  "focus",
  "change",
  "blur",
  "submit",
] as const;

export type FormValidationMode = (typeof formValidationModes)[number];

export interface FormState<Schema extends FormSchema> {
  localErrors: FormErrors<Schema>;
  externalErrors: FormErrors<Schema>;
  combinedErrors: FormErrors<Schema>;
  data: inferValue<Schema>;
}

export type FieldNames<Schema extends FormSchema> = `${string &
  keyof inferSchemaShape<Schema>}`;

export type FieldErrors<Schema extends FormSchema> =
  // Falls back to anonymous record when no fields are specified to avoid defining as {} which would match any type
  keyof FieldNames<Schema> extends never
    ? Record<string, ErrorList>
    : { [K in FieldNames<Schema>]?: ErrorList };

export type FormErrorsParser<CustomError, Schema extends FormSchema> = (
  error: CustomError,
) => FormErrors<Schema>;

export interface FormErrors<Schema extends FormSchema> {
  general: ErrorList;
  field: FieldErrors<Schema>;
}

// infer utils

export type inferValue<Type extends ValueType> = output<Type>;

export type inferSchemaShape<T extends ValueType> = T extends AnyZodObject
  ? T["shape"]
  : T extends ZodEffects<infer U>
  ? inferSchemaShape<U>
  : ZodRawShape;

export type inferFieldValue<
  Schema extends FormSchema,
  FieldName extends string,
> = inferValue<inferFieldType<Schema, FieldName>>;

export type inferFieldType<
  Schema extends FormSchema,
  FieldName extends string,
> = inferSchemaShape<Schema>[FieldName];
