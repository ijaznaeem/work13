import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDepartments } from '../../../config/constants';
import { AuthenticationService } from '../../../services/authentication.service';
import { MyToastService } from '../../../services/toaster.server';
import { IntimationFormComponent } from '../intimation-form/intimation-form.component';
import {
    DocumentHistory,
    IntimationLetter,
    IntimationStatus,
    User
} from '../models/intimation.models';
import { IntimationService } from '../services/intimation.service';

@Component({
  selector: 'app-intimation-view',
  templateUrl: './intimation-view.component.html',
  styleUrls: ['./intimation-view.component.scss']
})
export class IntimationViewComponent implements OnInit {

  @Input() isModal = false;
  @Input() intimationId: number | null = null;

  intimation: IntimationLetter | null = null;
  documentHistory: DocumentHistory[] = [];
  users: User[] = [];
  intimationStatuses: IntimationStatus[] = [];

  commentForm: FormGroup;
  isLoading = false;
  isProcessing = false;

  currentUser: any;
  userDepartment: number;
  canComplete = false;
  canComment = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private intimationService: IntimationService,
    private authService: AuthenticationService,
    private toast: MyToastService,
    public activeModal: NgbActiveModal
  ) {
    this.createCommentForm();
  }

  ngOnInit(): void {
    this.initializeUser();

    if (this.isModal && this.intimationId) {
      // Modal mode - use provided intimationId
      this.loadIntimation();
      this.loadDocumentHistory();
    } else {
      // Route mode - check route params
      this.checkRouteParams();
    }

    this.loadUsers();
    this.loadStatuses();
  }

  initializeUser(): void {
    this.currentUser = this.authService.getUser();
    this.userDepartment = this.currentUser?.Department || 0;

    // Check permissions based on VB6 logic
    this.canComplete = [
      UserDepartments.grpCEO,
      UserDepartments.grpGM,
      UserDepartments.grpOperations,
      UserDepartments.grpAMO
    ].includes(this.userDepartment);
  }

  createCommentForm(): void {
    this.commentForm = this.fb.group({
      remarks: ['', Validators.required],
      statusID: [''],
      forwardTo: ['']
    });
  }

  checkRouteParams(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.intimationId = +params['id'];
        this.loadIntimation();
        this.loadDocumentHistory();
      } else {
        this.router.navigate(['/intimations']);
      }
    });
  }

  loadIntimation(): void {
    if (!this.intimationId) return;

    this.isLoading = true;
    this.intimationService.getIntimation(this.intimationId).subscribe({
      next: (intimation) => {
        this.intimation = intimation;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading intimation:', error);
        this.toast.Error('Error loading intimation', 'Error');
        this.isLoading = false;
        this.router.navigate(['/intimations']);
      }
    });
  }

  loadDocumentHistory(): void {
    if (!this.intimationId) return;

    this.intimationService.getDocumentHistory(this.intimationId).subscribe({
      next: (history) => {
        this.documentHistory = history;
      },
      error: (error) => {
        console.error('Error loading document history:', error);
        this.toast.Error('Error loading document history', 'Error');
      }
    });
  }

  loadUsers(): void {
    this.intimationService.getUsersByDepartment().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadStatuses(): void {
    this.intimationService.getIntimationStatuses().subscribe({
      next: (statuses) => {
        this.intimationStatuses = statuses;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
      }
    });
  }

  onStatusChange(): void {
    const statusId = this.commentForm.get('statusID')?.value;
    // If status is completed (assuming 5 is completed status based on VB6 code)
    if (statusId === 5) {
      this.commentForm.get('forwardTo')?.disable();
      this.commentForm.get('forwardTo')?.setValue('');
    } else {
      this.commentForm.get('forwardTo')?.enable();
    }
  }

  addComment(): void {
    if (this.commentForm.invalid) {
      this.markFormGroupTouched();
      this.toast.Warning('Please enter remarks', 'Validation Error');
      return;
    }

    if (!this.intimationId) return;

    this.isProcessing = true;
    const formValue = this.commentForm.value;

    const historyData: DocumentHistory = {
      Date: new Date(),
      Time: new Date().toLocaleTimeString(),
      Remarks: formValue.remarks,
      DepatmentID: this.userDepartment,
      UserID: this.currentUser.UserID,
      DocumentID: this.intimationId,
      Type: 1, // Based on VB6 code, Type 1 for intimations
      StatusID: formValue.statusID || undefined,
      ForwardTo: formValue.forwardTo || undefined
    };

    this.intimationService.addComment(historyData).subscribe({
      next: () => {
        // If forwarding to another user, update the intimation
        if (formValue.forwardTo) {
          this.forwardIntimation(formValue.forwardTo, formValue.remarks);
        } else {
          this.toast.Sucess('Comment added successfully', 'Success');
          this.commentForm.reset();
          this.loadDocumentHistory();

          // Return updated result for modal refresh
          if (this.isModal) {
            this.activeModal.close('updated');
          }
        }
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.toast.Error('Error adding comment', 'Error');
        this.isProcessing = false;
      }
    });
  }

  forwardIntimation(forwardTo: number, remarks: string): void {
    if (!this.intimationId) return;

    this.intimationService.forwardIntimation(this.intimationId, forwardTo, remarks).subscribe({
      next: () => {
        this.toast.Sucess('Intimation forwarded successfully', 'Success');
        this.commentForm.reset();
        this.loadIntimation();
        this.loadDocumentHistory();

        // Return updated result for modal refresh
        if (this.isModal) {
          this.activeModal.close('updated');
        }
      },
      error: (error) => {
        console.error('Error forwarding intimation:', error);
        this.toast.Error('Error forwarding intimation', 'Error');
      }
    });
  }

  completeIntimation(): void {
    if (!this.intimationId) return;

    if (!confirm('Are you sure you want to mark this intimation as completed?')) {
      return;
    }

    const remarks = this.commentForm.get('remarks')?.value || 'Completed';

    this.isProcessing = true;
    this.intimationService.completeIntimation(this.intimationId, remarks).subscribe({
      next: () => {
        this.toast.Sucess('Intimation completed successfully', 'Success');

        if (this.isModal) {
          this.activeModal.close('updated');
        } else {
          this.router.navigate(['/intimations']);
        }
      },
      error: (error) => {
        console.error('Error completing intimation:', error);
        this.toast.Error('Error completing intimation', 'Error');
        this.isProcessing = false;
      }
    });
  }

  editIntimation(): void {
    if (this.intimationId) {
      if (this.isModal) {
        // In modal mode, open edit form modal
        const modalRef = this.modalService.open(IntimationFormComponent, {
          size: 'lg',
          backdrop: 'static'
        });
        modalRef.componentInstance.isModal = true;
        modalRef.componentInstance.isEdit = true;
        modalRef.componentInstance.intimationId = this.intimationId;

        modalRef.result.then((result) => {
          if (result) {
            // Refresh the view after edit
            this.loadIntimation();
            this.loadDocumentHistory();
          }
        }).catch(() => {
          // User cancelled
        });
      } else {
        // In route mode, navigate to edit route
        this.router.navigate(['/intimations/edit', this.intimationId]);
      }
    }
  }

  goBack(): void {
    if (this.isModal) {
      this.activeModal.dismiss();
    } else {
      this.router.navigate(['/intimations']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.commentForm.controls).forEach(field => {
      const control = this.commentForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Helper methods for template
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time;
  }

  formatDateTime(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-GB');
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.UserID === userId);
    return user?.UserName || 'Unknown User';
  }

  getStatusName(statusId: number): string {
    const status = this.intimationStatuses.find(s => s.ID === statusId);
    return status?.Status || 'Unknown Status';
  }

  getLastRemarks(): string {
    if (this.documentHistory.length === 0) return '';
    const lastHistory = this.documentHistory[0]; // Assuming sorted by date desc
    return lastHistory.Remarks || '';
  }

  // Modal methods
  close(): void {
    if (this.isModal) {
      this.activeModal.close();
    } else {
      this.router.navigate(['/intimations']);
    }
  }

  dismiss(): void {
    if (this.isModal) {
      this.activeModal.dismiss();
    } else {
      this.router.navigate(['/intimations']);
    }
  }
}
