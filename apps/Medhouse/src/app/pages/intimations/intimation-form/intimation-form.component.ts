import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  Department,
  IntimationLetter,
  IntimationStatus,
  User,
} from '../models/intimation.models';
import { IntimationService } from '../services/intimation.service';

@Component({
  selector: 'app-intimation-form',
  templateUrl: './intimation-form.component.html',
  styleUrls: ['./intimation-form.component.scss'],
})
export class IntimationFormComponent implements OnInit {
  @Input() isModal = false;
  @Input() isEdit = false;
  @Input() intimationId: number | null = null;

  intimationForm!: FormGroup;
  departments: any = [];
  users: User[] = [];
  intimationStatuses: IntimationStatus[] = [];

  isLoading = false;
  isSaving = false;

  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private intimationService: IntimationService,
    private authService: AuthenticationService,
    private toast: MyToastService,
    public activeModal: NgbActiveModal
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadData();

    if (!this.isModal) {
      this.checkRouteParams();
    } else if (this.isEdit && this.intimationId) {
      this.loadIntimation();
    }
  }

  createForm(): void {
    this.intimationForm = this.fb.group({
      DepartmentID: ['', Validators.required],
      Date: [new Date().toISOString().split('T')[0], Validators.required],
      Time: [new Date().toLocaleTimeString('en-US', { hour12: false })],
      NatureOfWork: ['', [Validators.required, Validators.maxLength(1024)]],
      Description: [''],
      InitiatedBy: ['', Validators.required],
      Status: [1],
      jobCompletionDate: [''],
      jobCompletionTime: [''],
      Remarks: [''],
      ForwardedTo: [''],
    });
  }

  loadData(): void {
    this.isLoading = true;

    // Load departments
    this.intimationService
      .getDepartments()
      .then((departments) => {
        this.departments = departments;
        if (this.currentUser?.Department && !this.isEdit) {
          this.intimationForm.patchValue({
            DepartmentID: this.currentUser.Department,
          });
        }
      })
      .catch((error) => {
        console.error('Error loading departments:', error);
        this.toast.Error('Error loading departments', 'Error');
      });

    // Load users
    this.intimationService.getUsersByDepartment().subscribe({
      next: (users) => {
        this.users = users;
        // Set current user as initiator
        if (this.currentUser?.UserID && !this.isEdit) {
          this.intimationForm.patchValue({
            initiatedBy: this.currentUser.UserID,
          });
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toast.Error('Error loading users', 'Error');
      },
    });

    // Load intimation statuses
    this.intimationService.getIntimationStatuses().subscribe({
      next: (statuses) => {
        this.intimationStatuses = statuses;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
        this.toast.Error('Error loading statuses', 'Error');
      },
    });

    this.isLoading = false;
  }

  checkRouteParams(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.intimationId = +params['id'];
        this.isEdit = true;
        this.loadIntimation();
      }
    });
  }

  loadIntimation(): void {
    if (!this.intimationId) return;

    this.isLoading = true;
    this.intimationService.getIntimation(this.intimationId).subscribe({
      next: (intimation) => {
        this.populateForm(intimation);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading intimation:', error);
        this.toast.Error('Error loading intimation', 'Error');
        this.isLoading = false;
        this.router.navigate(['/intimations']);
      },
    });
  }

  populateForm(intimation: IntimationLetter): void {
    const formattedDate = intimation.Date
      ? new Date(intimation.Date).toISOString().split('T')[0]
      : '';
    const formattedCompletionDate = intimation.jobCompletionDate
      ? new Date(intimation.jobCompletionDate).toISOString().split('T')[0]
      : '';

    this.intimationForm.patchValue({
      DepartmentID: intimation.DepartmentID,
      Date: formattedDate,
      Time: intimation.Time || '',
      NatureOfWork: intimation.NatureOfWork,
      Description: intimation.Description || '',
      InitiatedBy: intimation.InitiatedBy,
      Status: intimation.Status || 1,
      jobCompletionDate: formattedCompletionDate,
      jobCompletionTime: intimation.jobCompletionTime || '',
      Remarks: intimation.Remarks || '',
      ForwardedTo: intimation.ForwardedTo || '',
    });
  }

  onDepartmentChange(): void {
    const departmentId = this.intimationForm.get('DepartmentID')?.value;
    if (departmentId) {
      this.intimationService.getUsersByDepartment(departmentId).subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Error loading users for department:', error);
        },
      });
    }
  }

  onSave(): void {
    if (this.intimationForm.invalid) {
      this.markFormGroupTouched();
      this.toast.Warning('Please fill all required fields', 'Validation Error');
      return;
    }

    this.isSaving = true;
    const formValue = this.intimationForm.value;

    // Prepare the intimation object
    const intimation: IntimationLetter = {
      ...formValue,
      Date: new Date(formValue.Date),
      jobCompletionDate: formValue.jobCompletionDate
        ? new Date(formValue.jobCompletionDate)
        : undefined,
      IsClosed: false,
    };

    const operation = this.isEdit
      ? this.intimationService.updateIntimation(this.intimationId!, intimation)
      : this.intimationService.createIntimation(intimation);

    operation.subscribe({
      next: () => {
        const message = this.isEdit
          ? 'Intimation updated successfully'
          : 'Intimation created successfully';
        this.toast.Sucess(message, 'Success');

        if (this.isModal) {
          this.activeModal.close('saved');
        } else {
          this.router.navigate(['/intimations']);
        }
      },
      error: (error) => {
        console.error('Error saving intimation:', error);
        this.toast.Error('Error saving intimation', 'Error');
        this.isSaving = false;
      },
    });
  }

  onCancel(): void {
    if (this.isModal) {
      this.activeModal.dismiss('cancelled');
    } else {
      this.router.navigate(['/intimations']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.intimationForm.controls).forEach((field) => {
      const control = this.intimationForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.intimationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.intimationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName} is too long`;
      }
    }
    return '';
  }
}
