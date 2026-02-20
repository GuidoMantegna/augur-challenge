// @ts-ignore
import { sources } from "../../server/data";
import { Source } from "../types/indicator";
import { useIndicatorForm } from "../hooks";

interface IndicatorFormProps {
  cancel: () => void;
}
const IndicatorForm: React.FC<IndicatorFormProps> = ({ cancel }) => {
  const { form, updateForm, handleSubmit, areFieldFull } = useIndicatorForm();

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <fieldset className="flex flex-col gap-2 mb-4">
        <label htmlFor="indicator" className="text-[var(--text-secondary)]">
          Indicator
        </label>
        <input
          type="text"
          name="indicator"
          id="indicator"
          className="input"
          placeholder="Indicator ID"
          value={form.indicator}
          onChange={updateForm}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-2 mb-4">
        <label htmlFor="type" className="text-[var(--text-secondary)]">
          Type
        </label>
        <select
          className="select"
          name="type"
          data-testid="types-select"
          value={form.type}
          onChange={updateForm}
        >
          <option value="" disabled hidden>
            -- Select a type --
          </option>
          <option value="ip" data-testid="type-option-ip">
            IP Address
          </option>
          <option value="domain" data-testid="type-option-domain">
            Domain
          </option>
          <option value="hash" data-testid="type-option-hash">
            File Hash
          </option>
          <option value="url" data-testid="type-option-url">
            URL
          </option>
        </select>
      </fieldset>
      <fieldset className="flex flex-col gap-2 mb-4">
        <label htmlFor="severity" className="text-[var(--text-secondary)]">
          Severity
        </label>
        <select
          className="select"
          name="severity"
          data-testid="severity-select"
          value={form.severity}
          onChange={updateForm}
        >
          <option value="" disabled hidden>
            -- Select a severity --
          </option>
          <option value="critical" data-testid="severity-option-critical">
            Critical
          </option>
          <option value="high" data-testid="severity-option-high">
            High
          </option>
          <option value="medium" data-testid="severity-option-medium">
            Medium
          </option>
          <option value="low" data-testid="severity-option-low">
            Low
          </option>
        </select>
      </fieldset>
      <fieldset className="flex flex-col gap-2 mb-4">
        <label htmlFor="source" className="text-[var(--text-secondary)]">
          Source
        </label>
        <select
          className="select"
          name="source"
          data-testid="sources-select"
          value={form.source}
          onChange={updateForm}
        >
          <option value="" disabled hidden>
            -- Select a source --
          </option>
          {sources.map((source: Source) => (
            <option
              key={source}
              value={source}
              data-testid={`source-option-${source}`}
            >
              {source}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="flex flex-col gap-2 mb-4">
        <label htmlFor="confidence" className="text-[var(--text-secondary)]">
          Confidence
        </label>
        <input
          type="number"
          name="confidence"
          id="confidence"
          className="input"
          data-testid="confidence-input"
          min="1"
          max="100"
          placeholder="1 - 100"
          value={form.confidence}
          onChange={updateForm}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-2 mb-4">
        <label htmlFor="tags" className="text-[var(--text-secondary)]">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          className="input"
          data-testid="confidence-input"
          placeholder="tag1,tag2,tag3..."
          value={form.tags}
          onChange={updateForm}
        />
      </fieldset>
      <fieldset className="flex gap-2 mt-8">
        <button
          className="btn btn-secondary w-full justify-center"
          type="button"
          onClick={cancel}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary w-full justify-center"
          type="submit"
          data-testid="add-indicator-button"
          disabled={!areFieldFull}
        >
          + Add Indicator
        </button>
      </fieldset>
    </form>
  );
};

export default IndicatorForm;
