import { useState } from "react";
import { IndicatorType, Severity, Source } from "../types/indicator.js";
import { apiRequest } from "../api/apiClient.js";
// @ts-ignore
import { confidenceForSeverity } from "../../server/data.js";
// @ts-ignore
import { uuid } from "../../server/data.js";
// @ts-ignore
import { randomDate } from "../../server/data.js";
import { toast } from "react-toastify";

export interface IndicatorFormState {
  source: Source | "";
  type: IndicatorType | "";
  value: string;
  severity: Severity | "";
  tags: string[];
}

export const useIndicators = (cancel: (action: string) => void) => {
  const [form, setForm] = useState<IndicatorFormState>({
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
    if (!areFieldFull) {
      toast("All fields are required", {
        type: "error",
        toastId: "indicator-error",
      });
      return;
    }
    const indicator = {
      ...form,
      id: uuid(),
      firstSeen: new Date().toISOString(),
      lastSeen: randomDate(7),
      confidence: confidenceForSeverity(form.severity),
    };
    await apiRequest({
      method: "post",
      url: "/api/indicators",
      data: indicator,
      setLoading,
      setError,
    });
    toast("Indicator successfully added", {
      type: "success",
      toastId: "indicator-success",
    });
    cancel("submit");
  };

  const deleteIndicator = async (id: string) => {
    await apiRequest({
      method: "delete",
      url: `/api/indicators/${id}`,
      setLoading: () => {},
      setError: () => {},
    });
    toast("Indicator successfully deleted", {
      type: "success",
      toastId: "indicator-delete",
    });
    cancel("submit");
  };

  const areFieldFull =
    form.source && form.type && form.value && form.severity && form.tags.length;

  return {
    form,
    updateForm,
    handleSubmit,
    areFieldFull,
    loading,
    error,
    deleteIndicator,
  };
};
