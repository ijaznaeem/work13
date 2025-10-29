import {
    AfterViewInit,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ReportConfig } from '../../../models/report.models';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { ReportConfigService } from '../../../services/report-config.service';
import { ReportGeneratorService } from '../../../services/report-generator.service';

@Component({
  selector: 'app-print-html',
  templateUrl: './print-html.component.html',
  styleUrls: ['./print-html.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrintHtmlComponent implements OnInit, AfterViewInit {
  public printdata: any;
  public reportConfig: ReportConfig | null = null;
  Business: any = {};
  IMAGE_URL = environment.UPLOADS_URL;

  constructor(
    private pdata: PrintDataService,
    private http: HttpBase,
    private reportGenerator: ReportGeneratorService,
    private configService: ReportConfigService
  ) {}

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
    this.http.getData('business/' + this.http.getBusinessID()).then((d) => {
      this.Business = d;

      // If we have structured report config, use it
      if (this.printdata.reportConfig) {
        this.reportConfig = this.printdata.reportConfig;
      }
    });
  }

  ngAfterViewInit() {
    // Priority: Use report config for data-driven table generation
    if (this.reportConfig?.tableConfig) {
      this.setupDataDrivenTable();
    }
    // Fallback: Legacy support - append HTML data if present
    else if (this.printdata.HTMLData) {
      this.appendLegacyHTMLData();
    }

    this.setupPageLayout();
  }

  private appendLegacyHTMLData(): void {
    const legacyElement = document.getElementById('legacy-content');
    if (legacyElement && this.printdata.HTMLData) {
      // Clone the element to avoid affecting the original
      const clonedElement = this.printdata.HTMLData.cloneNode(true);
      legacyElement.appendChild(clonedElement);

      // Apply styling for better print appearance
      this.applyLegacyStyling(clonedElement);
    }
  }

  private setupDataDrivenTable(): void {
    // The table is now generated via Angular template binding
    // This method can be used for any additional setup if needed
    console.log('Data-driven table setup complete');
  }

  private applyLegacyStyling(element: HTMLElement): void {
    // Remove any elements that shouldn't be printed
    const elementsToHide = element.querySelectorAll('.no-print, .btn, button, .form-control');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Apply better table styling
    const tables = element.querySelectorAll('table');
    tables.forEach(table => {
      table.classList.add('table-bordered', 'table-striped');
      table.style.fontSize = '12px';
      table.style.marginBottom = '20px';
    });
  }

  private setupPageLayout(): void {
    const pageSize = this.reportConfig?.pageSize || 'A4';
    document.body.classList.add(pageSize);
    document.body.classList.remove('A4', 'A5', 'Letter');
    document.body.classList.add(pageSize);
  }

  Print(): void {
    window.print();
  }

  Export(): void {
    if (this.reportConfig) {
      this.exportWithConfig();
    } else {
      this.exportLegacy();
    }
  }

  private exportWithConfig(): void {
    if (!this.reportConfig) return;

    const formats = this.reportConfig.exportOptions?.formats || ['pdf'];

    formats.forEach(format => {
      switch (format) {
        case 'pdf':
          this.exportToPDF();
          break;
        case 'excel':
          this.reportGenerator.generateExcel(this.reportConfig!);
          break;
        case 'csv':
          this.reportGenerator.generateCSV(this.reportConfig!);
          break;
      }
    });
  }

  private exportToPDF(): void {
    if (!this.reportConfig) return;

    const doc = this.reportGenerator.generatePDF(this.reportConfig, this.Business);
    const filename = this.reportConfig.exportOptions?.filename || this.reportConfig.title || 'report';
    doc.save(`${filename}.pdf`);
  }

  private exportLegacy(): void {
    // For legacy exports, try to extract data from DOM if no config available
    if (!this.printdata.HTMLData) {
      console.warn('No data available for legacy export');
      return;
    }

    // Create a basic config from legacy data
    const legacyConfig = this.createLegacyConfig();

    // Try to extract table data from DOM
    const tableData = this.extractTableDataFromDOM();
    if (tableData) {
      legacyConfig.tableConfig = {
        ...legacyConfig.tableConfig!,
        ...tableData
      };
    }

    const doc = this.reportGenerator.generatePDF(legacyConfig, this.Business);
    doc.save(`${this.printdata.Title || 'report'}.pdf`);
  }

  private extractTableDataFromDOM(): any {
    try {
      const htmlElement = this.printdata.HTMLData;
      const table = htmlElement.querySelector('table');

      if (!table) return null;

      // Extract headers
      const headerRow = table.querySelector('thead tr, tr:first-child');
      const headers = Array.from(headerRow?.querySelectorAll('th, td') || [])
        .map((th, index) => ({
          label: (th as HTMLElement).textContent?.trim() || `Column ${index + 1}`,
          field: `col_${index}`,
          align: 'left' as const
        }));

      // Extract data rows
      const dataRows = Array.from(table.querySelectorAll('tbody tr, tr:not(:first-child)'))
        .filter(row => !(row as HTMLElement).querySelector('th')) // Skip header rows
        .map(row => {
          const cells = Array.from((row as HTMLElement).querySelectorAll('td'));
          const rowData: any = {};
          cells.forEach((cell, index) => {
            rowData[`col_${index}`] = (cell as HTMLElement).textContent?.trim() || '';
          });
          return rowData;
        });

      return {
        columns: headers,
        data: dataRows,
        showSummary: false
      };
    } catch (error) {
      console.error('Error extracting table data from DOM:', error);
      return null;
    }
  }

  private createLegacyConfig(): ReportConfig {
    // Convert legacy printdata to new config format
    const baseConfig = this.configService.getDefaultConfig();

    return this.configService.mergeConfigs(baseConfig, {
      title: this.printdata.Title || '',
      subTitle: this.printdata.SubTitle || '',
      customerName: this.printdata.CustomerName || '',
      headerConfig: {
        businessName: this.Business.BusinessName,
        address: this.Business.Address,
        phone: this.Business.Phone
      }
    });
  }

  // Method to export in multiple formats
  exportMultiple(formats: ('pdf' | 'excel' | 'csv')[]): void {
    if (!this.reportConfig) {
      console.warn('No report configuration available for multiple export');
      return;
    }

    const updatedConfig = {
      ...this.reportConfig,
      exportOptions: {
        ...this.reportConfig.exportOptions,
        formats
      }
    };

    this.reportConfig = updatedConfig;
    this.exportWithConfig();
  }

  // Helper method to update report configuration
  updateReportConfig(updates: Partial<ReportConfig>): void {
    if (this.reportConfig) {
      this.reportConfig = this.configService.mergeConfigs(this.reportConfig, updates);
    }
  }

  getValue(r: any, c: string): any {
    return r[c];
  }

  // Methods for data-driven table generation
  getVisibleColumns(): any[] {
    if (!this.reportConfig?.tableConfig?.columns) return [];
    return this.reportConfig.tableConfig.columns.filter(col => col.visible !== false);
  }

  formatCellValue(value: any, column: any): string {
    if (value === null || value === undefined) return '';

    // Apply formatting based on column format
    if (column.format && value !== null && value !== undefined) {
      return this.formatValue(value, column.format);
    }

    return value.toString();
  }

  calculateColumnSum(fieldName: string, column: any): string {
    if (!this.reportConfig?.tableConfig?.data || !column.sum) return '';

    const total = this.reportConfig.tableConfig.data.reduce((sum, row) => {
      const val = parseFloat(row[fieldName]) || 0;
      return sum + val;
    }, 0);

    return column.format ? this.formatValue(total, column.format) : total.toString();
  }

  private formatValue(value: any, format: string): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'number':
        return new Intl.NumberFormat().format(value);
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value.toString();
    }
  }

  getColumnAlignment(column: any): string {
    // Check if it's a numeric column (sum or currency/number format)
    if (column.sum || column.format === 'currency' || column.format === 'number') {
      return 'right';
    }
    // Use column's specified alignment or default to left
    return column.align || 'left';
  }
}
