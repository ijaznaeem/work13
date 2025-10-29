export interface IntimationLetter {
  IntimationID?: number;
  Date: Date;
  Time?: string;
  DepartmentID: number;
  DeptName?: string;
  NatureOfWork: string;
  Description?: string;
  InitiatedBy: number;
  InitiatingPerson?: string;
  Status?: number;
  StatusName?: string;
  jobCompletionDate?: Date;
  jobCompletionTime?: string;
  Remarks?: string;
  ForwardedTo?: number;
  ForwardTo?: string;
  IsClosed: boolean;
  ReceivedDate?: Date;
  ForwardDate?: Date;
}

export interface IntimationStatus {
  ID: number;
  Status: string;
}

export interface DocumentHistory {
  ID?: number;
  Date: Date;
  Time?: string;
  Remarks: string;
  DepatmentID: number; // Note: This has a typo in the database schema
  DeptName?: string;
  UserID: number;
  UserName?: string;
  DocumentID: number;
  Type: number;
  StatusID?: number;
  ForwardTo?: number;
  ForwardToName?: string;
}

export interface Department {
  DeptID: number;
  DeptName: string;
}

export interface User {
  UserID: number;
  UserName: string;
  FullName?: string;
  Department?: number;
}

export interface IntimationFilter {
  DepartmentID?: number;
  activeOnly: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  searchText?: string;
}
