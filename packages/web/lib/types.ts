/**
 * Shared type definitions matching the API schema
 */

export type Role = 'ADMIN' | 'LAB_MANAGER' | 'ANALYST' | 'SALES_ACCOUNTING' | 'CLIENT';

export type JobStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type TestAssignmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'RELEASED';

export type COAReportStatus = 'DRAFT' | 'FINAL' | 'SUPERSEDED';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  clientId: string;
  client?: Client;
  needByDate?: string;
  mcdDate?: string;
  status: JobStatus;
  quoteNumber?: string;
  poNumber?: string;
  soNumber?: string;
  amountExTax?: number;
  invoiced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sample {
  id: string;
  sampleCode: string;
  jobId: string;
  job?: Job;
  clientId: string;
  client?: Client;
  dateReceived: string;
  dateDue?: string;
  rmSupplier?: string;
  sampleDescription?: string;
  uinCode?: string;
  sampleBatch?: string;
  temperatureOnReceiptC?: number;
  storageConditions?: string;
  comments?: string;
  expiredRawMaterial: boolean;
  postIrradiatedRawMaterial: boolean;
  stabilityStudy: boolean;
  urgent: boolean;
  allMicroTestsAssigned: boolean;
  allChemistryTestsAssigned: boolean;
  released: boolean;
  retest: boolean;
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Method {
  id: string;
  code: string;
  name: string;
  description?: string;
  unit?: string;
  lod?: number;
  loq?: number;
}

export interface Specification {
  id: string;
  code: string;
  name: string;
  target?: number;
  min?: number;
  max?: number;
  unit?: string;
  oosRule?: string;
}

export interface Section {
  id: string;
  name: string;
}

export interface TestDefinition {
  id: string;
  name: string;
  defaultDueDays?: number;
  sectionId?: string;
  section?: Section;
  methodId?: string;
  method?: Method;
  specificationId?: string;
  specification?: Specification;
}

export interface TestAssignment {
  id: string;
  sampleId: string;
  sample?: Sample;
  testDefinitionId?: string;
  testDefinition?: TestDefinition;
  customTestName?: string;
  sectionId?: string;
  section?: Section;
  methodId?: string;
  method?: Method;
  specificationId?: string;
  specification?: Specification;
  analystId?: string;
  analyst?: User;
  dueDate?: string;
  testDate?: string;
  status: TestAssignmentStatus;
  result?: string;
  resultUnit?: string;
  oos: boolean;
  chkById?: string;
  chkDate?: string;
  comments?: string;
  invoiceNote?: string;
  precision?: string;
  linearity?: string;
}

export interface COAReport {
  id: string;
  sampleId: string;
  sample?: Sample;
  version: number;
  status: COAReportStatus;
  dataSnapshot: unknown;
  htmlSnapshot?: string;
  pdfKey?: string;
  reportedAt?: string;
  reportedById?: string;
  approvedById?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorEmail?: string;
  action: AuditAction;
  table: string;
  recordId: string;
  changes: unknown;
  txId: string;
  ip?: string;
  userAgent?: string;
  at: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
