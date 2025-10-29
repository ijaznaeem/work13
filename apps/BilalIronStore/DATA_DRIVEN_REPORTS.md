# Data-Driven Report Generation - Usage Guide

## Overview
The PrintHtmlComponent has been enhanced to generate reports directly from data and column configurations instead of relying on DOM HTML manipulation. This provides better control, performance, and flexibility.

## Key Changes

### 1. **Data-Driven Table Generation**
- Reports are now generated from structured data and column definitions
- Angular template-based table rendering
- Better TypeScript type safety
- Improved styling and formatting control

### 2. **Backward Compatibility**
- Legacy HTML-based reports still supported
- Automatic fallback to DOM extraction if needed
- Smooth migration path for existing components

## Usage Examples

### Basic Usage with ReportConfig

```typescript
// In your component (e.g., purchase-ledger.component.ts)
PrintReport() {
  const reportConfig = this.ps.prepareReportData(
    'Purchase Ledger',
    `From: ${JSON2Date(this.Filter.FromDate)} To: ${JSON2Date(this.Filter.ToDate)}`,
    this.data, // Your actual data array
    this.setting.Columns, // Column definitions
    this.selectedCustomer?.CustomerName,
    ReportTemplate.LEDGER
  );
  
  // Set the report config for data-driven generation
  this.ps.PrintData.reportConfig = reportConfig;
  
  // Optional: Keep legacy data for backward compatibility
  this.ps.PrintData.HTMLData = document.getElementById('print-section');
  this.ps.PrintData.Title = 'Purchase Ledger';
  
  this.router.navigateByUrl('/print/print-html');
}
```

### Manual ReportConfig Creation

```typescript
// Create custom report configuration
const reportConfig: ReportConfig = {
  title: 'Custom Sales Report',
  subTitle: 'Monthly Analysis',
  pageSize: 'A4',
  orientation: 'portrait',
  
  tableConfig: {
    columns: [
      { 
        label: 'Date', 
        field: 'date', 
        format: 'date', 
        align: 'left',
        width: '15%'
      },
      { 
        label: 'Product', 
        field: 'productName', 
        align: 'left',
        width: '40%'
      },
      { 
        label: 'Quantity', 
        field: 'qty', 
        align: 'right',
        sum: true,
        width: '15%'
      },
      { 
        label: 'Amount', 
        field: 'amount', 
        format: 'currency', 
        align: 'right',
        sum: true,
        width: '20%'
      }
    ],
    data: this.salesData,
    showSummary: true
  }
};

// Set and navigate
this.ps.PrintData.reportConfig = reportConfig;
this.router.navigateByUrl('/print/print-html');
```

## Column Configuration Options

### Basic Column Properties
```typescript
{
  label: string;           // Display name for the column
  field: string;           // Property name in data object
  width?: string;          // Column width (e.g., '20%', '100px')
  align?: 'left' | 'center' | 'right';  // Text alignment
  visible?: boolean;       // Show/hide column (default: true)
  sum?: boolean;          // Include in summary calculations
  format?: string;        // Data formatting type
}
```

### Supported Formats
- `'currency'` - Formats as currency ($1,234.56)
- `'number'` - Formats as number with thousands separator (1,234)
- `'percentage'` - Formats as percentage (12.34%)
- `'date'` - Formats as date (MM/DD/YYYY)

## Data Structure

Your data array should contain objects with properties matching the column field names:

```typescript
const salesData = [
  {
    date: '2024-01-15',
    productName: 'Widget A',
    qty: 100,
    amount: 1500.00
  },
  {
    date: '2024-01-16',
    productName: 'Widget B', 
    qty: 50,
    amount: 750.00
  }
];
```

## Migration from Legacy Approach

### Before (Legacy DOM-based)
```typescript
PrintReport() {
  this.ps.PrintData.HTMLData = document.getElementById('print-section');
  this.ps.PrintData.Title = 'My Report';
  this.ps.PrintData.SubTitle = 'Report Subtitle';
  this.router.navigateByUrl('/print/print-html');
}
```

### After (Data-driven)
```typescript
PrintReport() {
  // Create report configuration
  const reportConfig = this.ps.prepareReportData(
    'My Report',
    'Report Subtitle',
    this.data,
    this.columns,
    undefined,
    ReportTemplate.STANDARD
  );
  
  // Use data-driven approach
  this.ps.PrintData.reportConfig = reportConfig;
  
  // Optional: Keep legacy for fallback
  this.ps.PrintData.HTMLData = document.getElementById('print-section');
  this.ps.PrintData.Title = 'My Report';
  
  this.router.navigateByUrl('/print/print-html');
}
```

## Benefits of Data-Driven Approach

### 1. **Better Performance**
- No DOM cloning or manipulation
- Faster rendering and export
- Lower memory usage

### 2. **Enhanced Styling Control**
- Consistent formatting across all reports
- Better print optimization
- Responsive design support

### 3. **Type Safety**
- Strong TypeScript typing
- Compile-time error checking
- Better IDE support

### 4. **Export Quality**
- Cleaner PDF generation
- Better Excel export with proper data types
- More accurate CSV export

### 5. **Maintainability**
- Centralized table generation logic
- Easier to modify and extend
- Consistent behavior across components

## Fallback Behavior

The component automatically detects the available data and chooses the best rendering method:

1. **Priority 1**: Data-driven rendering (if `reportConfig.tableConfig` exists)
2. **Priority 2**: Legacy HTML rendering (if `printdata.HTMLData` exists)
3. **Fallback**: Empty table with header information only

This ensures compatibility with existing reports while enabling new data-driven features.

## Troubleshooting

### Common Issues

1. **Table not rendering**: Ensure `reportConfig.tableConfig` has both `columns` and `data` properties
2. **Formatting not working**: Check that column `format` property matches supported formats
3. **Summary not showing**: Verify that `showSummary: true` and at least one column has `sum: true`
4. **Export issues**: Ensure data types match expected formats for currency/number columns

### Debug Tips

```typescript
// Add logging to check data structure
console.log('Report Config:', this.ps.PrintData.reportConfig);
console.log('Table Data:', this.ps.PrintData.reportConfig?.tableConfig?.data);
console.log('Columns:', this.ps.PrintData.reportConfig?.tableConfig?.columns);
```
