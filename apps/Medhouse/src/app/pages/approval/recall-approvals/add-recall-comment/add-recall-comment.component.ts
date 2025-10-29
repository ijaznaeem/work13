import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { UserDepartments } from '../../../../config/constants';

@Component({
  selector: 'app-add-recall-comment',
  templateUrl: './add-recall-comment.component.html',
  styleUrls: ['./add-recall-comment.component.scss']
})
export class AddRecallCommentComponent implements OnInit {
  
  public commentForm!: FormGroup;
  public recallId: number = 0;
  public recallData: any = null;
  public savingComment = false;

  // Department options for forwarding
  public departments: any[] = [];
  public statusOptions: string[] = [
    'In Process',
    'Approved',
    'Rejected',
    'Hold',
    'Completed',
    'Cancelled'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpBase,
    private alert: MyToastService,
    public bsModalRef: BsModalRef
  ) {
    this.initializeForm();
    this.loadDepartments();
  }

  ngOnInit(): void {
    if (this.recallId) {
      this.loadRecallData();
    }
  }

  private initializeForm(): void {
    const currentUser = this.http.getUserDept();
    
    this.commentForm = this.fb.group({
      status: ['In Process', Validators.required],
      forwardTo: [UserDepartments.grpOperations],
      comments: ['', Validators.required],
      actionDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  private loadDepartments(): void {
    // Based on VB6 form, these are the departments available for forwarding
    this.departments = [
      { value: UserDepartments.grpCEO, name: 'CEO' },
      { value: UserDepartments.grpCommercial, name: 'Commercial' },
      { value: UserDepartments.grpProduction, name: 'Production' },
      { value: UserDepartments.grpSales, name: 'Sales' },
      { value: UserDepartments.grpAccounts, name: 'Accounts' },
      { value: UserDepartments.grpAdmin, name: 'Admin' },
      { value: UserDepartments.grpQC, name: 'QC' },
      { value: UserDepartments.grpGM, name: 'GM' },
      { value: UserDepartments.grpOperations, name: 'Operations' },
      { value: UserDepartments.grpProcurement, name: 'Procurement' }
    ];
  }

  private loadRecallData(): void {
    this.http.getData(`RecallProducts/${this.recallId}`)
      .then((data: any) => {
        this.recallData = data;
        if (data) {
          // Set current status and forward to department
          this.commentForm.patchValue({
            status: data.Status || 'In Process',
            forwardTo: data.ForwardedTo || UserDepartments.grpOperations
          });
        }
      })
      .catch((error) => {
        console.error('Error loading recall data:', error);
        this.alert.Error('Failed to load recall data', 'Error');
      });
  }

  public onSave(): void {
    if (this.commentForm.valid) {
      this.savingComment = true;
      
      const formData = this.commentForm.value;
      const currentUser = this.http.getUserDept();
      const currentDeptName = this.getDepartmentName(currentUser);
      
      // Build comment with department info like VB6
      const timestamp = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
      const commentText = `---------------\n${currentDeptName} On: ${timestamp}\nStatus: ${formData.status}\n\n${formData.comments}\n`;
      
      // Prepare update data
      const updateData = {
        Status: formData.status,
        ForwardedTo: formData.forwardTo,
        Remarks: this.recallData?.Remarks ? this.recallData.Remarks + '\n' + commentText : commentText,
        LastUpdatedBy: currentUser,
        LastUpdatedDate: new Date().toISOString()
      };

      // Update recall with new status and comments
      this.http.postData(`RecallProducts/${this.recallId}`, updateData)
        .then((response: any) => {
          // Save comment history
          const commentHistory = {
            RecallID: this.recallId,
            Department: currentUser,
            Status: formData.status,
            ForwardedTo: formData.forwardTo,
            Comments: formData.comments,
            CommentDate: formData.actionDate,
            CreatedBy: currentUser,
            CreatedDate: new Date().toISOString()
          };

          return this.http.postData('RecallComments', commentHistory);
        })
        .then(() => {
          this.alert.Sucess('Comment added successfully', 'Success');
          this.bsModalRef.hide();
        })
        .catch((error) => {
          console.error('Error saving comment:', error);
          this.alert.Error('Failed to save comment', 'Error');
        })
        .finally(() => {
          this.savingComment = false;
        });
    } else {
      this.markFormGroupTouched(this.commentForm);
      this.alert.Warning('Please fill all required fields', 'Warning');
    }
  }

  public onCancel(): void {
    this.bsModalRef.hide();
  }

  public onStatusChange(): void {
    const status = this.commentForm.get('status')?.value;
    
    // Auto-suggest forward department based on status like in VB6
    if (status === 'Approved') {
      this.commentForm.patchValue({ forwardTo: UserDepartments.grpOperations });
    } else if (status === 'Rejected' || status === 'Hold') {
      this.commentForm.patchValue({ forwardTo: UserDepartments.grpSales });
    } else if (status === 'Completed') {
      this.commentForm.patchValue({ forwardTo: UserDepartments.grpAccounts });
    }
  }

  private getDepartmentName(deptId: UserDepartments): string {
    const dept = this.departments.find(d => d.value === deptId);
    return dept ? dept.name : 'Unknown';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.commentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public getFieldError(fieldName: string): string {
    const field = this.commentForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
    }
    return '';
  }

  public getRecallInfo(): string {
    if (this.recallData) {
      return `Recall ID: ${this.recallData.RecallID} - Date: ${new Date(this.recallData.Date).toLocaleDateString()}`;
    }
    return `Recall ID: ${this.recallId}`;
  }
}