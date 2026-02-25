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
  id?: string;
}

export const useIndicators = (cancel: () => void) => {
  const [form, setForm] = useState<IndicatorFormState>({
    source: "",
    type: "",
    value: "",
    severity: "",
    tags: [],
    id: "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();
    if(["add", "edit"].includes(action)) await addIndicator(action);
    if(action === "delete") await deleteIndicator();
    cancel();
    toast("Indicator successfully added", {
      type: "success",
      toastId: "indicator-success",
    });
  };
  
  const addIndicator = async (action: string) => {
    if (!areFieldFull) {
      toast("All fields are required", {
        type: "error",
        toastId: "indicator-error",
      });
      return;
    }
    const indicator = {
      ...form,
      id: action === "edit" ? form.id : uuid(),
      firstSeen: new Date().toISOString(),
      lastSeen: randomDate(7),
      confidence: confidenceForSeverity(form.severity),
    };
    await apiRequest({
      method: action === "edit" ? "put" : "post",
      url: "/api/indicators",
      data: indicator,
      setLoading,
      setError,
    });
  };
  const deleteIndicator = async () => {
    await apiRequest({
      method: "delete",
      url: `/api/indicators/${form.id}`,
      setLoading,
      setError,
    });
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
    setForm,
  };
};
