import { useState } from "react";
import { IndicatorType, Severity, Source } from "../types/indicator";
import { apiRequest } from "../api/apiClient";
// @ts-ignore
import {confidenceForSeverity} from "../../server/data.js";
// @ts-ignore
import {uuid} from "../../server/data.js";
// @ts-ignore
import {randomDate} from "../../server/data.js";


interface IndicatorFormProps {
  source: Source | "";
  type: IndicatorType | "";
  value: string;
  severity: Severity | "";
  tags: string[];
};

export const useIndicatorForm = (cancel: (action: string) => void) => {
  const [form, setForm] = useState<IndicatorFormProps>({
    source: "",
    type: "",
    value: "",
    severity: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!areFieldFull) return;
    const indicator = { ...form, 
      id: uuid(), 
      firstSeen: new Date().toISOString(), 
      lastSeen: randomDate(7),
      confidence: confidenceForSeverity(form.severity)  
    };
    await apiRequest({ method: "post", url: "/api/indicators", data: indicator, setLoading, setError });
    cancel("submit");
  };

  const areFieldFull =
    form.source &&
    form.type &&
    form.value &&
    form.severity &&
    form.tags.length;

  return { form, updateForm, handleSubmit, areFieldFull };
};
