"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProperty, useUpdateProperty } from "@/hooks/queries";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { getErrorMessage } from "@/lib/api";
import { ALLOWED_CATEGORIES } from "@/lib/constants";
import { titleCase } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyFormProps {
  initial?: Property;
  mode: "create" | "edit";
}

export function PropertyForm({ initial, mode }: PropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const create = useCreateProperty(() => {
    toast.success("Property published", "Your listing is now visible to tenants.");
    router.push("/dashboard/properties");
  });
  const update = useUpdateProperty(() => {
    toast.success("Property updated");
    router.push("/dashboard/properties");
  });

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    price: initial?.price?.toString() ?? "",
    location: initial?.location ?? "",
    category: initial?.category ?? ALLOWED_CATEGORIES[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const submitting = create.isPending || update.isPending;

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (form.title.trim().length < 3) er.title = "Title must be at least 3 characters";
    if (form.description.trim().length < 10) er.description = "Add a longer description (min 10 characters)";
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0) er.price = "Enter a valid monthly price";
    if (form.location.trim().length < 3) er.location = "Location is required";
    if (!form.category) er.category = "Pick a category";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      category: form.category,
    };
    try {
      if (mode === "create") {
        await create.mutateAsync(payload);
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, ...payload });
      }
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Input
        label="Title"
        value={form.title}
        onChange={set("title")}
        error={errors.title}
        placeholder="e.g. Luxury 3-bedroom apartment in Gulshan"
      />
      <Textarea
        label="Description"
        value={form.description}
        onChange={set("description")}
        error={errors.description}
        placeholder="Describe the property — bedrooms, amenities, lease terms…"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Monthly rent (BDT)"
          type="number"
          min={1}
          step="any"
          value={form.price}
          onChange={set("price")}
          error={errors.price}
          placeholder="e.g. 25000"
        />
        <Select label="Category" value={form.category} onChange={set("category")} error={errors.category}>
          {ALLOWED_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {titleCase(c)}
            </option>
          ))}
        </Select>
      </div>
      <Input
        label="Location"
        value={form.location}
        onChange={set("location")}
        error={errors.location}
        placeholder="e.g. Gulshan 2, Dhaka"
      />
      {apiError && (
        <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{apiError}</p>
      )}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/properties")}>
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          {mode === "create" ? "Publish property" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}