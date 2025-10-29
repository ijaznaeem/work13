import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserDepartments } from '../../../config/constants';
import { AuthenticationService } from '../../../services/authentication.service';
import { MyToastService } from '../../../services/toaster.server';
import { IntimationFormComponent } from '../intimation-form/intimation-form.component';
import { IntimationViewComponent } from '../intimation-view/intimation-view.component';
import {
  Department,
  DocumentHistory,
  IntimationFilter,
  IntimationLetter
} from '../models/intimation.models';
import { IntimationService } from '../services/intimation.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { IntimationColumns, DocumentHistoryColumns } from './intimation-list.settings';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
  AddSpacer,
} from '../../components/crud-form/crud-form-helper';
import { GetDate } from '../../../factories/utilities';

@Component({
  selector: 'app-intimation-list',
  templateUrl: './intimation-list.component.html',
  styleUrls: ['./intimation-list.component.scss']
})
export class IntimationListComponent implements OnInit {
  @ViewChild('grdData') grdData!: DataGridComponent;
  @ViewChild('grdHistory') grdHistory!: DataGridComponent;

  intimations: IntimationLetter[] = [];
  departments: Department[] = [];
  documentHistory: DocumentHistory[] = [];
  selectedIntimation: IntimationLetter | null = null;

  public Filter = {
    FromDate: GetDate(),
    ToDate: GetDate(),
    DepartmentID: '',
    Status: 'true'
  };

  public filterForm = {
    title: '',
    table: '',
    columns: [
      AddInputFld('FromDate', 'From Date', 2, true, 'date'),
      AddInputFld('ToDate', 'To Date', 2, true, 'date'),
      AddLookupFld(
        'DepartmentID',
        'Department',
        'Departments',
        'DeptID',
        'DeptName',
        2,
        [],
        false,
        { type: 'list' }
      ),
      AddLookupFld(
        'Status',
        'Status',
        '',
        'value',
        'text',
        2,
        [
          { value: 'true', text: 'Active Only' },
          { value: 'false', text: 'Completed' },
          { value: '', text: 'All' }
        ],
        true,
        { type: 'list' }
      ),
      AddSpacer('2'),
      AddFormButton(
        'Filter',
        (r: any) => {
          this.FilterData();
        },
        
        1
        ,
        'search',
        'primary'
      ),
      AddFormButton(
        'Print',
        (r: any) => {
          this.printReport();
        },
        1,
        'print',
        'primary'
      ),
    ],
  };

  public data: any = [];
  public IntimationCols = IntimationColumns;
  public HistoryCols = DocumentHistoryColumns;

  searchText = '';
  isLoading = false;

  // User permissions
  currentUser: any;
  userDepartment: number = 0;
  canViewAll = false;
  canComplete = false;

  constructor(
    private intimationService: IntimationService,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private toast: MyToastService
  ) { }

  ngOnInit(): void {
    this.initializeUser();
    this.loadDepartments();
    this.setDefaultDates();
    this.FilterData();
  }

  setDefaultDates(): void {
    // Set default date range to current month
    const now = new Date();
    this.Filter.FromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    this.Filter.ToDate = now.toISOString().split('T')[0];
  }

  initializeUser(): void {
    this.currentUser = this.authService.getUser();
    this.userDepartment = this.currentUser?.Department || 0;

    // Check permissions based on VB6 logic
    this.canViewAll = [
      UserDepartments.grpCEO,
      UserDepartments.grpGM,
      UserDepartments.grpOperations,
      UserDepartments.grpAdmin
    ].includes(this.userDepartment);

    this.canComplete = [
      UserDepartments.grpCEO,
      UserDepartments.grpGM,
      UserDepartments.grpOperations,
      UserDepartments.grpAMO
    ].includes(this.userDepartment);

    // Set department filter if user doesn't have view all permission
    if (!this.canViewAll) {
      this.Filter.DepartmentID = this.userDepartment.toString();
    }
  }

