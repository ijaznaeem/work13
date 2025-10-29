# Report Toolbar Integration Guide

## Overview
The Report Toolbar component provides a unified interface for exporting reports in multiple formats (PDF, Excel, CSV) with print functionality. It integrates seamlessly with the data-driven reporting system.

## Features Added

### 1. **Multi-Format Export**
- **PDF Export**: High-quality PDF generation with proper formatting
- **Excel Export**: Structured spreadsheet with data types preserved
- **CSV Export**: Comma-separated values for data interchange
- **Bulk Export**: Download multiple formats simultaneously

### 2. **Print Integration**
- **Print Button**: Direct printing with optimized layouts
- **Print-Hidden**: Toolbar automatically hidden during printing
- **Responsive Design**: Adapts to different screen sizes

### 3. **Smart Interaction**
- **Disabled State**: Toolbar disabled when no data available
- **Loading States**: Visual feedback during operations
- **Event Handling**: Proper event emission for custom logic

## Implementation in Purchase Ledger

### 1. **Component Integration**
```html
<app-report-toolbar
  [config]="currentReportConfig"
  [businessData]="businessData"
  [showBulkExport]="true"
  [class.disabled]="!data || data.length === 0"
  (print)="onToolbarPrint()"
  (exportPDF)="onToolbarExportPDF()"
  (exportExcel)="onToolbarExportExcel()"
  (exportCSV)="onToolbarExportCSV()"
  (exportMultiple)="onToolbarExportMultiple($event)">
</app-report-toolbar>
```

### 2. **Component Properties**
```typescript
public currentReportConfig: ReportConfig | null = null;
public businessData: any = {};
```

### 3. **Event Handlers**
```typescript
onToolbarPrint() {
  window.print();
}

onToolbarExportPDF() {
  // PDF export handled by toolbar component
  console.log('PDF export initiated');
}

// Similar handlers for Excel, CSV, and multiple formats
```

### 4. **Automatic Configuration Updates**
```typescript
updateReportConfig() {
  if (this.data && this.data.length > 0) {
    this.currentReportConfig = this.ps.prepareReportData(
      title,
      subTitle,
      this.data,
      this.setting.Columns,
      customerName,
      ReportTemplate.LEDGER
    );
  }
}
```

## Styling and Print Behavior

### 1. **Print Hiding**
```scss
@media print {
  app-report-toolbar,
  .report-toolbar {
    display: none !important;
  }
}
```

### 2. **Visual Integration**
```scss
app-report-toolbar {
  .btn-toolbar {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 6px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}
```

### 3. **Responsive Design**
```scss
@media (max-width: 768px) {
  .btn-toolbar {
    flex-direction: column;
  }
  
  .btn-group {
    margin-bottom: 10px;
  }
}
```

## Usage in Other Components

### Basic Implementation
```typescript
// 1. Import required types
import { ReportConfig, ReportTemplate } from '../models/report.models';

// 2. Add properties
public currentReportConfig: ReportConfig | null = null;
public businessData: any = {};

// 3. Prepare report configuration
updateReportConfig() {
  this.currentReportConfig = this.ps.prepareReportData(
    'Report Title',
    'Report Subtitle',
    this.data,
    this.columns,
    this.customerName,
    ReportTemplate.STANDARD
  );
}

// 4. Load business data
loadBusinessData() {
  this.http.getData('business/' + this.http.getBusinessID())
    .then(d => this.businessData = d);
}
```

### HTML Template
```html
<app-report-toolbar
  [config]="currentReportConfig"
  [businessData]="businessData"
  [showBulkExport]="false"
  (print)="onPrint()">
</app-report-toolbar>
```

## Toolbar Configuration Options

### Input Properties
- **`config`**: ReportConfig object containing report data and settings
- **`businessData`**: Business information for headers
- **`showBulkExport`**: Boolean to show/hide bulk export dropdown

### Output Events
- **`print`**: Emitted when print button clicked
- **`exportPDF`**: Emitted when PDF export initiated
- **`exportExcel`**: Emitted when Excel export initiated  
- **`exportCSV`**: Emitted when CSV export initiated
- **`exportMultiple`**: Emitted when bulk export initiated

## Export Quality and Features

### PDF Export
- Professional formatting with headers and footers
- Proper page breaks and table headers on each page
- Business logo and contact information
- Summary calculations and totals

### Excel Export
- Structured data with proper data types
- Column formatting (currency, dates, numbers)
- Summary rows with calculations
- Professional styling

### CSV Export
- Clean comma-separated format
- Proper text escaping for special characters
- Compatible with all spreadsheet applications
- Lightweight for large datasets

## Benefits

### 1. **User Experience**
- Single interface for all export options
- Consistent behavior across components
- Visual feedback and loading states
- Responsive design for all devices

### 2. **Developer Experience**
- Reusable component reduces code duplication
- Event-driven architecture for customization
- Type-safe interfaces and configuration
- Easy integration with existing components

### 3. **Print Optimization**
- Automatic hiding during print operations
- Optimized layouts for paper output
- Professional appearance for physical documents
- Consistent formatting across browsers

### 4. **Export Quality**
- High-quality output in all formats
- Maintains data integrity and formatting
- Professional business document appearance
- Suitable for sharing with stakeholders

## Migration Guide

### For Existing Components
1. **Import ReportConfig types**
2. **Add toolbar properties** (`currentReportConfig`, `businessData`)
3. **Add toolbar HTML** to template
4. **Implement event handlers** for toolbar actions
5. **Update data loading** to call `updateReportConfig()`
6. **Add print hiding styles** to component SCSS

### For New Components
1. **Use toolbar from the start** for consistent UX
2. **Configure report settings** based on component needs
3. **Customize export options** as required
4. **Test print behavior** across different browsers

This toolbar provides a professional, consistent interface for report operations while maintaining the flexibility to customize behavior for specific component needs.
