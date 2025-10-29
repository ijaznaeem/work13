import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { UserDepartments } from '../../../../config/constants';

@Component({
  selector: 'app-add-amendment-dialog',
  templateUrl: './add-amendment-dialog.component.html',
  styleUrls: ['./add-amendment-dialog.component.scss']
})
export class AddAmendmentDialogComponent implements OnInit {
  
  public amendmentForm!: FormGroup;
  public amendmentDetailForm!: FormGroup;
  public isEditMode = false;
  public editId: number | null = null;

  // Data lists
  public masterProducts: any[] = [];
  public rawProducts: any[] = [];
  public amendmentDetails: any[] = [];

  // Loading states
  public loadingMasterProducts = false;
  public loadingRawProducts = false;
  public savingAmendment = false;

  // Amendment types from VB6
  public amendmentTypes = [
    { value: 'Add', label: 'Add New Component' },
    { value: 'Change', label: 'Change Quantity' },
    { value: 'Delete', label: 'Remove Component' }
  ];

  // Categories from VB6
  public categories = [
    { value: 'Active', label: 'Active Ingredient' },
    { value: 'Excipient', label: 'Excipient' },
    { value: 'Filler', label: 'Filler' },
    { value: 'Binder', label: 'Binder' },
    { value: 'Disintegrant', label: 'Disintegrant' },
    { value: 'Lubricant', label: 'Lubricant' },
    { value: 'Coating', label: 'Coating Agent' }
  ];

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
      this.loadAmendmentForEdit();
    }
  }

  private initializeForms(): void {
    this.amendmentForm = this.fb.group({
      masterProductId: ['', Validators.required],
      remarks: ['', Validators.required],
      forwardedTo: [UserDepartments.grpOperations],
      status: ['In Process']
    });

    this.amendmentDetailForm = this.fb.group({
      rawProductId: ['', Validators.required],
      type: ['Change', Validators.required],
      oldQty: [{ value: 0, disabled: true }],
      newQty: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadData(): void {
    this.loadMasterProducts();
    this.loadRawProducts();
  }

  private loadMasterProducts(): void {
    this.loadingMasterProducts = true;
    
    // VB6 logic: Load master products for formulation amendment
    this.http.getData('Products?filter=Type=Master AND Status=1')
      .then((data: any) => {
        this.masterProducts = data || [];
        this.loadingMasterProducts = false;
      })
      .catch((error) => {
        console.error('Error loading master products:', error);
        this.loadMockMasterProducts();
        this.loadingMasterProducts = false;
      });
  }

  private loadMockMasterProducts(): void {
    this.masterProducts = [
      { ProductID: 101, ProductName: 'Panadol Tablets 500mg' },
      { ProductID: 102, ProductName: 'Augmentin 625mg' },
      { ProductID: 103, ProductName: 'Brufen 400mg' },
      { ProductID: 104, ProductName: 'Calpol Syrup 120ml' }
    ];
  }

  private loadRawProducts(): void {
    this.loadingRawProducts = true;
    
    // VB6 logic: Load raw materials/components
    this.http.getData('Products?filter=Type=Raw AND Status=1')
      .then((data: any) => {
        this.rawProducts = data || [];
        this.loadingRawProducts = false;
      })
      .catch((error) => {
        console.error('Error loading raw products:', error);
        this.loadMockRawProducts();
        this.loadingRawProducts = false;
      });
  }

  private loadMockRawProducts(): void {
    this.rawProducts = [
      { ProductID: 201, ProductName: 'Microcrystalline Cellulose', Category: 'Excipient', Price: 2.50 },
      { ProductID: 202, ProductName: 'Magnesium Stearate', Category: 'Lubricant', Price: 15.00 },
      { ProductID: 203, ProductName: 'Lactose Monohydrate', Category: 'Filler', Price: 1.80 },
      { ProductID: 204, ProductName: 'Corn Starch', Category: 'Disintegrant', Price: 1.20 },
      { ProductID: 205, ProductName: 'Povidone K30', Category: 'Binder', Price: 8.50 }
    ];
  }

  private loadAmendmentForEdit(): void {
    if (this.editId) {
      this.isEditMode = true;
      this.http.getData(`AmendmentApprovals/${this.editId}`)
        .then((data: any) => {
          if (data) {
            this.amendmentForm.patchValue({
              masterProductId: data.MasterProductID,
              remarks: data.Remarks,
              forwardedTo: data.ForwardedTo,
              status: data.Status
            });
            this.loadAmendmentDetailsForEdit();
          }
        })
        .catch((error) => {
          console.error('Error loading amendment for edit:', error);
          this.alert.Error('Failed to load amendment data', 'Error');
        });
    }
  }

  private loadAmendmentDetailsForEdit(): void {
    if (this.editId) {
      this.http.getData(`AmendmentDetails?filter=AmendmentID=${this.editId}`)
        .then((data: any) => {
          this.amendmentDetails = data || [];
        })
        .catch((error) => {
          console.error('Error loading amendment details:', error);
        });
    }
  }

  public onRawProductSelect(): void {
    const rawProductId = this.amendmentDetailForm.get('rawProductId')?.value;
    const masterProductId = this.amendmentForm.get('masterProductId')?.value;
    
    if (rawProductId && masterProductId) {
      // Load current quantity if exists in formulation
      this.loadCurrentQuantity(masterProductId, rawProductId);
      
      // Set product details
      const selectedRaw = this.rawProducts.find(p => p.ProductID == rawProductId);
      if (selectedRaw) {
        this.amendmentDetailForm.patchValue({
          category: selectedRaw.Category,
          price: selectedRaw.Price
        });
      }
    }
  }

  private loadCurrentQuantity(masterProductId: number, rawProductId: number): void {
    // VB6 logic: Get existing quantity from ProductDetails
    this.http.getData(`ProductDetails?filter=ProductID=${masterProductId} AND RawID=${rawProductId}`)
      .then((data: any) => {
        if (data && data.length > 0) {
          this.amendmentDetailForm.patchValue({
            oldQty: data[0].Qty || 0
          });
        } else {
          this.amendmentDetailForm.patchValue({
            oldQty: 0
          });
        }
      })
      .catch((error) => {
        console.error('Error loading current quantity:', error);
        this.amendmentDetailForm.patchValue({
          oldQty: 0
        });
      });
  }

  public onTypeChange(): void {
    const type = this.amendmentDetailForm.get('type')?.value;
    
    if (type === 'Delete') {
      // For delete, set new quantity to 0
      this.amendmentDetailForm.patchValue({
        newQty: 0
      });
    }
  }

  public addAmendmentDetail(): void {
    if (this.amendmentDetailForm.valid) {
      const formData = this.amendmentDetailForm.value;
      const selectedRaw = this.rawProducts.find(p => p.ProductID == formData.rawProductId);
      
      if (!selectedRaw) {
        this.alert.Warning('Please select a valid raw product', 'Warning');
        return;
      }

      // Check if already exists
      const existingIndex = this.amendmentDetails.findIndex(
        d => d.RawID === formData.rawProductId
      );

      const detailData = {
        RawID: formData.rawProductId,
        ProductName: selectedRaw.ProductName,
        Type: formData.type,
        OldQty: formData.oldQty,
        NewQty: formData.newQty,
        Category: formData.category,
        Price: formData.price,
        AmendmentID: this.editId || 0
      };

      if (existingIndex >= 0) {
        // Update existing
        this.amendmentDetails[existingIndex] = detailData;
      } else {
        // Add new
        this.amendmentDetails.push(detailData);
      }

      // Reset detail form
      this.amendmentDetailForm.reset();
      this.amendmentDetailForm.patchValue({
        type: 'Change',
        oldQty: 0,
        newQty: 0,
        price: 0
      });
    } else {
      this.markFormGroupTouched(this.amendmentDetailForm);
      this.alert.Warning('Please fill all required fields', 'Warning');
    }
  }

  public removeAmendmentDetail(index: number): void {
    if (confirm('Are you sure you want to remove this detail?')) {
      this.amendmentDetails.splice(index, 1);
    }
  }

  public onSave(): void {
    if (this.amendmentForm.valid && this.amendmentDetails.length > 0) {
      this.savingAmendment = true;
      const amendmentData = this.amendmentForm.value;
      
      // Add department-specific data like VB6
      const currentDept = this.http.getUserDept();
      const timestamp = new Date().toLocaleString();
      const deptName = this.getDepartmentName(currentDept);
      
      const remarks = `---------------\nInitiated By: ${deptName} On: ${timestamp}\n\n${amendmentData.remarks}`;
      
      amendmentData.remarks = remarks;
      amendmentData.createdBy = currentDept;
      amendmentData.createdDate = new Date().toISOString();

      const apiCall = this.isEditMode 
        ? this.http.postData(`AmendmentApprovals/${this.editId}`, amendmentData)
        : this.http.postData('AmendmentApprovals', amendmentData);

      apiCall.then((response: any) => {
        const amendmentId = this.isEditMode ? this.editId : response.AmendmentID || response.id;
        
        // Save amendment details
        return this.saveAmendmentDetails(amendmentId);
      }).then(() => {
        this.alert.Sucess(
          `Amendment ${this.isEditMode ? 'updated' : 'created'} successfully`, 
          'Success'
        );
        this.bsModalRef.hide();
      }).catch((error) => {
        console.error('Error saving amendment:', error);
        this.alert.Error('Failed to save amendment', 'Error');
        this.savingAmendment = false;
      });
    } else {
      this.markFormGroupTouched(this.amendmentForm);
      if (this.amendmentDetails.length === 0) {
        this.alert.Warning('Please add at least one amendment detail', 'Warning');
      } else {
        this.alert.Warning('Please fill all required fields', 'Warning');
      }
    }
  }

  private async saveAmendmentDetails(amendmentId: number): Promise<void> {
    const promises = this.amendmentDetails.map(detail => {
      detail.AmendmentID = amendmentId;
      if (detail.DetailID) {
        return this.http.postData(`AmendmentDetails/${detail.DetailID}`, detail);
      } else {
        return this.http.postData('AmendmentDetails', detail);
      }
    });

    try {
      await Promise.all(promises);
      this.savingAmendment = false;
    } catch (error) {
      console.error('Error saving amendment details:', error);
      this.savingAmendment = false;
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

  public getRawProductName(rawId: number): string {
    const product = this.rawProducts.find(p => p.ProductID === rawId);
    return product ? product.ProductName : '';
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
}