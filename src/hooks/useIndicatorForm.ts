import { useState } from "react";
import { Indicator } from "../types/indicator";

type IndicatorFormProps = Omit<
  Indicator,
  "id" | "firstSeen" | "lastSeen" | "value"
> & { indicator: string };

export const useIndicatorForm = () => {
  const [form, setForm] = useState<IndicatorFormProps>({
    source: "",
    type: "",
    indicator: "",
    confidence: 1,
    severity: "",
    tags: [],
  });

  const updateForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "tags"
          ? e.target.value.split(",").map((tag) => tag.trim())
          : e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!areFieldFull) return;
    console.log(form);
  };

  const areFieldFull =
    form.source &&
    form.type &&
    form.indicator &&
    form.severity &&
    form.tags.length;

  return { form, updateForm, handleSubmit, areFieldFull };
};
