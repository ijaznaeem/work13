import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SearchComponent } from '../../sales/search/search.component';
import { jsPDF } from 'jspdf';
import 'jspdf-barcode';
import autoTable from 'jspdf-autotable';
import * as PDFObject from 'pdfobject';

@Component({
  selector: 'app-barcode-print',
  templateUrl: './barcode-print.component.html',
  styleUrls: ['./barcode-print.component.scss'],
})
export class BarcodePrintComponent implements OnInit {
  public data: any = [];
  @ViewChild('Barcode') pcode;
  @ViewChild('qty') qty;

  Options = { CompanyName: true, ProductName: true, Price: true };

  setting = {
    Columns: [
      {
        label: 'Barcode',
        fldName: 'PCode',
      },
      {
        label: 'ProductName',
        fldName: 'ProductName',
      },
      {
        label: 'Price',
        fldName: 'SPrice',
      },
      {
        label: 'Qty',
        fldName: 'Qty',
        sum: true,
      },
      {
        label: 'Weight(gm)',
        fldName: 'Weight',

      },
    ],
    Actions: [
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
    ],
    Data: [],
  };
  selectedProduct: any = {};
  bsModalRef: any;
  BARCODE_DATA = 'BARCODE_DATA';
  ShopName = '';
  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    let d = this.http.getItem(this.BARCODE_DATA);
    if (d.length > 0) {
      this.data = d;
    }

    this.http.getData('business').then((r: any) => {
      this.ShopName = r[0].BusinessName;
    });
  }
  AddData() {
    console.log(this.selectedProduct);

    const p = this.data.find(
      (p) =>
        p.PCode == this.selectedProduct.PCode &&
        this.selectedProduct.Weight == p.Weight
    );
    if (p) {
      p.Qty = this.selectedProduct.Qty;
    }
      if (this.selectedProduct.Weight  && this.selectedProduct.Weight != '') {
        console.log(
          (this.selectedProduct.Weight / 1000) * this.selectedProduct.SPrice
        );
       this.selectedProduct.SPrice =
         (this.selectedProduct.Weight / 1000) * this.selectedProduct.SPrice;
      } else {
        console.log(this.selectedProduct.SPrice);
      }

      this.data.push({
        PCode: this.selectedProduct.PCode,
        ProductName: this.selectedProduct.ProductName,
        SPrice: this.selectedProduct.SPrice,
        Qty: this.selectedProduct.Qty,
        Weight: this.selectedProduct.Weight
          ? this.selectedProduct.Weight.padStart(4, '0')
          : '',
      });

    this.http.setItem(this.BARCODE_DATA, this.data);
    this.selectedProduct = Object.assign({Weight: '', Qty: '', PCode: '' });
    this.pcode.nativeElement.focus();
  }
  Clicked(e) {
    if (e.action === 'delete') {
      this.data = this.data.filter(
        (p) => !(p.PCode == e.data.PCode && p.Weight == e.data.Weight)
      );
      this.http.setItem(this.BARCODE_DATA, this.data);
    } else {
      if (e.action === 'edit') {
        this.selectedProduct = e.data;
      }
    }
  }

  Search() {
    const initialState: ModalOptions = {
      initialState: {
        Table: 'qrystock',
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(SearchComponent, initialState);

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'ok') {
        this.bsModalRef?.hide();
        this.selectedProduct = res.data;
        this.qty.nativeElement.focus();
      } else {
        this.pcode.nativeElement.focus();
      }
    });
  }
  Find() {
    this.http
      .getData("qrystock?filter=PCode = '" + this.selectedProduct.PCode + "'")
      .then((r: any) => {
        if (r.length > 0) {
          this.selectedProduct = r[0];
          this.qty.nativeElement.focus();
        } else {
          this.myToaster.Error('Code not fond', 'Error');
        }
      });
  }
  PrintBarcode() {
    const bcW = 42;
    const bcH = 33;
    let col = 0;
    let row = 0;

    const doc = new jsPDF('p', 'mm', 'A4');
    //doc.rect(0, 0, bcW, bcH);

    for (const item of this.data) {
      for (let i = 0; i < item.Qty; i++) {
        this.addBarCode(row * bcH, col * bcW, item, doc);
        col++;
        if (col % 5 == 0) {
          row++;
          col = 0;
          if (row % 9 == 0) {
            doc.addPage();
            row = 0;
          }
        }
      }
    }

    //doc.autoPrint({variant: 'non-conform'});
    var result = doc.output('dataurlnewwindow');
    // setTimeout(() => {
    //   result.print();
    // }, 500);

    // pdfobject.embed(result, '#elemEmb', {
    //   width: '100%',
    //   height: '300px',
    //   id: 'embeded',
    // });
    result.onafterprint= ()=>{
      result.close()
    }
  }
  addBarCode(row, col, item: any, doc): jsPDF {
    let code = item.PCode;
    if (item.Weight) {
      code = '98' + code + item.Weight;
    }

    doc.barcode(code, {
      fontSize: 35,
      textColor: '#000000',
      x: col + 21,
      y: row + 21,
      textOptions: { align: 'center' },
    });
    doc.setFontSize(8);
    if (this.Options.CompanyName) {
      doc.setFont('Helvetica', 'bold');

      doc.text(this.ShopName, col + 21, row + 3, { align: 'center' });
    }
    doc.setFont('Helvetica', '');
    if (this.Options.ProductName) {
      var splitTitle = doc.splitTextToSize(item.ProductName, 35);
      doc.text(splitTitle, col + 21, row + 6, { align: 'center' });
    }
    doc.setFontSize(8);
    doc.text(code, col + 21, row + 25, { align: 'center' });

    if (this.Options.Price) {
      doc.text('Price: ' + item.SPrice, col + 21, row + 29, {
        align: 'center',
      });
    }
    return doc;
  }

  DeleteAll() {
    if (confirm('Are you sure')) {
      this.data = [];
      this.http.setItem(this.BARCODE_DATA, this.data);
    }
  }
}
