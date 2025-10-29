import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';

interface ImageFile {
  file: File;
  preview: string;
  description: string;
  size: string;
  type: string;
  selected: boolean;
}

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrls: ['./add-images.component.scss']
})
export class AddImagesComponent implements OnInit {
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  public imageForm!: FormGroup;
  public recallId: number = 0;
  public uploadedImages: ImageFile[] = [];
  public selectedImages: ImageFile[] = [];
  public uploadingImages = false;
  public maxFileSize = 5 * 1024 * 1024; // 5MB
  public allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

  constructor(
    private fb: FormBuilder,
    private http: HttpBase,
    private alert: MyToastService,
    public bsModalRef: BsModalRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Form is already initialized in constructor
  }

  private initializeForm(): void {
    this.imageForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  public onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  private processFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!this.allowedTypes.includes(file.type)) {
        this.alert.Warning(`File ${file.name} is not a supported image format`, 'Invalid File');
        continue;
      }
      
      // Validate file size
      if (file.size > this.maxFileSize) {
        this.alert.Warning(`File ${file.name} is too large (max 5MB)`, 'File Too Large');
        continue;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageFile: ImageFile = {
          file: file,
          preview: e.target.result,
          description: '',
          size: this.formatFileSize(file.size),
          type: file.type,
          selected: true
        };
        
        this.uploadedImages.push(imageFile);
      };
      
      reader.readAsDataURL(file);
    }
    
    // Clear file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  public removeImage(index: number): void {
    if (confirm('Are you sure you want to remove this image?')) {
      this.uploadedImages.splice(index, 1);
    }
  }

  public toggleImageSelection(index: number): void {
    this.uploadedImages[index].selected = !this.uploadedImages[index].selected;
  }

  public selectAllImages(): void {
    this.uploadedImages.forEach(img => img.selected = true);
  }

  public deselectAllImages(): void {
    this.uploadedImages.forEach(img => img.selected = false);
  }

  public getSelectedCount(): number {
    return this.uploadedImages.filter(img => img.selected).length;
  }

  public onSave(): void {
    const selectedImages = this.uploadedImages.filter(img => img.selected);
    
    if (selectedImages.length === 0) {
      this.alert.Warning('Please select at least one image to upload', 'No Images Selected');
      return;
    }

    this.uploadingImages = true;
    const formDescription = this.imageForm.get('description')?.value || '';
    
    // Upload images one by one
    this.uploadImagesSequentially(selectedImages, formDescription)
      .then(() => {
        this.alert.Sucess(`${selectedImages.length} image(s) uploaded successfully`, 'Success');
        this.bsModalRef.hide();
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
        this.alert.Error('Failed to upload some images', 'Error');
      })
      .finally(() => {
        this.uploadingImages = false;
      });
  }

  private async uploadImagesSequentially(images: ImageFile[], globalDescription: string): Promise<void> {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const formData = new FormData();
      
      formData.append('file', image.file);
      formData.append('RecallID', this.recallId.toString());
      formData.append('Description', image.description || globalDescription);
      formData.append('FileName', image.file.name);
      formData.append('FileSize', image.file.size.toString());
      formData.append('FileType', image.file.type);
      formData.append('UploadDate', new Date().toISOString());
      
      try {
        await this.http.postData('RecallImages', formData);
      } catch (error) {
        console.error(`Failed to upload ${image.file.name}:`, error);
        throw error;
      }
    }
  }

  public onCancel(): void {
    this.bsModalRef.hide();
  }

  public openFileBrowser(): void {
    this.fileInput.nativeElement.click();
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public updateImageDescription(index: number, description: string): void {
    this.uploadedImages[index].description = description;
  }

  public isImageValid(image: ImageFile): boolean {
    return this.allowedTypes.includes(image.type) && image.file.size <= this.maxFileSize;
  }

  public getImageValidationError(image: ImageFile): string {
    if (!this.allowedTypes.includes(image.type)) {
      return 'Unsupported file format';
    }
    if (image.file.size > this.maxFileSize) {
      return 'File too large (max 5MB)';
    }
    return '';
  }
}