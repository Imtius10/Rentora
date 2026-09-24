"use client";

import { useState } from "react";
import { Ban, RotateCcw, ShieldCheck, UserCog, Users } from "lucide-react";
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from "@/hooks/queries";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { UserStatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/ui/modal";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { AdminUser } from "@/types";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [blockFor, setBlockFor] = useState<AdminUser | null>(null);

  const users = useAdminUsers({ params: { limit: 12, page } });
  const statusMutation = useUpdateUserStatus(() => {
    toast.success("User status updated");
  });
  const roleMutation = useUpdateUserRole(() => {
    toast.success("User role updated");
  });

  const confirmBlock = () => {
    if (!blockFor) return;
    statusMutation.mutate(
      { id: blockFor.id, status: blockFor.activeStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED" },
      { onSuccess: () => setBlockFor(null) }
    );
  };

  const changeRole = (user: AdminUser, role: "TENANT" | "LANDLORD") => {
    if (user.role === role) return;
    roleMutation.mutate({ id: user.id, role }, { onError: () => toast.error("Could not change role") });
  };

  const data = users.data;

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Ban, unban, and change roles for platform members"
      />

      {users.isLoading ? (
        <PageLoader label="Loading users…" />
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState icon={Users} title="No users found" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">{user.name}</p>
                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-100">
                            {ROLE_LABELS[user.role]}
                          </Badge>
                          {user.role !== "ADMIN" && (
                            <Select
                              value={user.role === "TENANT" ? "TENANT" : "LANDLORD"}
                              onChange={(e) => changeRole(user, e.target.value as "TENANT" | "LANDLORD")}
                              className="w-28"
                            >
                              <option value="TENANT">Tenant</option>
                              <option value="LANDLORD">Landlord</option>
                            </Select>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <UserStatusBadge status={user.activeStatus} />
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end">
                          {user.role !== "ADMIN" ? (
                            user.activeStatus === "BLOCKED" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                onClick={() => setBlockFor(user)}
                                isLoading={statusMutation.isPending && blockFor?.id === user.id}
                              >
                                <RotateCcw className="size-3.5" /> Unban
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => setBlockFor(user)}
                                isLoading={statusMutation.isPending && blockFor?.id === user.id}
                              >
                                <Ban className="size-3.5" /> Ban
                              </Button>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                              <ShieldCheck className="size-3.5" /> Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination
            meta={data.meta}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-6"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(blockFor)}
        onClose={() => setBlockFor(null)}
        onConfirm={confirmBlock}
        title={blockFor?.activeStatus === "BLOCKED" ? "Reactivate user?" : "Block user?"}
        description={
          blockFor
            ? blockFor.activeStatus === "BLOCKED"
              ? `Restore access for ${blockFor.name} (${blockFor.email})?`
              : `Block ${blockFor.name} (${blockFor.email})? They will not be able to log in.`
            : ""
        }
        confirmLabel={blockFor?.activeStatus === "BLOCKED" ? "Unban user" : "Ban user"}
        tone={blockFor?.activeStatus === "BLOCKED" ? "primary" : "danger"}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
}