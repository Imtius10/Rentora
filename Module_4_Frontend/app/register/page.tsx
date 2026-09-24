"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, UserPlus, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api";

function RegisterView() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Enter a valid email";
    if (form.password.length < 6) er.password = "Password must be at least 6 characters";
    if (form.confirm !== form.password) er.confirm = "Passwords do not match";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      const params = new URLSearchParams({ registered: "1" });
      router.push(`/login?${params.toString()}`);
    } catch (err) {
      setApiError(getErrorMessage(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-20">
      <div className="mb-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <Building2 className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Join RentNest to rent or list properties</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-indigo-50/70 p-3 text-xs leading-relaxed text-indigo-900">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              New accounts are created as <strong>Tenants</strong>. Use a demo Landlord account to
              list properties, or ask an admin to upgrade your role.
            </span>
          </div>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              autoComplete="name"
              required
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              hint="At least 6 characters"
              placeholder="••••••••"
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              placeholder="••••••••"
            />
            {apiError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{apiError}</p>
            )}
            <Button type="submit" size="lg" className="w-full" isLoading={submitting}>
              <UserPlus className="size-5" />
              Create account
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterView />
    </Suspense>
  );
}