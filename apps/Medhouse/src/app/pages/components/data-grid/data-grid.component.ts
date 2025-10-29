import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  ColumnModel,
  CommandClickEventArgs,
  CommandModel,
  GridComponent,
  SelectionSettingsModel,
  SortSettingsModel,
  FilterSettingsModel,
  PageSettingsModel,
  RowSelectEventArgs,
  RecordDoubleClickEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'ft-data-grid',
  templateUrl: './data-grid.component.html',
})
export class DataGridComponent implements OnInit, OnChanges {
  @ViewChild('grid')
  public grid!: GridComponent;
  @ViewChild('search') txtSearch!: ElementRef;
  @ViewChild('template') colTemplate!: TemplateRef<any>;

  @Input() Search = '';
  @Input() Orderby = '';
  @Input() ShowSearch = true;

  @Input('Data') DataSrvc: any = [];
  @Input() data!: any;
  @Input() columns: ColumnModel[] | any = [];


  // Enhanced Properties
  @Input() loading = false;
  @Input() height = 300;
  @Input() pageSize = 25;
  @Input() allowPaging = true;
  @Input() allowSorting = true;
  @Input() allowFiltering = false;
  @Input() allowResizing = true;
  @Input() allowReordering = false;
  @Input() selectionMode: 'Single' | 'Multiple' | 'None' = 'Single';
  @Input() showToolbar = false;
  @Input() toolbarItems: string[] = ['Search'];
  @Input() enableRtl = false;
  @Input() enableVirtualization = false;
  @Input() frozenColumns = 0;
  @Input() frozenRows = 0;
  @Input() showRowIndex = false;
  @Input() showCheckbox = false;
  @Input() emptyRecordTemplate!: TemplateRef<any>;
  @Input() customCssClass = '';
  @Input() allowExport = false;
  @Input() exportFileName = 'GridExport';
  @Input() sortable = true;
  @Input() filterable = false;

  // Event Emitters
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();
  @Output() RowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnLinkClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() rowDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionBegin: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionComplete: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataBound: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() beforePrint: EventEmitter<any> = new EventEmitter<any>();
  @Output() beforeExport: EventEmitter<any> = new EventEmitter<any>();

  // Grid Settings
  public commands!: CommandModel[];
  public selectionOptions!: SelectionSettingsModel;
  public sortSettings!: SortSettingsModel;
  public filterSettings!: FilterSettingsModel;
  public pageSettings!: PageSettingsModel;
  
  // Internal properties
  public processedData: any[] = [];
  public selectedRecords: any[] = [];
  public filteredData: any[] = [];
  constructor(private http: HttpBase, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.initializeGridSettings();
    this.loadData();
    this.setupCommands();
    this.configureColumns();
  }

  private initializeGridSettings(): void {
    // Selection settings
    this.selectionOptions = { 
      type: this.selectionMode as any, 
      mode: 'Row',
      checkboxOnly: this.showCheckbox 
    };

    // Sort settings
    this.sortSettings = { 
      allowUnsort: true,
      columns: []
    };

    // Filter settings
    this.filterSettings = { 
      type: 'FilterBar',
      showFilterBarStatus: true
    };

    // Page settings
    this.pageSettings = { 
      pageSize: this.pageSize,
      pageSizes: [10, 25, 50, 100]
    };
  }

  private setupCommands(): void {
    this.commands = [
      {
        buttonOption: { content: '', iconCss: 'fa fa-check', isPrimary: true },
      },
    ];
  }

