import { Client, Contract, ContractStatus, LogType, Project, User, WorkLog, AuditEvent, AuditActionType } from "./types";

export const MOCK_USER: User = {
  id: "u1",
  name: "Alex Rivera",
  role: "Global Admin",
  avatar: "https://picsum.photos/id/64/100/100",
};

export const MOCK_CLIENTS: Client[] = [
  { id: "c1", name: "Madesa", logo: "M" },
  { id: "c2", name: "Raiz", logo: "R" },
  { id: "c3", name: "Trentini", logo: "T" },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "cnt1",
    clientId: "c1",
    name: "Madesa Enterprise Support",
    totalHours: 120,
    usedHours: 85.5,
    hourlyRate: 150,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: ContractStatus.Active,
  },
  {
    id: "cnt2",
    clientId: "c2",
    name: "Raiz Cloud Migration",
    totalHours: 200,
    usedHours: 45,
    hourlyRate: 180,
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    status: ContractStatus.Active,
  },
  {
    id: "cnt3",
    clientId: "c3",
    name: "Trentini UI Redesign",
    totalHours: 50,
    usedHours: 48,
    hourlyRate: 140,
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    status: ContractStatus.Pending,
  },
];

export const MOCK_PROJECTS: Project[] = [
  { id: "p1", contractId: "cnt1", name: "Legacy ERP Maintenance" },
  { id: "p2", contractId: "cnt1", name: "New API Integration" },
  { id: "p3", contractId: "cnt2", name: "AWS Infrastructure" },
  { id: "p4", contractId: "cnt2", name: "Database Optimization" },
  { id: "p5", contractId: "cnt3", name: "Design System Implementation" },
];

export const MOCK_LOGS: WorkLog[] = [
  {
    id: "l1",
    projectId: "p1",
    userId: "u1",
    date: "2023-10-24",
    hours: 4.5,
    description: "Fixed critical bug in DB schema related to user auth.",
    type: LogType.Corretivo,
  },
  {
    id: "l2",
    projectId: "p2",
    userId: "u1",
    date: "2023-10-24",
    hours: 2.0,
    description: "Meeting with client to discuss API requirements.",
    type: LogType.Operacional,
  },
  {
    id: "l3",
    projectId: "p3",
    userId: "u1",
    date: "2023-10-23",
    hours: 6.0,
    description: "Implemented new Lambda functions for image processing.",
    type: LogType.Evolutivo,
  },
  {
    id: "l4",
    projectId: "p5",
    userId: "u1",
    date: "2023-10-22",
    hours: 3.5,
    description: "Created Figma components for the new button styles.",
    type: LogType.Evolutivo,
  },
];

// Audit Mock Data
export const MOCK_AUDIT_LOGS: AuditEvent[] = [
  {
    id: "LOG-99283-X4",
    timestamp: "2023-10-24T14:23:12",
    user: {
      id: "u2",
      name: "Alex Thompson",
      role: "Super Admin",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    action: AuditActionType.UPDATE,
    entityType: "Contract",
    description: "Modified Contract",
    details: "Alex Thompson modified the Annual Maintenance Contract value for Acme Global Ltd.",
    changes: [
      { field: "CONTRACT_VALUE", oldValue: "$50,000.00", newValue: "$75,000.00" },
      { field: "EXPIRY_DATE", oldValue: "2024-01-01", newValue: "2025-01-01" },
    ],
    metadata: {
      sessionId: "sess_9k2m10Lpq",
      userAgent: "Chrome / macOS 14.1",
      ip: "192.168.12.44",
      location: "San Francisco, US",
    },
  },
  {
    id: "LOG-99284-Y2",
    timestamp: "2023-10-24T13:58:04",
    user: {
      id: "u3",
      name: "Sarah Jenkins",
      role: "Billing Manager",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    action: AuditActionType.CREATE,
    entityType: "Billing Cycle",
    description: "Closed Billing Cycle",
    details: "Sarah Jenkins generated invoices for October 2023 cycle.",
    metadata: {
      sessionId: "sess_8j2k11Mqr",
      userAgent: "Firefox / Windows 11",
      ip: "10.0.0.15",
      location: "New York, US",
    },
  },
  {
    id: "LOG-99285-Z1",
    timestamp: "2023-10-24T12:10:55",
    user: {
      id: "u4",
      name: "Marcus Wright",
      role: "Security Lead",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    action: AuditActionType.DELETE,
    entityType: "User Access",
    description: "Revoked User Access",
    details: "Marcus Wright removed access for user 'j.doe@legacy.com' due to inactivity.",
    metadata: {
      sessionId: "sess_7h3j99Klo",
      userAgent: "Safari / iOS 17",
      ip: "172.16.0.5",
      location: "London, UK",
    },
  },
  {
    id: "LOG-99286-A9",
    timestamp: "2023-10-24T10:45:22",
    user: {
      id: "bot1",
      name: "System Bot",
      role: "Automated",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=system",
    },
    action: AuditActionType.UPDATE,
    entityType: "Database",
    description: "Sync Database",
    details: "Automated nightly sync completed successfully.",
    metadata: {
      sessionId: "system_cron",
      userAgent: "Server / Linux",
      ip: "127.0.0.1",
      location: "Data Center",
    },
  },
];
