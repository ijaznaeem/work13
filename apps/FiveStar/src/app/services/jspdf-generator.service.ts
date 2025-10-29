// pdf-generator.service.ts

import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class JSPdfGeneratorService {
  private nextTextYPosition: number = 0; // Track Y position for the next text
  private doc:jsPDF;
  constructor() { }

  startPDF(){
    this.doc =  new jsPDF('p', 'mm', 'a4');
    this.nextTextYPosition = 10;
  }
  generatePDF(header: string, subHeader: string, text: string, tableId: string): void {


    // Add header
    if (header) {
      this.addText( header, { fontSize: 16, fontStyle: 'bold' });
    }

    // Add subheader
    if (subHeader) {
      this.addText( subHeader, { fontSize: 14, fontStyle: 'bold' });
    }

    // Add text
    if (text) {
      this.addText( text, { fontSize: 12 });
    }

    // Add table from HTML
    if (tableId) {

      this.doc.html(`${tableId}`, {
        callback: (doc) => {
          this.savePDF(doc);
        }
      });
    } else {
      this.savePDF(this.doc);
    }
  }

  public addText( text: string, options?: { fontSize?: number,  fontName?:string,
    fontStyle?: string, alignment?: string }): void {
    const { fontSize = 12,  fontName= 'helvetica', fontStyle = 'normal', alignment = 'left' } = options || {};

    this.doc.setFontSize(fontSize);
    this.doc.setFont(fontName,fontStyle);

    const textWidth =this.doc.getStringUnitWidth(text) * fontSize /this.doc.internal.scaleFactor;
    const pageWidth =this.doc.internal.pageSize.width;

    let textXPosition: number;

    switch (alignment) {
      case 'center':
        textXPosition = (pageWidth - textWidth) / 2;
        break;
      case 'right':
        textXPosition = pageWidth - textWidth - 10; // 10px margin from right
        break;
      default:
        textXPosition = 10; // 10px margin from left
    }


    var effectiveWidth = this.doc.internal.pageSize.width - (this.doc.internal.pageSize.width * 0.1); // Assuming 10% margins on each side

    // Split text into lines with the calculated effective width
    var lines = this.doc.splitTextToSize(text, effectiveWidth);
    for (var i = 0; i < lines.length; i++) {
      // Check if there is enough space on the page
      if (this.nextTextYPosition + 10 >this.doc.internal.pageSize.height) {
          // Add a new page
         this.doc.addPage();
          // Reset y-position
          this.nextTextYPosition =10
      }
      // Write the line of text
      this.doc.text(lines[i],this.doc.internal.pageSize.width * 0.05, this.nextTextYPosition ); // Start at 5% from the left margin
      // Increment y-position for the next line
      this.nextTextYPosition += (fontSize * 0.75);
  }

  }

  public savePDF(filename): void {
   this.doc.save(`${filename}.pdf`);
    // Reset next text Y position after saving
    this.nextTextYPosition = 0;
  }
  public openPDF(): void {
    this.doc.output('dataurlnewwindow');
    // Reset next text Y position after saving
    this.nextTextYPosition = 0;
  }
}