  loadDepartments(): void {
    this.intimationService.getDepartments().then((data: any) => {
      this.departments = data;
    }).catch((error:any) => {
      console.error('Error loading departments:', error);
      this.toast.Error('Error loading departments', 'Error');
    });

  }

  FilterData(): void {
    this.isLoading = true;
    
    // Build filter string similar to purchase orders
    let filter = `Date between '${this.Filter.FromDate}' and '${this.Filter.ToDate}'`;

    if (this.Filter.DepartmentID && this.Filter.DepartmentID !== '') {
      filter += ` and DepartmentID=${this.Filter.DepartmentID}`;
    }

    if (this.Filter.Status && this.Filter.Status !== '') {
      // Convert string to boolean and then to number for database
      const isActive = this.Filter.Status === 'true';
      const statusValue = isActive ? 0 : 1; // 0 for active (not closed), 1 for closed
      filter += ` and IsClosed=${statusValue}`;
    }

    // Use the HttpBase service pattern from purchase orders
    this.intimationService.getIntimations(
      {
        activeOnly: this.Filter.Status === 'true' ? true : this.Filter.Status === 'false' ? false : undefined,
        dateFrom: new Date(this.Filter.FromDate),
        dateTo: new Date(this.Filter.ToDate),
        DepartmentID: this.Filter.DepartmentID ? parseInt(this.Filter.DepartmentID) : undefined
      } as IntimationFilter,
     
    ).then((response:any) => {
      this.data = response.map((item:any, index:number) => ({
          ...item,
          sno: index + 1,
          Date: new Date(item.Date),
          statusText: item.IsClosed ? 'Completed' : 'Active'
        }));
        console.log('Processed intimations:', this.data);
        this.grdData?.SetDataSource(this.data);
        this.isLoading = false;
    }).catch((error:any) => {
      console.error('Error processing intimations:', error);
      this.toast.Error('Error processing intimation letters', 'Error');
      this.isLoading = false;
    });
  }

  onRowSelect(event: any): void {
    this.selectedIntimation = event.data;
    if (this.selectedIntimation) {
      this.loadDocumentHistory(this.selectedIntimation.IntimationID!);
    }
  }

  loadDocumentHistory(intimationId: number): void {
    this.intimationService.getDocumentHistory(intimationId).subscribe({
      next: (data: DocumentHistory[]) => {
        this.documentHistory = data;
        this.grdHistory?.SetDataSource(this.documentHistory);
      },
      error: (error) => {
        console.error('Error loading document history:', error);
      }
    });
  }

  addNew(): void {
    const modalRef: NgbModalRef = this.modalService.open(IntimationFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.isEdit = false;

    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.FilterData();
        }
      },
      (dismissed) => {
        // Modal dismissed
      }
    );
  }

  editIntimation(id: number): void {
    const modalRef: NgbModalRef = this.modalService.open(IntimationFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.intimationId = id;

    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.FilterData();
        }
      },
      (dismissed) => {
        // Modal dismissed
      }
    );
  }

  viewIntimation(id: number): void {
    const modalRef: NgbModalRef = this.modalService.open(IntimationViewComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.intimationId = id;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.FilterData();
        }
      },
      (dismissed) => {
        // Modal dismissed
      }
    );
  }

  deleteIntimation(id: number): void {
    if (confirm('Are you sure you want to delete this intimation letter?')) {
      this.intimationService.deleteIntimation(id).subscribe({
        next: () => {
          this.toast.Sucess('Intimation letter deleted successfully', 'Success');
          this.FilterData();
        },
        error: (error) => {
          console.error('Error deleting intimation:', error);
          this.toast.Error('Error deleting intimation letter', 'Error');
        }
      });
    }
  }

  printReport(): void {
    // Implement print functionality
    window.print();
  }

  refresh(): void {
    this.FilterData();
  }

  // Format date for display
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  }

  // Format time for display
  formatTime(time: string): string {
    if (!time) return '';
    return time;
  }

  // Event handlers for grid
  onRowClicked(event: any): void {
    this.onRowSelect(event);
  }

  onLinkClick(event: any): void {
    // Handle link clicks if needed
    console.log('Link clicked:', event);
  }
}
