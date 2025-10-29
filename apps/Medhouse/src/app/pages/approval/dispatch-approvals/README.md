# Dispatch Approvals Component

## Overview
The Dispatch Approvals component is a faithful Angular recreation of the VB6 `frmDespatchNotes` form. It provides a comprehensive interface for managing dispatch approvals with three main data sections.

## Features

### 📋 Three-Table Layout
1. **Pending Invoices Table (Top-Left)**
   - Displays invoices ready for dispatch
   - Shows Date, Invoice No, Customer Name, Address, City
   - Row selection updates the details table below

2. **Completed Dispatch Table (Right)**
   - Shows completed dispatch notes within date range
   - Displays Date, Dispatch ID, Invoice No, Customer, Status, Amount
   - Row selection updates the details table

3. **Details Table (Bottom-Left)**
   - Dynamically shows details based on selection from other tables
   - For pending invoices: Product Name, Qty, Bonus, Total Qty, Rate, Amount
   - For completed dispatch: Dispatch item details

### 🎛️ Controls and Functionality
- **Date Range Filter**: From Date and To Date controls for filtering completed dispatch
- **Generate Button**: Creates new dispatch notes for selected pending invoices
- **Print Report**: Prints comprehensive dispatch report
- **Print Dispatch**: Prints individual dispatch note
- **Exit**: Closes the form

### 🔍 Data Sources
The component replicates the exact SQL queries from the VB6 form:

#### Pending Invoices Query
```sql
Select Date, InvoiceID as InvoiceNo, CustomerName, Address, City 
from qryInvoices 
where Date > '8/1/2023' and dbo.Despatched(InvoiceID) > 0 and DtCR = 'CR'
```

#### Completed Dispatch Query
```sql
Select * from qryDespatchNotes 
where Date Between 'fromDate' And 'toDate'
```

#### Invoice Details Query
```sql
Select ProductName, Qty, Bonus, Qty+Bonus as TotalQty 
from qryInvDet 
where InvoiceID = selectedInvoiceID
```

#### Dispatch Details Query
```sql
Select * from qryDespatchDetails 
where DespatchID = selectedDespatchID
```

## 🚀 Usage

### Navigation
Access the component via: `/approval/dispatch-approvals`

### Workflow
1. **View Pending Invoices**: See all invoices ready for dispatch
2. **Select Invoice**: Click on any pending invoice to view its details
3. **Generate Dispatch**: Click "Generate" to create dispatch note for selected invoice
4. **Filter Completed**: Use date range to filter completed dispatch notes
5. **View Completed Details**: Click on completed dispatch to see item details
6. **Print Documents**: Use print buttons for reports and dispatch notes

## 🎨 Visual Features

### Responsive Design
- Mobile-friendly layout with responsive tables
- Collapsible sections on smaller screens
- Touch-friendly interface

### Color Coding
- **Blue Header**: Pending invoices
- **Green Header**: Completed dispatch notes
- **Info Header**: Details section
- **Status Badges**: Visual status indicators

### Interactive Elements
- Hover effects on table rows
- Loading spinners during data fetch
- Row highlighting for selected items
- Sticky table headers for large datasets

## 🔧 Technical Implementation

### Component Structure
```
dispatch-approvals/
├── dispatch-approvals.component.ts    # Main component logic
├── dispatch-approvals.component.html  # Three-table layout
└── dispatch-approvals.component.scss  # Responsive styling
```

### Key Methods
- `loadPendingInvoices()`: Loads pending invoice data
- `loadCompletedDispatch()`: Loads completed dispatch with date filtering
- `onPendingInvoiceSelect()`: Handles pending invoice selection
- `onCompletedDispatchSelect()`: Handles completed dispatch selection
- `generateDispatch()`: Creates new dispatch note
- `printReport()` & `printDispatch()`: Print functionality

### Mock Data Support
Includes fallback mock data for development and testing when API endpoints are not available.

## 📱 Responsive Behavior
- **Desktop**: Three-column layout with side-by-side tables
- **Tablet**: Stacked layout with maintained table functionality
- **Mobile**: Condensed tables with horizontal scrolling

## 🎯 VB6 Migration Compatibility
This component maintains 100% functional compatibility with the original VB6 form:
- Same data queries and business logic
- Identical user workflow
- Preserved button functionality
- Matching visual hierarchy

## 🔮 Future Enhancements
- Real-time data updates
- Export functionality (Excel, PDF)
- Advanced filtering options
- Batch dispatch operations
- Integration with printing services