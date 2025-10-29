import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ReportConfig, TableColumn } from '../models/report.models';

@Injectable({
  providedIn: 'root'
})
export class ReportGeneratorService {

  generatePDF(config: ReportConfig, businessData?: any): jsPDF {
    const doc = new jsPDF(
      config.orientation || 'portrait',
      'mm',
      config.pageSize || 'a4'
    );

    let yPosition = 10;

    // Add header
    if (config.headerConfig) {
      yPosition = this.addHeader(doc, config, businessData, yPosition);
    }

    // Add title and subtitle
    yPosition = this.addTitles(doc, config, yPosition);

    // Add table
    if (config.tableConfig) {
      this.addTable(doc, config, yPosition);
    }

    // Add footer
    if (config.footerConfig) {
      this.addFooter(doc, config);
    }

    return doc;
  }

  private addHeader(doc: jsPDF, config: ReportConfig, businessData: any, yPosition: number): number {
    const header = config.headerConfig!;

    if (header.showLogo && header.logoUrl) {
      // Add logo logic here if needed
      yPosition += 20;
    }

    if (header.businessName || businessData?.BusinessName) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(header.businessName || businessData.BusinessName, 105, yPosition, {
        align: 'center',
      });
      yPosition += 5;
    }

    if (header.address || businessData?.Address) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const address = `${header.address || businessData.Address}, ${businessData?.City || ''}`;
      doc.text(address, 105, yPosition, { align: 'center' });
      yPosition += 5;
    }

    if (header.phone || businessData?.Phone) {
      doc.text(`Tel: ${header.phone || businessData.Phone}`, 105, yPosition, {
        align: 'center',
      });
      yPosition += 10;
    }

    // Add custom fields
    if (header.customFields) {
      header.customFields.forEach(field => {
        const x = field.position === 'right' ? 180 : field.position === 'left' ? 20 : 105;
        const align = field.position === 'center' ? 'center' : 'left';
        doc.setFontSize(9);
        doc.text(`${field.label} ${field.value}`, x, yPosition, { align: align as any });
        yPosition += 4;
      });
      yPosition += 5;
    }

    return yPosition;
  }

  private addTitles(doc: jsPDF, config: ReportConfig, yPosition: number): number {
    if (config.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(config.title, 105, yPosition, { align: 'center' });
      yPosition += 7;
    }

    if (config.subTitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(config.subTitle, 105, yPosition, { align: 'center' });
      yPosition += 7;
    }

    if (config.customerName) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(config.customerName, 105, yPosition, { align: 'center' });
      yPosition += 7;
    }

    return yPosition;
  }

  private addTable(doc: jsPDF, config: ReportConfig, startY: number): void {
    const tableConfig = config.tableConfig!;
    const styling = tableConfig.styling;

    // Prepare table data
    const visibleColumns = tableConfig.columns.filter(col => col.visible !== false);
    const headers = visibleColumns.map(col => col.label);

    const rows = tableConfig.data.map(row => {
      return visibleColumns.map(col => {
        let value = row[col.field];

        // Apply formatting
        if (col.format && value !== null && value !== undefined) {
          value = this.formatValue(value, col.format);
        }

        return value?.toString() || '';
      });
    });

    // Add summary row if needed
    if (tableConfig.showSummary) {
      const summaryRow = visibleColumns.map(col => {
        if (col.sum) {
          const total = tableConfig.data.reduce((sum, row) => {
            const val = parseFloat(row[col.field]) || 0;
            return sum + val;
          }, 0);
          return col.format ? this.formatValue(total, col.format) : total.toString();
        }
        return col.label === visibleColumns[0].label ? 'Total:' : '';
      });
      rows.push(summaryRow);
    }

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: startY,
      margin: config.exportOptions?.pdfOptions?.margins || { top: 5, left: 3, right: 3, bottom: 5 },
      styles: {
        cellPadding: styling?.cellPadding || 0.5,
        overflow: 'linebreak',
        fontSize: styling?.fontSize || 8,
        lineWidth: 0.25,
        lineColor: this.hexToRgb(styling?.borderColor || '#000000'),
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: this.hexToRgb(styling?.headerBackgroundColor || '#f8f9fa'),
        textColor: this.hexToRgb(styling?.headerTextColor || '#000000'),
        fontStyle: 'bold',
        fontSize: (styling?.fontSize || 8) + 2,
        lineWidth: 0.25,
        lineColor: this.hexToRgb(styling?.borderColor || '#000000'),
      },
      tableLineWidth: 0.25,
      tableLineColor: this.hexToRgb(styling?.borderColor || '#000000'),
      columnStyles: this.getColumnStyles(visibleColumns),
    });
  }

  private addFooter(doc: jsPDF, config: ReportConfig): void {
    const footer = config.footerConfig!;
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height;

    if (footer.showPageNumbers) {
      doc.setFontSize(8);
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageSize.width - 20, pageHeight - 10);
    }

    if (footer.showDateTime) {
      const now = new Date().toLocaleString();
      doc.setFontSize(8);
      doc.text(`Generated: ${now}`, 10, pageHeight - 10);
    }

    if (footer.customText) {
      doc.setFontSize(8);
      doc.text(footer.customText, 105, pageHeight - 10, { align: 'center' });
    }
  }

  private getColumnStyles(columns: TableColumn[]): any {
    const styles: any = {};
    columns.forEach((col, index) => {
      styles[index] = {
        halign: col.align || 'left',
        cellWidth: col.width ? parseFloat(col.width) : 'auto'
      };
    });
    return styles;
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

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  generateExcel(config: ReportConfig): void {
    if (!config.tableConfig) return;

    const tableConfig = config.tableConfig;
    const visibleColumns = tableConfig.columns.filter(col => col.visible !== false);

    // Create worksheet data
    const headers = visibleColumns.map(col => col.label);
    const rows = tableConfig.data.map(row => {
      return visibleColumns.map(col => row[col.field]);
    });

    // Add summary row if needed
    if (tableConfig.showSummary) {
      const summaryRow = visibleColumns.map(col => {
        if (col.sum) {
          return tableConfig.data.reduce((sum, row) => {
            const val = parseFloat(row[col.field]) || 0;
            return sum + val;
          }, 0);
        }
        return col.label === visibleColumns[0].label ? 'Total:' : '';
      });
      rows.push(summaryRow);
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, config.title || 'Report');

    const filename = config.exportOptions?.filename || config.title || 'report';
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  generateCSV(config: ReportConfig): void {
    if (!config.tableConfig) return;

    const tableConfig = config.tableConfig;
    const visibleColumns = tableConfig.columns.filter(col => col.visible !== false);

    // Create CSV content
    const headers = visibleColumns.map(col => col.label).join(',');
    const rows = tableConfig.data.map(row => {
      return visibleColumns.map(col => {
        const value = row[col.field];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',');
    });

    const csvContent = [headers, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.exportOptions?.filename || config.title || 'report'}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
