import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserDepartments } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { ReturnStatus } from '../constants';

@Component({
  selector: 'app-add-purchase-return-approval',
  templateUrl: './add-purchase-return-approval.component.html',
  styleUrls: ['./add-purchase-return-approval.component.scss']
})
export class AddPurchaseReturnApprovalComponent implements OnInit {
  public approvalForm!: FormGroup;
  public suppliers: any[] = [];
  public products: any[] = [];
  public isEditMode = false;
  public editId: number | null = null;
  public statuses = ReturnStatus;

  constructor(
    private fb: FormBuilder,
    private http: HttpBase,
    private alert: MyToastService,
    public bsModalRef: BsModalRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
  }

  private initializeForm(): void {
    this.approvalForm = this.fb.group({
      supplierID: ['', Validators.required],
      productID: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      forwardedTo: ['', Validators.required],
      remarks: [''],
      status: ['Pending']
    });
  }

  private loadSuppliers(): void {
    this.http.getData('suppliers').then((data: any) => {
      this.suppliers = data || [];
    }).catch((error) => {
      console.error('Error loading suppliers:', error);
      this.alert.Error('Failed to load suppliers', 'Error');
    });
  }

  private loadProducts(): void {
    this.http.getData('products').then((data: any) => {
      this.products = data || [];
    }).catch((error) => {
      console.error('Error loading products:', error);
      this.alert.Error('Failed to load products', 'Error');
    });
  }

  public onSubmit(): void {
    if (this.approvalForm.valid) {
      const formData = this.approvalForm.value;
      
      // Set forwarded department based on current user department
      const userDept = this.http.getUserDept();
      if (userDept === UserDepartments.grpQC || userDept === UserDepartments.grpCEO) {
        formData.forwardedTo = UserDepartments.grpAccounts;
      }

      const apiCall = this.isEditMode 
        ? this.http.postData(`PurchaseReturnApprovals/${this.editId}`, formData)
        : this.http.postData('PurchaseReturnApprovals', formData);

      apiCall.then(() => {
        this.alert.Sucess(
          `Purchase return approval ${this.isEditMode ? 'updated' : 'created'} successfully`, 
          'Success'
        );
        this.bsModalRef.hide();
      }).catch((error) => {
        console.error('Error saving purchase return approval:', error);
        this.alert.Error('Failed to save purchase return approval', 'Error');
      });
    } else {
      this.markFormGroupTouched();
      this.alert.Warning('Please fill all required fields', 'Warning');
    }
  }

  public onCancel(): void {
    this.bsModalRef.hide();
  }

  public setEditData(editId: number): void {
    this.isEditMode = true;
    this.editId = editId;
    
    this.http.getData(`PurchaseReturnApprovals/${editId}`).then((data: any) => {
      if (data) {
        this.approvalForm.patchValue({
          supplierID: data.SupplierID,
          productID: data.ProductID,
          quantity: data.Qty,
          rate: data.Rate,
          date: data.Date ? new Date(data.Date).toISOString().split('T')[0] : '',
          forwardedTo: data.ForwardedTo,
          remarks: data.Remarks,
          status: data.Status
        });
      }
    }).catch((error) => {
      console.error('Error loading approval data:', error);
      this.alert.Error('Failed to load approval data', 'Error');
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.approvalForm.controls).forEach(key => {
      const control = this.approvalForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.approvalForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public getFieldError(fieldName: string): string {
    const field = this.approvalForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['min']) {
        return `${fieldName} must be greater than ${field.errors['min'].min}`;
      }
    }
    return '';
  }
}