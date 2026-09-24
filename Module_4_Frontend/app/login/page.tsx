"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, KeyRound, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api";
import { DEMO_ACCOUNTS } from "@/lib/constants";

function LoginView() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const reason = searchParams.get("reason");
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (reason === "blocked") {
      toast.error("Account blocked", "Your account has been blocked. Contact an administrator.");
    }
    if (registered === "1") {
      toast.success("Account created", "Welcome to RentNest! Log in to continue.");
    }
    if (authLoading === false && isAuthenticated) {
      router.replace(next || "/dashboard");
    }
  }, [reason, registered, authLoading, isAuthenticated, next, router, toast]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back!");
      router.replace(next || "/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Check your credentials."));
      toast.error("Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-20">
      <div className="mb-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <Building2 className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Log in to RentNest</h1>
        <p className="mt-1 text-sm text-slate-500">
          Access your dashboard and manage rentals
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>
            )}
            <Button type="submit" size="lg" className="w-full" isLoading={submitting}>
              <LogIn className="size-5" />
              Log in
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <KeyRound className="size-3.5" /> Demo accounts — click to autofill
            </p>
            <div className="mt-3 space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account.email, account.password)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  <span>
                    <span className="block text-xs font-semibold text-slate-700">{account.role}</span>
                    <span className="block text-xs text-slate-500">
                      {account.email} · {account.password}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-indigo-600">Autofill</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to RentNest?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}