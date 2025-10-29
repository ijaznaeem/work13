import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { UserDepartments } from '../../../../config/constants';
import { GetDate } from '../../../../factories/utilities';

@Component({
  selector: 'app-add-recall',
  templateUrl: './add-recall.component.html',
  styleUrls: ['./add-recall.component.scss']
})
export class AddRecallComponent implements OnInit {
  
  public recallForm!: FormGroup;
  public productForm!: FormGroup;
  public isEditMode = false;
  public editId: number | null = null;

  // Data lists
  public customers: any[] = [];
  public employees: any[] = [];
  public products: any[] = [];
  public recallProducts: any[] = [];

  // Loading states
  public loadingCustomers = false;
  public loadingEmployees = false;
  public loadingProducts = false;
  public savingRecall = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpBase,
    private alert: MyToastService,
    public bsModalRef: BsModalRef
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadData();
    if (this.editId) {
      this.loadRecallForEdit();
    }
  }

  private initializeForms(): void {
    this.recallForm = this.fb.group({
      date: [GetDate(), Validators.required],
      customerId: ['', Validators.required],
      handedOverBy: ['', Validators.required],
      designation: ['', Validators.required],
      receivedById: ['', Validators.required],
      status: ['In Process'],
      forwardedTo: [UserDepartments.grpOperations],
      remarks: ['']
    });

    this.productForm = this.fb.group({
      productId: ['', Validators.required],
      productType: [''],
      packingSize: [0, [Validators.required, Validators.min(0)]],
      qty: [0, [Validators.required, Validators.min(1)]],
      batchNo: ['', Validators.required],
      mfgDate: [''],
      expDate: [''],
      reason: ['', Validators.required]
    });
  }

  private loadData(): void {
    this.loadCustomers();
    this.loadEmployees();
    this.loadProducts();
  }

  private loadCustomers(): void {
    this.loadingCustomers = true;
    // VB6 query: "accttypeid = 14 and Status = 1"
    this.http.getData('Customers?filter=AcctTypeID=14 AND Status=1')
      .then((data: any) => {
        this.customers = data || [];
        this.loadingCustomers = false;
      })
      .catch((error) => {
        console.error('Error loading customers:', error);
        this.loadMockCustomers();
        this.loadingCustomers = false;
      });
  }

  private loadMockCustomers(): void {
    this.customers = [
      { CustomerID: 1, CustomerName: 'ABC Pharmacy' },
      { CustomerID: 2, CustomerName: 'XYZ Medical Store' },
      { CustomerID: 3, CustomerName: 'Health Plus' },
      { CustomerID: 4, CustomerName: 'Care Pharmacy' }
    ];
  }

  private loadEmployees(): void {
    this.loadingEmployees = true;
    this.http.getData('Employees?filter=Status=1')
      .then((data: any) => {
        this.employees = data || [];
        this.loadingEmployees = false;
      })
      .catch((error) => {
        console.error('Error loading employees:', error);
        this.loadMockEmployees();
        this.loadingEmployees = false;
      });
  }

  private loadMockEmployees(): void {
    this.employees = [
      { EmployeeID: 1, EmployeeName: 'John Doe' },
      { EmployeeID: 2, EmployeeName: 'Jane Smith' },
      { EmployeeID: 3, EmployeeName: 'Mike Johnson' }
    ];
  }

  private loadProducts(): void {
    this.loadingProducts = true;
    // VB6 query: "Type = 1 and Status = 1"
    this.http.getData('Products?filter=Type=1 AND Status=1')
      .then((data: any) => {
        this.products = data || [];
        this.loadingProducts = false;
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        this.loadMockProducts();
        this.loadingProducts = false;
      });
  }

  private loadMockProducts(): void {
    this.products = [
      { ProductID: 1, ProductName: 'Panadol 500mg Tablets' },
      { ProductID: 2, ProductName: 'Augmentin 625mg' },
      { ProductID: 3, ProductName: 'Brufen 400mg' },
      { ProductID: 4, ProductName: 'Calpol Syrup 120ml' }
    ];
  }

  private loadRecallForEdit(): void {
    if (this.editId) {
      this.isEditMode = true;
      this.http.getData(`RecallProducts/${this.editId}`)
        .then((data: any) => {
          if (data) {
            this.recallForm.patchValue({
              date: data.Date ? new Date(data.Date).toISOString().split('T')[0] : '',
              customerId: data.CustomerID,
              handedOverBy: data.HandedOverBy,
              designation: data.Designation,
              receivedById: data.ReceivedByID,
              status: data.Status,
              forwardedTo: data.ForwardedTo,
              remarks: data.Remarks
            });
            this.loadRecallProducts();
          }
        })
        .catch((error) => {
          console.error('Error loading recall for edit:', error);
          this.alert.Error('Failed to load recall data', 'Error');
        });
    }
  }

  private loadRecallProducts(): void {
    if (this.editId) {
      this.http.getData(`RecallDetails?filter=RecallID=${this.editId}`)
        .then((data: any) => {
          this.recallProducts = data || [];
        })
        .catch((error) => {
          console.error('Error loading recall products:', error);
        });
    }
  }

  public addProduct(): void {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        RecallID: this.editId || 0 // Will be updated after recall is saved
      };
      
      this.recallProducts.push(productData);
      this.productForm.reset();
      this.productForm.patchValue({
        qty: 0,
        packingSize: 0
      });
    } else {
      this.markFormGroupTouched(this.productForm);
      this.alert.Warning('Please fill all required product fields', 'Warning');
    }
  }

  public removeProduct(index: number): void {
    if (confirm('Are you sure you want to remove this product?')) {
      this.recallProducts.splice(index, 1);
    }
  }

  public onSave(): void {
    if (this.recallForm.valid && this.recallProducts.length > 0) {
      this.savingRecall = true;
      const recallData = this.recallForm.value;
      
      // Add department-specific data like VB6
      const userDept = this.http.getUserDept();
      const remarks = `---------------\nInitiated By: ${this.getDepartmentName(userDept)} On: ${new Date().toLocaleDateString()}\n\n${recallData.remarks || ''}`;
      
      recallData.remarks = remarks;
      recallData.status = 'In Process';
      recallData.forwardedTo = UserDepartments.grpOperations;

      const apiCall = this.isEditMode 
        ? this.http.postData(`RecallProducts/${this.editId}`, recallData)
        : this.http.postData('RecallProducts', recallData);

      apiCall.then((response: any) => {
        const recallId = this.isEditMode ? this.editId : response.RecallID || response.id;
        
        // Save products
        this.saveRecallProducts(recallId).then(() => {
          this.alert.Sucess(
            `Recall ${this.isEditMode ? 'updated' : 'created'} successfully`, 
            'Success'
          );
          this.bsModalRef.hide();
        });
      }).catch((error) => {
        console.error('Error saving recall:', error);
        this.alert.Error('Failed to save recall', 'Error');
        this.savingRecall = false;
      });
    } else {
      this.markFormGroupTouched(this.recallForm);
      if (this.recallProducts.length === 0) {
        this.alert.Warning('Please add at least one product to the recall', 'Warning');
      } else {
        this.alert.Warning('Please fill all required fields', 'Warning');
      }
    }
  }

  private async saveRecallProducts(recallId: number): Promise<void> {
    const promises = this.recallProducts.map(product => {
      product.RecallID = recallId;
      if (product.DetailID) {
        return this.http.postData(`RecallDetails/${product.DetailID}`, product);
      } else {
        return this.http.postData('RecallDetails', product);
      }
    });

    try {
      await Promise.all(promises);
      this.savingRecall = false;
    } catch (error) {
      console.error('Error saving recall products:', error);
      this.savingRecall = false;
      throw error;
    }
  }

  public onCancel(): void {
    this.bsModalRef.hide();
  }

  private getDepartmentName(deptId: UserDepartments): string {
    const deptNames: { [key: number]: string } = {
      [UserDepartments.grpCEO]: 'CEO',
      [UserDepartments.grpCommercial]: 'Commercial',
      [UserDepartments.grpProduction]: 'Production',
      [UserDepartments.grpSales]: 'Sales',
      [UserDepartments.grpAccounts]: 'Accounts',
      [UserDepartments.grpAdmin]: 'Admin',
      [UserDepartments.grpQC]: 'QC',
      [UserDepartments.grpGM]: 'GM',
      [UserDepartments.grpOperations]: 'Operations',
      [UserDepartments.grpProcurement]: 'Procurement'
    };
    return deptNames[deptId] || 'Unknown';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  public isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
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

  public getProductName(productId: number): string {
    const product = this.products.find(p => p.ProductID === productId);
    return product ? product.ProductName : '';
  }
}