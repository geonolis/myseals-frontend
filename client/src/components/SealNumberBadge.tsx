/**
 * mySeals — Seal Number Badge
 * Renders seal numbers as embossed metallic tags.
 */

import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface SealNumberBadgeProps {
  number: string;
  className?: string;
  showIcon?: boolean;
}

export default function SealNumberBadge({
  number,
  className,
  showIcon = true,
}: SealNumberBadgeProps) {
  return (
    <span className={cn("seal-badge", className)}>
      {showIcon && <Tag className="w-3 h-3 opacity-70" />}
      {number}
    </span>
  );
}
