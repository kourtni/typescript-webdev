import type { Draft } from "immer";
import { produce } from "immer";
import type {
  FieldNames,
  FieldErrors,
  FormSchema,
  FormState,
  FormValidationMode,
  inferFormValue,
} from "./types/commonTypes";
import type { RCFGenerics } from "./types/optionTypes";

export type FormStoreFor<G extends RCFGenerics> = FormStore<
  G["schema"],
  G["mode"]
>;

export class FormStore<
  Schema extends FormSchema,
  Mode extends FormValidationMode = FormValidationMode,
> {
  private _listeners = new Set<StoreListener<Schema>>();
  private _currentMutation?: { draft: Draft<FormState<Schema>> };

  get state() {
    return this._state;
  }

  get isValid() {
    return !Object.values(this._state.errors).some((errors) => errors?.length);
  }

  constructor(
    public readonly schema: Schema,
    private _state: FormState<Schema>,
    private _mode: FormValidationMode,
  ) {}

  resetData(data: inferFormValue<Schema>) {
    this.mutate((state) => {
      state.data = data;
    });
  }

  handleSubmit() {
    this.validate();
  }

  changeField<FieldName extends FieldNames<Schema>>(
    name: FieldName,
    value: inferFormValue<Schema>[FieldName],
  ) {
    this.mutate((draft) => {
      draft.data[name] = value;
      if (this._mode === "change") {
        this.validate(name);
      }
    });
  }

  blurField<FieldName extends FieldNames<Schema>>(name: FieldName) {
    if (this._mode === "blur") {
      this.validate(name);
    }
  }

  validate<FieldName extends FieldNames<Schema>>(...names: FieldName[]) {
    this.mutate((draft) => {
      const errors = getFormFieldErrors(this.schema, draft.data);
      if (names.length) {
        for (const name of names) {
          draft.errors[name] = errors[name];
        }
      } else {
        draft.errors = errors;
      }
    });
  }

  private mutate(mutator: (state: FormState<Schema>) => void): void {
    if (this._currentMutation) {
      mutator(this._currentMutation.draft as FormState<Schema>);
      return;
    }

    const newState = produce(this._state, (draft) => {
      this._currentMutation = { draft };
      mutator(draft as FormState<Schema>);
      this._currentMutation = undefined;
    });

    this._state = newState;
    for (const listener of this._listeners) {
      listener(newState);
    }
  }

  subscribe = (listener: StoreListener<Schema>): StoreUnsubscriber => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };
}

function getFormFieldErrors<Schema extends FormSchema>(
  schema: Schema,
  value: inferFormValue<Schema>,
): FieldErrors<Schema> {
  const res = schema.safeParse(value);
  if (res.success) {
    return {};
  }
  return res.error.flatten().fieldErrors as FieldErrors<Schema>;
}

export type StoreUnsubscriber = () => void;

export type StoreListener<Schema extends FormSchema> = (
  state: FormState<Schema>,
) => void;