import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AddAmendmentDialogComponent } from '../add-amendment-dialog/add-amendment-dialog.component';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { GetDate } from '../../../../factories/utilities';
import { FirstDayOfMonth } from '../../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { UserDepartments } from '../../../../config/constants';
import { AmendmentApprovalService } from './amendment-approval.service';

@Component({
  selector: 'app-amendment-approvals',
  templateUrl: './amendment-approvals.component.html',
  styleUrls: ['./amendment-approvals.component.scss']
})
export class AmendmentApprovalsComponent implements OnInit {
  
  public filterForm!: FormGroup;
  public bsModalRef!: BsModalRef;

  // Data for different sections
  public amendmentData: any[] = [];
  public amendmentDetails: any[] = [];

  // Selected items
  public selectedAmendment: any = null;
  public selectedDetail: any = null;

  // Loading states
  public loadingAmendments = false;
  public loadingDetails = false;

  // User permissions based on VB6 logic
  public canAdd = false;
  public canPost = false;
  public canEdit = false;

  // Status options from VB6
  public statusOptions = [
    { value: 'In Process', label: 'In Process' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  // Current remarks
  public currentRemarks = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpBase,
    private alert: MyToastService,
    private bsService: BsModalService,
    private amendmentService: AmendmentApprovalService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setPermissions();
    this.loadAmendmentData();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fromDate: [FirstDayOfMonth()],
      toDate: [GetDate()],
      status: ['In Process']
    });
  }

  private setPermissions(): void {
    const currentDept = this.http.getUserDept();
    
    // Based on VB6 logic:
    // btnAdd.Enabled = False if nDepartment = grpQC
    this.canAdd = currentDept !== UserDepartments.grpQC;
    
    // btnEdit.Enabled = True if nDepartment = grpGM Or grpOperations Or grpceo Or grpAMO
    this.canPost = (
      currentDept === UserDepartments.grpGM ||
      currentDept === UserDepartments.grpOperations ||
      currentDept === UserDepartments.grpCEO ||
      currentDept === UserDepartments.grpAMO
    );

    this.canEdit = this.canPost; // Same permission logic as Post
  }

  public onFilterChange(): void {
    this.loadAmendmentData();
  }

  private loadAmendmentData(): void {
    this.loadingAmendments = true;
    const formData = this.filterForm.value;
    
    // Use exact VB6 query logic through service
    this.amendmentService.getAmendmentApprovals(
      formData.status,
      formData.fromDate,
      formData.toDate
    )
      .then((data: any[]) => {
        this.amendmentData = data || [];
        this.loadingAmendments = false;
      })
      .catch((error) => {
        console.error('Error loading amendment data:', error);
        this.alert.Error('Failed to load amendment data', 'Error');
        this.loadingAmendments = false;
      });
  }

  public onAmendmentSelect(amendment: any): void {
    this.selectedAmendment = amendment;
    this.currentRemarks = amendment.Remarks || '';
    this.loadAmendmentDetails(amendment.AmendmentID);
  }

  private loadAmendmentDetails(amendmentId: number): void {
    this.loadingDetails = true;
    
    // Use exact VB6 query logic through service
    this.amendmentService.getAmendmentDetails(amendmentId)
      .then((data: any[]) => {
        this.amendmentDetails = data || [];
        this.loadingDetails = false;
      })
      .catch((error) => {
        console.error('Error loading amendment details:', error);
        this.alert.Error('Failed to load amendment details', 'Error');
        this.loadingDetails = false;
      });
  }

  public AddAmendment(): void {
    const modalOptions: ModalOptions = {
      initialState: {
        isEditMode: false,
        editId: null
      },
      class: 'modal-xl'
    };

    this.bsModalRef = this.bsService.show(AddAmendmentDialogComponent, modalOptions);
    if (this.bsModalRef.content) {
      this.bsModalRef.content.onSave = () => {
        this.loadAmendmentData();
      };
    }
  }

  public PostAmendment(): void {
    if (!this.selectedAmendment) {
      this.alert.Warning('Please select an amendment first', 'Warning');
      return;
    }

    // VB6 validation logic
    if (this.selectedAmendment.Status === 'Rejected') {
      this.alert.Warning('Cannot post rejected approval', 'Warning');
      return;
    }

    if (this.selectedAmendment.ForwardedTo !== UserDepartments.grpCEO) {
      this.alert.Warning('Not forwarded for posting', 'Warning');
      return;
    }

    if (confirm('Are you sure you want to post this amendment?')) {
      this.postApproval(this.selectedAmendment.AmendmentID);
    }
  }

  private postApproval(amendmentId: number): void {
    // Use exact VB6 PostApproval logic through service
    this.amendmentService.postAmendmentApproval(amendmentId)
      .then(() => {
        // Process amendment details using VB6 logic
        return this.amendmentService.processAmendmentDetails(
          amendmentId, 
          this.selectedAmendment.MasterProductID
        );
      })
      .then(() => {
        this.alert.Sucess('Record posted successfully', 'Success');
        this.loadAmendmentData();
      })
      .catch((error) => {
        console.error('Error posting amendment:', error);
        this.alert.Error('Failed to post amendment', 'Error');
      });
  }

  public AddRemarks(): void {
    if (!this.selectedAmendment) {
      this.alert.Warning('Please select an amendment first', 'Warning');
      return;
    }

    // Check permissions based on VB6 logic
    const currentDept = this.http.getUserDept();
    const canAddRemarks = (
      this.selectedAmendment.ForwardedTo === currentDept ||
      currentDept === UserDepartments.grpOperations ||
      currentDept === UserDepartments.grpGM ||
      currentDept === UserDepartments.grpCEO ||
      currentDept === UserDepartments.grpAMO
    );

    if (!canAddRemarks) {
      this.alert.Warning('You do not have permission to add remarks', 'Warning');
      return;
    }

    // Get new remarks from user
    const newRemarks = prompt('Enter remarks:', '');
    if (newRemarks) {
      // Use VB6-compatible remarks update
      const timestamp = new Date().toLocaleString();
      const deptName = this.getDepartmentName(currentDept);
      const formattedRemarks = this.currentRemarks + 
        `\n---------------\n${deptName} On: ${timestamp}\nRemarks: ${newRemarks}`;

      this.amendmentService.addRemarks(this.selectedAmendment.AmendmentID, formattedRemarks)
        .then(() => {
          this.alert.Sucess('Remarks added successfully', 'Success');
          this.currentRemarks = formattedRemarks;
          this.selectedAmendment.Remarks = formattedRemarks;
        })
        .catch((error) => {
          console.error('Error adding remarks:', error);
          this.alert.Error('Failed to add remarks', 'Error');
        });
    }
  }

  private getDepartmentName(deptId: number): string {
    switch (deptId) {
      case UserDepartments.grpQC: return 'QC';
      case UserDepartments.grpOperations: return 'Operations';
      case UserDepartments.grpGM: return 'GM';
      case UserDepartments.grpCEO: return 'CEO';
      case UserDepartments.grpAMO: return 'AMO';
      default: return 'Unknown';
    }
  }

  public formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB');
  }

  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      case 'In Process':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  public getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'Add':
        return 'bg-primary';
      case 'Change':
        return 'bg-info';
      case 'Delete':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  public isRowSelected(item: any, type: 'amendment' | 'detail'): boolean {
    switch (type) {
      case 'amendment':
        return this.selectedAmendment === item;
      case 'detail':
        return this.selectedDetail === item;
      default:
        return false;
    }
  }
}