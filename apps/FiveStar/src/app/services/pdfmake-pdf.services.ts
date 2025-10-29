import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PDFMakePdfService {
  private nextTextYPosition: number = 0;
  private docDefinition: any = {
    content: [],
    defaultStyle: { fontSize: 12 }
  };

  constructor() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  startPDF(): void {
    this.docDefinition = {
      content: [],
      defaultStyle: { fontSize: 12 }
    };
  }

  generatePDF(header: string, subHeader: string, text: string, tableData: any[][]): void {
    if (header) this.addText(header, { fontSize: 16, bold: true });
    if (subHeader) this.addText(subHeader, { fontSize: 14, bold: true });
    if (text) this.addText(text);
    if (tableData) this.addTable(tableData);

    this.savePDF('generated_pdf');
  }

  addText(text: string, options?: any): void {
    this.docDefinition.content.push({ text, ...options });
  }

  addTable(tableData: any[][]): void {
    this.docDefinition.content.push({
      table: {
        widths: ['*', '*', '*'], // Example widths, adjust as needed
        body: tableData
      }
    });
  }

  savePDF(filename: string): void {
    pdfMake.createPdf(this.docDefinition).download(`${filename}.pdf`);
    this.nextTextYPosition = 0;
  }
}
