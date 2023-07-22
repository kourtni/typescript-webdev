import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Store } from "@yas/store";
import { createFieldBuilder } from "./createFieldBuilder";
import type {
  FormComponent,
  FormOptions,
  FormState,
} from "./types/commonTypes";
import { createFields } from "./createFields";
import { FormContext } from "./FormContext";
import type {
  FormOptionsBuilderFactory,
  EmptyFormOptions,
  FormOptionsBuilderFor,
} from "./createFormOptionsBuilder";
import { FormOptionsBuilder } from "./createFormOptionsBuilder";

export function createForm<Options extends FormOptions>(
  reduceOptions = passThrough as FormOptionsBuilderFactory<
    EmptyFormOptions,
    Options
  >,
): FormComponent<Options> {
  return createFormImpl(reduceOptions, FormOptionsBuilder.empty);
}

function createFormImpl<
  Options extends FormOptions,
  BaseOptions extends FormOptions,
>(
  reduceOptions: FormOptionsBuilderFactory<BaseOptions, Options>,
  initialOptionsBuilder: FormOptionsBuilderFor<BaseOptions>,
): FormComponent<Options> {
  type Schema = Options["schema"];

  const optionsBuilder = reduceOptions(initialOptionsBuilder);
  const { schema, layout: Layout, components: build } = optionsBuilder.build();
  const { components } = build(createFieldBuilder());

  const ComposableForm: FormComponent<Options> = (({
    data = empty,
    ...layoutProps
  }) => {
    const store = useMemo(
      () => new Store<FormState<Schema>>({ data, errors: {} as never }),
      [],
    );
    const fields = useMemo(() => createFields(components, schema), [schema]);
    return (
      <FormContext.Provider value={store}>
        <Layout
          {...(layoutProps as ComponentProps<typeof Layout>)}
          fields={fields}
        />
      </FormContext.Provider>
    );
  }) as FormComponent<Options>;

  ComposableForm.extend = (extendOptions) =>
    createFormImpl(extendOptions, optionsBuilder);

  return ComposableForm;
}

const empty = Object.freeze({});
const passThrough = <T extends any>(value: T) => value;