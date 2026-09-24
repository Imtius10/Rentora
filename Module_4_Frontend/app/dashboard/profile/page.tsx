"use client";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, USER_STATUS_META } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const statusMeta = USER_STATUS_META[user.activeStatus];

  return (
    <div className="max-w-3xl">
      <PageHeader title="My Profile" description="Your account details" />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar name={user.name} className="size-16 text-xl" />
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-100">
                  {ROLE_LABELS[user.role]}
                </Badge>
                <Badge className={statusMeta.className} iconClassName={statusMeta.dot}>
                  {statusMeta.label}
                </Badge>
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">User ID</dt>
              <dd className="mt-1 break-all text-sm text-slate-700">{user.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Member since</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDateTime(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Last updated</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDateTime(user.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</dt>
              <dd className="mt-1 text-sm text-slate-700">{ROLE_LABELS[user.role]}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm leading-relaxed text-indigo-900">
            <strong>Note:</strong> Account profiles are managed by the platform. If you need to
            change your role or restore a blocked account, contact an administrator.
            {user.role === "LANDLORD"
              ? " You manage your own listings from the Properties section."
              : ""}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}