import { AfterContentInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: "app-transfer-details",
  templateUrl: "./transfer-details.component.html",
  styleUrls: ["./transfer-details.component.scss"],
})
export class TransferDetailsComponent implements AfterContentInit {
@Input() Transfer:any = {}

  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ToStoreID: "",
  };
  setting = {
    crud: true,
    Columns: [
      {
        label: "Barcode",
        fldName: "PCode",
      },
      {
        label: "Product Name",
        fldName: "ProductName",
      },
      {
        label: "Quantity",
        fldName: "Qty",
      },

    ],
    Actions: [

    ],
    Data: [],
  };

  constructor(
    private http: HttpBase,
    private bsModalRef: BsModalRef,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngAfterContentInit(): void {
    console.log(this.Transfer);

    this.http.getData('qrytransferdetails?nobid=1&filter=TransferID='+ this.Transfer.TransferID).then((res: any) => {
      this.data = res
    });

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-details");
    this.ps.PrintData.Title = "Transfer Details";
    this.ps.PrintData.SubTitle =
      "Gate Pass No: " + this.Transfer.GPNo;

    this.bsModalRef.hide();
    this.router.navigateByUrl("/print/print-html");
  }


}
