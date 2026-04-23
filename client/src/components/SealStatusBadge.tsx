/**
 * mySeals — Seal Status Badge
 * Renders a styled status pill for seal lifecycle states.
 */

import { cn, SEAL_STATUS_LABELS, SEAL_STATUS_CLASSES } from "@/lib/utils";
import type { SealStatus } from "@/lib/types";

interface SealStatusBadgeProps {
  status: SealStatus;
  className?: string;
}

export default function SealStatusBadge({ status, className }: SealStatusBadgeProps) {
  return (
    <span
      className={cn(
        "status-step",
        SEAL_STATUS_CLASSES[status],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
      {SEAL_STATUS_LABELS[status]}
    </span>
  );
}
