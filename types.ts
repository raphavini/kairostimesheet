export enum ContractStatus {
  Active = "Active",
  Pending = "Pending",
  Expired = "Expired",
}

export enum LogType {
  Evolutivo = "Evolutivo",
  Corretivo = "Corretivo",
  Operacional = "Operacional",
}

export interface Client {
  id: string;
  name: string;
  logo: string;
}

export interface Contract {
  id: string;
  clientId: string;
  name: string;
  totalHours: number;
  usedHours: number;
  hourlyRate: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
}

export interface Project {
  id: string;
  contractId: string;
  name: string;
}

export interface WorkLog {
  id: string;
  projectId: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  type: LogType;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  two_factor_enabled?: boolean;
}

// New Types for Audit Logs
export enum AuditActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
}

export interface AuditChange {
  field: string;
  oldValue: string | number | null;
  newValue: string | number | null;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: User;
  action: AuditActionType;
  entityType: string; // e.g., "Contract", "Billing Cycle", "User Access"
  description: string;
  details: string; // Detailed summary for the drawer
  changes?: AuditChange[];
  metadata: {
    sessionId: string;
    userAgent: string;
    ip: string;
    location: string;
  };
}