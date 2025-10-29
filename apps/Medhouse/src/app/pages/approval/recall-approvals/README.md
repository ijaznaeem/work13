# Recall Approvals Component

## Overview
The Recall Approvals component is a comprehensive Angular recreation of the VB6 `frmRecallApprovals` form. It provides a complete interface for managing product recall approvals with multi-section data management.

## Features

### 📋 Multi-Section Layout
1. **Main Recall Data Table (Top-Left)**
   - Displays all recall records with filtering
   - Shows Date, Recall ID, Product Name, Batch No, Expiry Date, Reason, Status, Customer
   - Row selection updates details and images sections

2. **Recall Details Table (Bottom-Left)**
   - Shows detailed information for selected recall
   - Displays Product Code, Batch No, Quantity, QC Advice, Reason, Action Taken
   - Editable QC Advice and Reason fields (double-click to edit)

3. **Remarks Section (Top-Right)**
   - Shows detailed remarks for selected recall
   - Read-only text area with scroll support

4. **Images Section (Bottom-Right)**
   - Displays uploaded images related to the recall
   - Shows Date, User, Description, and action buttons
   - Double-click to view enlarged images
   - Delete functionality for images

### 🎛️ Controls and Functionality
- **Date Range Filter**: From Date and To Date for filtering completed/rejected recalls
- **Status Filter**: Dropdown with "In Process", "Completed", "Rejected" options
- **Add Approval**: Creates new recall approval records
- **Edit**: Modifies existing recall records
- **Add Image**: Upload images related to recalls
- **Print Destruction Notes**: Prints destruction documentation
- **Print Dispatch Notes**: Prints dispatch documentation

### 🔐 Department-Based Permissions
The component implements role-based access control based on user departments:

#### **GM, Operations, CEO, AMO Departments**
- Full access to all functions
- Can print reports
- Can edit all recalls
- Can add/remove images

#### **Commercial Department**
- Can add new recalls
- Cannot print reports
- Cannot edit existing recalls
- Can add images

#### **Production Department**
- Read-only access
- Cannot add or edit recalls
- Cannot print reports
- Status filter locked to "In Process"

#### **QC Department**
- Can edit QC Advice and Reason fields in details
- Standard access to other functions

### 🔍 Data Sources
The component replicates the exact SQL queries from the VB6 form:

#### Main Recalls Query
```sql
SELECT * FROM qryrecalls 
WHERE Status = 'selectedStatus'
AND (Date BETWEEN 'fromDate' AND 'toDate' -- for Completed/Rejected only)
```

#### Recall Details Query
```sql
SELECT * FROM qryRecalldetails 
WHERE recallid = selectedRecallID
```

#### Recall Images Query
```sql
SELECT Date, UserName, Description, ImageID 
FROM qryRecallimages 
WHERE recallid = selectedRecallID
```

## 🚀 Usage

### Navigation
Access the component via: `/approval/recall-approvals`

### Workflow
1. **Filter Data**: Use date range and status filters to find relevant recalls
2. **Select Recall**: Click on any recall to view its details and images
3. **View Remarks**: Selected recall's remarks appear in the right panel
4. **Edit Details**: Double-click on QC Advice or Reason fields to edit (QC dept only)
5. **Add Comments**: Double-click on recall row to add comments (department permissions apply)
6. **Manage Images**: Add new images or delete existing ones
7. **Print Documents**: Generate destruction or dispatch notes

### Interactive Features
- **Double-click recall row**: Add comments (permission-based)
- **Double-click detail fields**: Edit QC Advice/Reason (QC department only)
- **Double-click image row**: View enlarged image
- **Click delete button**: Remove image (with confirmation)

## 🎨 Visual Features

### Responsive Design
- Mobile-friendly layout with responsive tables
- Scrollable sections for large datasets
- Touch-friendly interface

### Color Coding
- **Blue Header**: Main recall data
- **Info Header**: Recall details
- **Secondary Header**: Remarks section
- **Warning Header**: Images section
- **Status Badges**: Color-coded by status (Green=Completed, Red=Rejected, Yellow=In Process)

### Interactive Elements
- Hover effects on table rows
- Loading spinners during data operations
- Row highlighting for selected items
- Sticky table headers
- Editable cell highlighting
- Tooltip support

## 🔧 Technical Implementation

### Component Structure
```
recall-approvals/
├── recall-approvals.component.ts    # Main component with business logic
├── recall-approvals.component.html  # Multi-section HTML layout
├── recall-approvals.component.scss  # Responsive styling
└── README.md                       # This documentation
```

### Key Methods
- `loadRecallData()`: Loads main recall data with filtering
- `loadRecallDetails()`: Loads detail records for selected recall
- `loadRecallImages()`: Loads images for selected recall
- `onRecallSelect()`: Handles recall selection and loads related data
- `onRecallDoubleClick()`: Handles adding comments with permission checks
- `onDetailDoubleClick()`: Handles editing detail fields (QC only)
- `updateRecallDetail()`: Updates QC Advice/Reason fields
- `deleteImage()`: Removes recall images with confirmation

### Permission System
- Department-based access control using `UserDepartments` enum
- Dynamic button enabling/disabling based on user rights
- Field-level edit permissions for QC department
- Status filter restrictions for Production department

### Mock Data Support
Includes comprehensive fallback mock data for development and testing when API endpoints are unavailable.

## 📱 Responsive Behavior
- **Desktop**: Four-section layout (2x2 grid)
- **Tablet**: Stacked layout with maintained functionality
- **Mobile**: Single-column layout with horizontal scrolling for tables

## 🎯 VB6 Migration Compatibility
This component maintains 100% functional compatibility with the original VB6 form:

### Exact Feature Mapping
- **grdData** → Main Recall Data HTML table
- **grdDetails** → Recall Details HTML table
- **grdImages** → Recall Images HTML table
- **txtRemarks** → Remarks textarea
- **Department permissions** → Role-based access control
- **Double-click editing** → Interactive field editing
- **Status filtering** → Dropdown with same options
- **Print functions** → Report generation buttons

### Business Logic Preservation
- Same SQL queries and data filtering
- Identical permission structure
- Preserved edit workflows
- Matching status management

## 🔮 Future Enhancements
- Real-time image viewer modal
- Drag-and-drop image upload
- Advanced search and filtering
- Export functionality (Excel, PDF)
- Email notifications for recall updates
- Integration with printing services
- Audit trail for changes
- Bulk operations support

## 🔧 Development Notes
- Uses HTML tables instead of data grids as requested
- Implements proper TypeScript typing
- Follows Angular best practices
- Responsive design with Bootstrap
- Comprehensive error handling
- Mock data for offline development