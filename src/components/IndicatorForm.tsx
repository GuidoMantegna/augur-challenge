import { IndicatorFormState } from "../hooks/useIndicators";
import { Source } from "../types/indicator";
import { SELECT_OPTIONS } from "../utils";

const FieldSet: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <fieldset className="flex flex-col gap-2 mb-4">
      <label
        htmlFor={label.toLocaleLowerCase()}
        className="text-[var(--text-secondary)]"
      >
        {label}
      </label>
      {children}
    </fieldset>
  );
};

interface IndicatorFormProps {
  closeModal: () => void;
  form: IndicatorFormState;
  updateForm: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, action: string) => void;
  action: "add" | "edit" | "delete";
}
const IndicatorForm: React.FC<IndicatorFormProps> = ({
  form,
  updateForm,
  handleSubmit,
  closeModal,
  action,
}) => {
  return (
    <form className="mt-6" onSubmit={(e) => handleSubmit(e, action)}>
      <FieldSet label="Indicator">
        <input
          type="text"
          name="value"
          id="indicator"
          className="input"
          placeholder="Indicator ID"
          value={form.value}
          onChange={updateForm}
          disabled={action === "delete"}
        />
      </FieldSet>
      <FieldSet label="Type">
        <select
          className="select"
          name="type"
          data-testid="types-select"
          value={form.type}
          onChange={updateForm}
          disabled={action === "delete"}
        >
          <option disabled hidden>
            -- Select a type --
          </option>
          {SELECT_OPTIONS.types.map((type: string) => (
            <option
              key={type}
              data-testid={`type-option-${type.toLocaleLowerCase()}`}
            >
              {type}
            </option>
          ))}
        </select>
      </FieldSet>
      <FieldSet label="Severity">
        <select
          className="select"
          name="severity"
          data-testid="severity-select"
          value={form.severity}
          onChange={updateForm}
          disabled={action === "delete"}
        >
          <option disabled hidden>
            -- Select a severity --
          </option>
          {SELECT_OPTIONS.severities.map((severity: string) => (
            <option
              key={severity}
              data-testid={`severity-option-${severity.toLocaleLowerCase()}`}
            >
              {severity}
            </option>
          ))}
        </select>
      </FieldSet>
      <FieldSet label="Source">
        <select
          className="select"
          name="source"
          data-testid="sources-select"
          value={form.source}
          onChange={updateForm}
          disabled={action === "delete"}
        >
          <option disabled hidden>
            -- Select a source --
          </option>
          {SELECT_OPTIONS.sources.map((source: Source) => (
            <option key={source} data-testid={`source-option-${source}`}>
              {source}
            </option>
          ))}
        </select>
      </FieldSet>
      <FieldSet label="Tags">
        <input
          type="text"
          name="tags"
          id="tags"
          className="input"
          data-testid="tags-input"
          placeholder="tag1,tag2,tag3..."
          value={form.tags}
          onChange={updateForm}
          disabled={action === "delete"}
        />
      </FieldSet>
      <fieldset className="flex gap-2 mt-8">
        <button
          className="btn btn-secondary w-full justify-center"
          type="button"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className={`btn btn-${action === "delete" ? "danger" : "primary"} w-full justify-center`}
          type="submit"
          data-testid="add-indicator-button"
        >
          {
            {
              add: "Add",
              edit: "Edit",
              delete: "Delete",
            }[action]
          }{" "}
          Indicator
        </button>
      </fieldset>
    </form>
  );
};

export default IndicatorForm;
