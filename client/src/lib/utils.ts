import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import type { SealStatus, MovementType } from "./types";

// ─── Status Display ──────────────────────────────────────────────────────────

export const SEAL_STATUS_LABELS: Record<SealStatus, string> = {
  REGISTERED: "Registered",
  IN_STOCK: "In Stock",
  ASSIGNED: "Assigned",
  IN_USE: "In Use",
  RETURNED: "Returned",
  LOST: "Lost",
  DAMAGED: "Damaged",
  CANCELLED: "Cancelled",
};

export const SEAL_STATUS_CLASSES: Record<SealStatus, string> = {
  REGISTERED: "registered",
  IN_STOCK: "active",
  ASSIGNED: "active",
  IN_USE: "in-use",
  RETURNED: "returned",
  LOST: "lost",
  DAMAGED: "lost",
  CANCELLED: "lost",
};

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  RECEIVED: "Received",
  TRANSFER_OUT: "Transfer Out",
  TRANSFER_IN: "Transfer In",
  ASSIGNED_TO_USER: "Assigned to User",
  RETURNED_FROM_USER: "Returned from User",
  USED: "Used",
  LOST: "Lost",
  DAMAGED: "Damaged",
  CANCELLED: "Cancelled",
};

// ─── Date Formatting ─────────────────────────────────────────────────────────

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

// ─── Mock Data (used when backend is not connected) ──────────────────────────

export const MOCK_STATS = {
  totalSeals: 2847,
  inStock: 1204,
  assigned: 891,
  inUse: 623,
  lost: 18,
  returned: 111,
  totalBatches: 24,
  totalUsers: 47,
  totalOffices: 8,
};

export const MOCK_SEALS = [
  { sealId: "1", sealNumber: "MS-000042", batchNumber: "BATCH-2024-001", manufacturer: "SealCo Inc.", currentStatus: "IN_USE" as SealStatus, currentOfficeName: "Lisbon Port Office", assignedToUserName: "Carlos Silva", lastUpdatedAt: new Date(Date.now() - 3600000).toISOString() },
  { sealId: "2", sealNumber: "MS-000043", batchNumber: "BATCH-2024-001", manufacturer: "SealCo Inc.", currentStatus: "ASSIGNED" as SealStatus, currentOfficeName: "Lisbon Port Office", assignedToUserName: "Ana Ferreira", lastUpdatedAt: new Date(Date.now() - 7200000).toISOString() },
  { sealId: "3", sealNumber: "MS-000044", batchNumber: "BATCH-2024-001", manufacturer: "SealCo Inc.", currentStatus: "IN_STOCK" as SealStatus, currentOfficeName: "Headquarters", assignedToUserName: null, lastUpdatedAt: new Date(Date.now() - 86400000).toISOString() },
  { sealId: "4", sealNumber: "MS-000045", batchNumber: "BATCH-2024-002", manufacturer: "MetalSeal Ltd.", currentStatus: "RETURNED" as SealStatus, currentOfficeName: "Porto Office", assignedToUserName: null, lastUpdatedAt: new Date(Date.now() - 172800000).toISOString() },
  { sealId: "5", sealNumber: "MS-000046", batchNumber: "BATCH-2024-002", manufacturer: "MetalSeal Ltd.", currentStatus: "LOST" as SealStatus, currentOfficeName: "Faro Office", assignedToUserName: "João Mendes", lastUpdatedAt: new Date(Date.now() - 259200000).toISOString() },
];

export const MOCK_RECENT_MOVEMENTS = [
  { movementId: "1", sealNumber: "MS-000042", movementType: "ASSIGNED_TO_USER" as MovementType, fromOfficeName: "Headquarters", toUserName: "Carlos Silva", movedByUserName: "Admin", movementDate: new Date(Date.now() - 3600000).toISOString() },
  { movementId: "2", sealNumber: "MS-000039", movementType: "TRANSFER_IN" as MovementType, fromOfficeName: "Headquarters", toOfficeName: "Lisbon Port Office", movedByUserName: "Admin", movementDate: new Date(Date.now() - 7200000).toISOString() },
  { movementId: "3", sealNumber: "MS-000031", movementType: "RETURNED_FROM_USER" as MovementType, fromUserName: "Ana Ferreira", toOfficeName: "Porto Office", movedByUserName: "Manager", movementDate: new Date(Date.now() - 14400000).toISOString() },
];
