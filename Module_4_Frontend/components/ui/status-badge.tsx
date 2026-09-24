import { Badge } from "@/components/ui/badge";
import {
  PAYMENT_STATUS_META,
  RENTAL_STATUS_META,
  USER_STATUS_META,
} from "@/lib/constants";
import type { PaymentStatus, RentalStatus, UserStatus } from "@/types";

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const meta = RENTAL_STATUS_META[status];
  return (
    <Badge className={meta.className} iconClassName={meta.dot}>
      {meta.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const meta = PAYMENT_STATUS_META[status];
  return (
    <Badge className={meta.className} iconClassName={meta.dot}>
      {meta.label}
    </Badge>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const meta = USER_STATUS_META[status];
  return (
    <Badge className={meta.className} iconClassName={meta.dot}>
      {meta.label}
    </Badge>
  );
}