"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // The Stripe webhook confirms the payment; if the frontend routed here
    // manually we simply celebrate. Payment history updates automatically.
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="size-9" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Payment successful 🎉</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Thank you! Your payment has been processed
        {sessionId ? <> (session {sessionId.slice(0, 18)}…)</> : null}. Check your payment history to
        see the updated status.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/payments" className="flex-1">
          <Button className="w-full">View payments</Button>
        </Link>
        <Link href="/properties" className="flex-1">
          <Button variant="outline" className="w-full">
            Browse more
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessView />
    </Suspense>
  );
}