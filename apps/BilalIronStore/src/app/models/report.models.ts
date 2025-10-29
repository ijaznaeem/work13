// Report configuration interfaces
export interface ReportConfig {
  title: string;
  subTitle?: string;
  customerName?: string;
  pageSize: 'A4' | 'A5' | 'Letter';
  orientation: 'portrait' | 'landscape';
  headerConfig?: HeaderConfig;
  tableConfig?: TableConfig;
  footerConfig?: FooterConfig;
  exportOptions?: ExportOptions;
}

export interface HeaderConfig {
  showLogo?: boolean;
  logoUrl?: string;
  businessName?: string;
  address?: string;
  phone?: string;
  customFields?: CustomField[];
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  showSummary?: boolean;
  summaryFields?: string[];
  styling?: TableStyling;
}

export interface TableColumn {
  label: string;
  field: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: 'currency' | 'number' | 'date' | 'percentage';
  sum?: boolean;
  visible?: boolean;
}

export interface TableStyling {
  headerBackgroundColor?: string;
  headerTextColor?: string;
  borderColor?: string;
  fontSize?: number;
  cellPadding?: number;
}

export interface FooterConfig {
  showPageNumbers?: boolean;
  customText?: string;
  showDateTime?: boolean;
}

export interface ExportOptions {
  filename?: string;
  formats?: ('pdf' | 'excel' | 'csv')[];
  pdfOptions?: PDFOptions;
}

export interface PDFOptions {
  margins?: { top: number; left: number; right: number; bottom: number };
  fontSize?: number;
  lineHeight?: number;
}

export interface CustomField {
  label: string;
  value: string;
  position?: 'left' | 'right' | 'center';
}

// Report templates enum
export enum ReportTemplate {
  STANDARD = 'standard',
  INVOICE = 'invoice',
  LEDGER = 'ledger',
  SUMMARY = 'summary',
  CUSTOM = 'custom'
}
