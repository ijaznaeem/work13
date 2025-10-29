import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FirstDayOfMonth } from '../../.././../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDate } from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { UserDepartments } from '../../../../config/constants';
import { AddRecallComponent } from '../add-recall/add-recall.component';
import { AddRecallCommentComponent } from '../add-recall-comment/add-recall-comment.component';
import { AddImagesComponent } from '../add-images/add-images.component';

@Component({
  selector: 'app-recall-approvals',
  templateUrl: './recall-approvals.component.html',
  styleUrls: ['./recall-approvals.component.scss']
})
export class RecallApprovalsComponent implements OnInit {
  
  public filterForm!: FormGroup;
  public bsModalRef!: BsModalRef;

  // Data for different sections
  public recallData: any[] = [];
  public recallDetails: any[] = [];
  public recallImages: any[] = [];

  // Selected items
  public selectedRecall: any = null;
  public selectedDetail: any = null;
  public selectedImage: any = null;

  // Loading states
  public loadingRecalls = false;
  public loadingDetails = false;
  public loadingImages = false;

  // User permissions
  public canEdit = false;
  public canAdd = false;
  public canPrint = false;
  public canAddImages = false;

  // Status options
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
    private bsService: BsModalService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setPermissions();
    this.loadRecallData();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fromDate: [FirstDayOfMonth()],
      toDate: [GetDate()],
      status: ['In Process']
    });
  }

  private setPermissions(): void {
    const userDept = this.http.getUserDept();
    
    // Set permissions based on department (from VB6 logic)
    if (userDept === UserDepartments.grpGM || 
        userDept === UserDepartments.grpOperations || 
        userDept === UserDepartments.grpCEO || 
        userDept === UserDepartments.grpAMO) {
      this.canPrint = true;
      this.canEdit = true;
      this.canAdd = true;
      this.canAddImages = true;
    } else if (userDept === UserDepartments.grpCommercial) {
      this.canPrint = false;
      this.canAdd = true;
      this.canEdit = false;
      this.canAddImages = true;
    } else if (userDept === UserDepartments.grpProduction) {
      this.canAdd = false;
      this.canEdit = false;
      this.canPrint = false;
      this.canAddImages = false;
      // Force status to "In Process" and disable combo
      this.filterForm.patchValue({ status: 'In Process' });
      this.filterForm.get('status')?.disable();
    } else {
      this.canPrint = false;
      this.canAdd = false;
      this.canEdit = false;
      this.canAddImages = false;
    }
  }

  public onFilterChange(): void {
    this.loadRecallData();
  }

  public loadRecallData(): void {
    this.loadingRecalls = true;
    const formValues = this.filterForm.value;
    let filter = `Status = '${formValues.status}'`;

    // Add date filter for completed/rejected status
    if (formValues.status === 'Completed' || formValues.status === 'Rejected') {
      filter += ` AND Date BETWEEN '${formValues.fromDate}' AND '${formValues.toDate}'`;
    }

    this.http.getData(`Recalls?filter=${encodeURIComponent(filter)}&orderby=Date DESC`)
      .then((data: any) => {
        this.recallData = data || [];
        this.loadingRecalls = false;
      })
      .catch((error) => {
        console.error('Error loading recall data:', error);
        this.loadMockRecallData();
        this.loadingRecalls = false;
      });
  }

  private loadMockRecallData(): void {
    this.recallData = [
      {
        RecallID: 1001,
        Date: '2024-10-14',
        ProductName: 'Panadol 500mg Tablets',
        BatchNo: 'PAD001',
        ExpiryDate: '2025-12-31',
        Reason: 'Quality Issue',
        Status: 'In Process',
        CustomerName: 'ABC Pharmacy',
        Remarks: 'Product showing discoloration. Customer complaint received.',
        DeptID: UserDepartments.grpQC
      },
      {
        RecallID: 1002,
        Date: '2024-10-13',
        ProductName: 'Augmentin 625mg',
        BatchNo: 'AUG002',
        ExpiryDate: '2025-08-15',
        Reason: 'Packaging Defect',
        Status: 'In Process',
        CustomerName: 'XYZ Medical Store',
        Remarks: 'Blister pack damaged during transportation.',
        DeptID: UserDepartments.grpProduction
      },
      {
        RecallID: 1003,
        Date: '2024-10-12',
        ProductName: 'Brufen 400mg',
        BatchNo: 'BRU003',
        ExpiryDate: '2025-06-30',
        Reason: 'Contamination',
        Status: 'Completed',
        CustomerName: 'Health Plus',
        Remarks: 'Contamination detected in laboratory analysis. Batch recalled and destroyed.',
        DeptID: UserDepartments.grpQC
      }
    ];
  }

  public onRecallSelect(recall: any): void {
    this.selectedRecall = recall;
    this.currentRemarks = recall.Remarks || '';
    this.loadRecallDetails(recall.RecallID);
    this.loadRecallImages(recall.RecallID);
  }

  private loadRecallDetails(recallId: number): void {
    this.loadingDetails = true;
    
    this.http.getData(`RecallDetails?filter=RecallID=${recallId}`)
      .then((data: any) => {
        this.recallDetails = data || [];
        this.loadingDetails = false;
      })
      .catch((error) => {
        console.error('Error loading recall details:', error);
        this.loadMockRecallDetails(recallId);
        this.loadingDetails = false;
      });
  }

  private loadMockRecallDetails(recallId: number): void {
    this.recallDetails = [
      {
        DetailID: 1,
        RecallID: recallId,
        ProductCode: 'PAD001',
        BatchNo: 'PAD001',
        Quantity: 100,
        QCAdvice: 'Return for quality analysis',
        Reason: 'Customer complaint - discoloration',
        ActionTaken: 'Investigation in progress'
      },
      {
        DetailID: 2,
        RecallID: recallId,
        ProductCode: 'PAD002',
        BatchNo: 'PAD001',
        Quantity: 50,
        QCAdvice: 'Hold for testing',
        Reason: 'Same batch - precautionary recall',
        ActionTaken: 'Pending QC clearance'
      }
    ];
  }

  private loadRecallImages(recallId: number): void {
    this.loadingImages = true;
    
    this.http.getData(`RecallImages?filter=RecallID=${recallId}`)
      .then((data: any) => {
        this.recallImages = data || [];
        this.loadingImages = false;
      })
      .catch((error) => {
        console.error('Error loading recall images:', error);
        this.loadMockRecallImages(recallId);
        this.loadingImages = false;
      });
  }

  private loadMockRecallImages(recallId: number): void {
    this.recallImages = [
      {
        ImageID: 1,
        RecallID: recallId,
        Date: '2024-10-14',
        UserName: 'QC Officer',
        Description: 'Product discoloration evidence',
        ImagePath: '/assets/images/recall1.jpg'
      },
      {
        ImageID: 2,
        RecallID: recallId,
        Date: '2024-10-14',
        UserName: 'QC Officer',
        Description: 'Packaging condition',
        ImagePath: '/assets/images/recall2.jpg'
      }
    ];
  }

  public addApproval(): void {
    // Open add recall approval modal
    this.alert.Info('Add recall approval functionality to be implemented', 'Add Approval');
  }

  public editRecall(): void {
    if (!this.selectedRecall) {
      this.alert.Warning('Please select a recall to edit', 'Warning');
      return;
    }

    this.alert.Info(`Edit recall ID: ${this.selectedRecall.RecallID}`, 'Edit Recall');
  }

  public addImage(): void {
    if (!this.selectedRecall) {
      this.alert.Warning('Please select a recall to add image', 'Warning');
      return;
    }

    this.alert.Info(`Add image for recall ID: ${this.selectedRecall.RecallID}`, 'Add Image');
  }

  public printDestructionNotes(): void {
    if (!this.selectedRecall) {
      this.alert.Warning('Please select a recall to print destruction notes', 'Warning');
      return;
    }

    this.alert.Info(`Print destruction notes for recall ID: ${this.selectedRecall.RecallID}`, 'Print Destruction');
  }

  public printDispatchNotes(): void {
    if (!this.selectedRecall) {
      this.alert.Warning('Please select a recall to print dispatch notes', 'Warning');
      return;
    }

    this.alert.Info(`Print dispatch notes for recall ID: ${this.selectedRecall.RecallID}`, 'Print Dispatch');
  }

  public onRecallDoubleClick(recall: any): void {
    // Check if user can add comments (from VB6 logic)
    const userDept = this.http.getUserDept();
    if (recall.DeptID === userDept || 
        userDept === UserDepartments.grpOperations || 
        userDept === UserDepartments.grpGM || 
        userDept === UserDepartments.grpCEO || 
        userDept === UserDepartments.grpAMO) {
      
      this.alert.Info('Add comments functionality to be implemented', 'Add Comments');
    } else {
      this.alert.Warning('You do not have permission to add comments for this recall', 'Access Denied');
    }
  }

  public onDetailDoubleClick(detail: any, columnName: string): void {
    // Allow editing QC Advice and Reason for QC department
    const userDept = this.http.getUserDept();
    if ((columnName === 'QCAdvice' || columnName === 'Reason') && userDept === UserDepartments.grpQC) {
      const newValue = prompt(`Please enter value for ${columnName}:`, detail[columnName] || '');
      if (newValue !== null && newValue.trim() !== '') {
        // Update the detail
        this.updateRecallDetail(detail.DetailID, columnName, newValue);
      }
    }
  }

  private updateRecallDetail(detailId: number, columnName: string, value: string): void {
    const updateData: any = {};
    updateData[columnName] = value;

    this.http.postData(`RecallDetails/${detailId}`, updateData)
      .then(() => {
        this.alert.Sucess('Detail updated successfully', 'Success');
        if (this.selectedRecall) {
          this.loadRecallDetails(this.selectedRecall.RecallID);
        }
      })
      .catch((error) => {
        console.error('Error updating recall detail:', error);
        this.alert.Error('Failed to update detail', 'Error');
      });
  }

  public deleteImage(imageId: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.http.deleteData(`RecallImages/${imageId}`)
        .then(() => {
          this.alert.Sucess('Image deleted successfully', 'Success');
          if (this.selectedRecall) {
            this.loadRecallImages(this.selectedRecall.RecallID);
          }
        })
        .catch((error) => {
          console.error('Error deleting image:', error);
          this.alert.Error('Failed to delete image', 'Error');
        });
    }
  }

  public viewImage(image: any): void {
    // Open image viewer modal
    this.alert.Info(`View image: ${image.Description}`, 'Image Viewer');
  }

  public isRowSelected(item: any, type: 'recall' | 'detail' | 'image'): boolean {
    switch (type) {
      case 'recall':
        return this.selectedRecall === item;
      case 'detail':
        return this.selectedDetail === item;
      case 'image':
        return this.selectedImage === item;
      default:
        return false;
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

  // CRUD Operations
  public AddRecall(): void {
    const modalOptions: ModalOptions = {
      initialState: {
        isEditMode: false,
        editId: null
      },
      class: 'modal-lg'
    };

    this.bsModalRef = this.bsService.show(AddRecallComponent, modalOptions);
    if (this.bsModalRef.content) {
      this.bsModalRef.content.onSave = () => {
        this.loadRecallData();
      };
    }
  }

  public EditRecall(recall: any): void {
    const modalOptions: ModalOptions = {
      initialState: {
        isEditMode: true,
        editId: recall.RecallID
      },
      class: 'modal-lg'
    };

    this.bsModalRef = this.bsService.show(AddRecallComponent, modalOptions);
    if (this.bsModalRef.content) {
      this.bsModalRef.content.onSave = () => {
        this.loadRecallData();
      };
    }
  }

  public AddComment(): void {
    if (!this.selectedRecall) {
      this.alert.Warning('Please select a recall first', 'Warning');
      return;
    }

    const modalOptions: ModalOptions = {
      initialState: {
        recallId: this.selectedRecall.RecallID
      },
      class: 'modal-md'
    };

    this.bsModalRef = this.bsService.show(AddRecallCommentComponent, modalOptions);
    if (this.bsModalRef.content) {
      this.bsModalRef.content.onSave = () => {
        this.loadRecallData();
      };
    }
  }

  public AddImages(): void {
    if (!this.selectedRecall) {
      this.alert.Warning('Please select a recall first', 'Warning');
      return;
    }

    const modalOptions: ModalOptions = {
      initialState: {
        recallId: this.selectedRecall.RecallID
      },
      class: 'modal-xl'
    };

    this.bsModalRef = this.bsService.show(AddImagesComponent, modalOptions);
    if (this.bsModalRef.content) {
      this.bsModalRef.content.onSave = () => {
        this.loadRecallImages(this.selectedRecall.RecallID);
      };
    }
  }

  public DeleteRecall(recall: any): void {
    if (confirm(`Are you sure you want to delete recall ${recall.RecallID}?`)) {
      this.http.deleteData(`RecallProducts/${recall.RecallID}`)
        .then(() => {
          this.alert.Sucess('Recall deleted successfully', 'Success');
          this.loadRecallData();
          if (this.selectedRecall && this.selectedRecall.RecallID === recall.RecallID) {
            this.selectedRecall = null;
            this.recallDetails = [];
            this.recallImages = [];
          }
        })
        .catch((error) => {
          console.error('Error deleting recall:', error);
          this.alert.Error('Failed to delete recall', 'Error');
        });
    }
  }
}