  private configureColumns(): void {
    if (!this.columns) return;
    
    this.columns = this.columns.map((col: any) => {
      const column: any = {
        ...col,
        allowSorting: this.allowSorting && (col.sortable !== false),
        allowFiltering: this.allowFiltering && (col.filterable !== false),
        allowResizing: this.allowResizing
      };

      // Set default width if not specified
      if (!column.width) column.width = 100;
      
      // Set default type if not specified
      if (!column.Type) column.Type = 'text';

      // Configure column formatting based on type
      if (column.Type === 'date') {
        column.type = 'date';
        column.format = 'dd-MMM-yyyy';
      } else if (column.Type === 'currency') {
        column.type = 'number';
        column.format = 'C0'; // Currency format with 0 decimal places
      } else if (column.Type === 'number') {
        column.type = 'number';
        column.format = 'N2'; // Number with 2 decimal places
      }

      return column;
    });
  }
  FilterData() {
    if (!this.Search || this.Search.trim() === '') {
      this.data = [...this.DataSrvc];
      return;
    }

    const term = this.Search.toLowerCase();
    this.data = this.DataSrvc.filter((item: any) => {
      return Object.keys(item).some(key => {
        const value = item[key];
        if (value && typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      });
    });
  }

  ngAfterViewInit() {
    if (this.ShowSearch && this.txtSearch) {
      this.txtSearch.nativeElement.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      this.cdr.detectChanges();
      this.loadData();
      if (changes['columns']) {
        this.configureColumns();
      }
    }
    
    if (changes['selectionMode']) {
      this.updateSelectionSettings();
    }
  }

  private updateSelectionSettings(): void {
    this.selectionOptions = { 
      type: this.selectionMode as any, 
      mode: 'Row',
      checkboxOnly: this.showCheckbox 
    };
  }

  loadData() {
    this.processedData = [...this.DataSrvc];
    this.data = [...this.processedData];
    this.filteredData = [...this.data];
  }

  // Enhanced Grid Event Handlers
  GridRowClicked(e: RowSelectEventArgs) {
    this.selectedRecords = this.grid?.getSelectedRecords() || [];
    this.RowClicked.emit(e);
    this.selectionChange.emit(this.selectedRecords);
  }

  onRowDoubleClick(event: RecordDoubleClickEventArgs) {
    this.rowDoubleClick.emit(event);
  }

  onDataBound(event: any): void {
    if (this.grid) {
      this.grid.autoFitColumns();
    }
    this.dataBound.emit(event);
  }

  OnLinkClicked(event: any) {
    this.OnLinkClick.emit(event);
  }

  commandClick(args: CommandClickEventArgs): void {
    this.Event.emit({ command: 'OK', data: args.rowData });
  }

  // Enhanced Public Methods
  public SetDataSource(data: any): void {
    this.DataSrvc = data;
    this.loadData();
    this.cdr.detectChanges();
  }

  public GetSelectedRecord(): any[] {
    return this.grid?.getSelectedRecords() || [];
  }

  public GetSelectedRecords(): any[] {
    return this.GetSelectedRecord();
  }

  public GetTotalrecord(): number {
    return this.DataSrvc?.length || 0;
  }

  public ClearSelection(): void {
    if (this.grid) {
      this.grid.clearSelection();
      this.selectedRecords = [];
      this.selectionChange.emit([]);
    }
  }

  public SelectRow(index: number): void {
    if (this.grid && index >= 0 && index < this.data.length) {
      this.grid.selectRow(index);
    }
  }

  public SelectRows(indexes: number[]): void {
    if (this.grid && this.selectionMode === 'Multiple') {
      this.grid.selectRows(indexes);
    }
  }

  public RefreshData(): void {
    if (this.grid) {
      this.grid.refresh();
    }
  }

  public ExportToExcel(): void {
    if (this.grid && this.allowExport) {
      this.grid.excelExport({
        fileName: this.exportFileName + '.xlsx'
      });
    }
  }

  public ExportToPdf(): void {
    if (this.grid && this.allowExport) {
      this.grid.pdfExport({
        fileName: this.exportFileName + '.pdf'
      });
    }
  }

  public Print(): void {
    if (this.grid) {
      this.grid.print();
    }
  }

  public SetSearchTerm(searchTerm: string): void {
    this.Search = searchTerm;
    this.FilterData();
  }

  public ClearSearch(): void {
    this.Search = '';
    this.FilterData();
  }

  public SortColumn(field: string, direction: 'Ascending' | 'Descending' = 'Ascending'): void {
    if (this.grid && this.allowSorting) {
      this.grid.sortColumn(field, direction);
    }
  }

  public ClearSorting(): void {
    if (this.grid) {
      this.grid.clearSorting();
    }
  }

  public ApplyFilter(field: string, operator: string, value: any): void {
    if (this.grid && this.allowFiltering) {
      this.grid.filterByColumn(field, operator, value);
    }
  }

  public ClearFiltering(): void {
    if (this.grid) {
      this.grid.clearFiltering();
    }
  }

  public GoToPage(pageNumber: number): void {
    if (this.grid && this.allowPaging) {
      this.grid.goToPage(pageNumber);
    }
  }

  public ChangePageSize(pageSize: number): void {
    if (this.grid && this.allowPaging) {
      this.pageSize = pageSize;
      this.pageSettings.pageSize = pageSize;
      this.grid.pageSettings.pageSize = pageSize;
    }
  }

  // Event Handlers for Enhanced Features
  onActionBegin(event: any): void {
    this.actionBegin.emit(event);
  }

  onActionComplete(event: any): void {
    this.actionComplete.emit(event);
  }

  onCellSave(event: any): void {
    this.cellSave.emit(event);
  }

  onBeforePrint(event: any): void {
    this.beforePrint.emit(event);
  }

  onBeforeExport(event: any): void {
    this.beforeExport.emit(event);
  }

  // Utility Methods
  public GetCurrentPageData(): any[] {
    if (this.grid && this.allowPaging) {
      return this.grid.getCurrentViewRecords();
    }
    return this.data;
  }

  public GetFilteredData(): any[] {
    return this.filteredData;
  }

  public IsRowSelected(rowData: any): boolean {
    return this.selectedRecords.some(record => 
      JSON.stringify(record) === JSON.stringify(rowData)
    );
  }

  public GetColumnByField(field: string): ColumnModel | undefined {
    return this.columns?.find((col: any) => col.field === field);
  }

  public ShowColumn(field: string): void {
    if (this.grid) {
      this.grid.showColumns(field);
    }
  }

  public HideColumn(field: string): void {
    if (this.grid) {
      this.grid.hideColumns(field);
    }
  }

  public ResizeColumn(field: string, width: number): void {
    const column = this.GetColumnByField(field);
    if (column) {
      column.width = width;
      this.RefreshData();
    }
  }

  // Helper method for debugging
  log(data: any): void {
    console.log('ft-data-grid:', data);
  }
}
