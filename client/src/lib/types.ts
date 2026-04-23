/**
 * mySeals — Shared TypeScript Types
 * Mirrors the Spring Boot DTOs defined in the backend.
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export type SealStatus =
  | "REGISTERED"
  | "IN_STOCK"
  | "ASSIGNED"
  | "IN_USE"
  | "RETURNED"
  | "LOST"
  | "DAMAGED"
  | "CANCELLED";

export type MovementType =
  | "RECEIVED"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"
  | "ASSIGNED_TO_USER"
  | "RETURNED_FROM_USER"
  | "USED"
  | "LOST"
  | "DAMAGED"
  | "CANCELLED";

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "VIEW";

// ─── Core Entities ───────────────────────────────────────────────────────────

export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Office {
  officeId: string;
  officeName: string;
  officeCode: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  parentOfficeId: string | null;
  parentOfficeName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userId: string;
  auth0UserId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  officeId: string;
  officeName: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SealBatch {
  batchId: string;
  manufacturer: string;
  batchNumber: string;
  startSealNumber: string;
  endSealNumber: string;
  quantity: number;
  receivedDate: string;
  registeredByUserId: string;
  registeredByUserName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seal {
  sealId: string;
  sealNumber: string;
  batchId: string;
  batchNumber: string;
  manufacturer: string;
  currentStatus: SealStatus;
  currentOfficeId: string;
  currentOfficeName: string;
  assignedToUserId: string | null;
  assignedToUserName: string | null;
  registeredAt: string;
  lastUpdatedAt: string;
}

export interface SealAssignment {
  assignmentId: string;
  sealId: string;
  sealNumber: string;
  assignedToUserId: string | null;
  assignedToUserName: string | null;
  assignedToOfficeId: string | null;
  assignedToOfficeName: string | null;
  assignedByUserId: string;
  assignedByUserName: string;
  assignmentDate: string;
  returnDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SealUsage {
  usageId: string;
  sealId: string;
  sealNumber: string;
  usedByUserId: string;
  usedByUserName: string;
  usageLocation: string;
  latitude: number | null;
  longitude: number | null;
  documentReference: string | null;
  photoUrl: string | null;
  notes: string | null;
  usedAt: string;
  createdAt: string;
}

export interface StockMovement {
  movementId: string;
  sealId: string;
  sealNumber: string;
  movementType: MovementType;
  fromOfficeId: string | null;
  fromOfficeName: string | null;
  toOfficeId: string | null;
  toOfficeName: string | null;
  fromUserId: string | null;
  fromUserName: string | null;
  toUserId: string | null;
  toUserName: string | null;
  movedByUserId: string;
  movedByUserName: string;
  notes: string | null;
  movementDate: string;
  createdAt: string;
}

export interface AuditLog {
  auditId: string;
  userId: string;
  userName: string;
  actionType: AuditActionType;
  entityType: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalSeals: number;
  inStock: number;
  assigned: number;
  inUse: number;
  lost: number;
  returned: number;
  totalBatches: number;
  totalUsers: number;
  totalOffices: number;
  recentMovements: StockMovement[];
  recentUsage: SealUsage[];
}
