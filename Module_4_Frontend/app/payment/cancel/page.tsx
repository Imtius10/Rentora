"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <XCircle className="size-9" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Payment cancelled</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Your payment was not completed. You can try again any time from your payments dashboard –
        the pending payment stays valid.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/payments" className="flex-1">
          <Button className="w-full">Try again</Button>
        </Link>
        <Link href="/properties" className="flex-1">
          <Button variant="outline" className="w-full">
            Browse properties
          </Button>
        </Link>
      </div>
    </div>
  );
}