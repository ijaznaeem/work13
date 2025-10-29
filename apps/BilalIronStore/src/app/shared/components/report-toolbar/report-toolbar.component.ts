import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReportConfig } from '../../../models/report.models';
import { ReportGeneratorService } from '../../../services/report-generator.service';

@Component({
  selector: 'app-report-toolbar',
  template: `
    <div class="btn-toolbar mb-3" role="toolbar">
      <div class="btn-group mr-2" role="group">
        <button
          type="button"
          class="btn btn-primary"
          (click)="onPrint()"
          [disabled]="!config">
          <i class="fa fa-print"></i> Print
        </button>

        <button
          type="button"
          class="btn btn-danger"
          (click)="onExportPDF()"
          [disabled]="!config">
          <i class="fa fa-file-pdf"></i> PDF
        </button>

        <button
          type="button"
          class="btn btn-success"
          (click)="onExportExcel()"
          [disabled]="!config">
          <i class="fa fa-file-excel"></i> Excel
        </button>

        <button
          type="button"
          class="btn btn-info"
          (click)="onExportCSV()"
          [disabled]="!config">
          <i class="fa fa-file"></i> CSV
        </button>
      </div>

      <div class="btn-group" role="group" *ngIf="showBulkExport">
        <button
          type="button"
          class="btn btn-warning dropdown-toggle"
          data-bs-toggle="dropdown">
          <i class="fa fa-download"></i> Export All
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" (click)="onExportAll(['pdf', 'excel']); $event.preventDefault()">
            PDF + Excel
          </a>
          <a class="dropdown-item" href="#" (click)="onExportAll(['pdf', 'csv']); $event.preventDefault()">
            PDF + CSV
          </a>
          <a class="dropdown-item" href="#" (click)="onExportAll(['pdf', 'excel', 'csv']); $event.preventDefault()">
            All Formats
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-toolbar {
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .btn-group .btn {
      margin-right: 5px;
    }

    .btn-group .btn:last-child {
      margin-right: 0;
    }

    .btn i {
      margin-right: 5px;
    }

    @media print {
      .btn-toolbar {
        display: none !important;
      }
    }

    @media (max-width: 768px) {
      .btn-toolbar {
        flex-direction: column;
      }

      .btn-group {
        margin-bottom: 10px;
        margin-right: 0 !important;
      }

      .btn {
        margin-bottom: 5px;
      }
    }
  `]
})
export class ReportToolbarComponent {
  @Input() config: ReportConfig | null = null;
  @Input() businessData: any = null;
  @Input() showBulkExport: boolean = false;

  @Output() print = new EventEmitter<void>();
  @Output() exportPDF = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
  @Output() exportCSV = new EventEmitter<void>();
  @Output() exportMultiple = new EventEmitter<('pdf' | 'excel' | 'csv')[]>();

  constructor(private reportGenerator: ReportGeneratorService) {}

  onPrint(): void {
    this.print.emit();
  }

  onExportPDF(): void {
    if (this.config) {
      const doc = this.reportGenerator.generatePDF(this.config, this.businessData);
      const filename = this.config.exportOptions?.filename || this.config.title || 'report';
      doc.save(`${filename}.pdf`);
    }
    this.exportPDF.emit();
  }

  onExportExcel(): void {
    if (this.config) {
      this.reportGenerator.generateExcel(this.config);
    }
    this.exportExcel.emit();
  }

  onExportCSV(): void {
    if (this.config) {
      this.reportGenerator.generateCSV(this.config);
    }
    this.exportCSV.emit();
  }

  onExportAll(formats: ('pdf' | 'excel' | 'csv')[]): void {
    this.exportMultiple.emit(formats);

    if (this.config) {
      formats.forEach(format => {
        switch (format) {
          case 'pdf':
            this.onExportPDF();
            break;
          case 'excel':
            this.onExportExcel();
            break;
          case 'csv':
            this.onExportCSV();
            break;
        }
      });
    }
  }
}
