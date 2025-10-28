import { Component, OnInit, ViewChild } from '@angular/core';
import { JSON2Date, GetDateJSON, getDMYDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';
import { GridComponent } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: "app-grid-test",
  templateUrl: "./grid-test.component.html",
  styleUrls: ["./grid-test.component.scss"],
})
export class GridTestComponent implements OnInit {
  @ViewChild('grid', { static: true }) public grid: GridComponent;

  public data: object[];
  
  toolbarItems: string[] = ['Add'];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData("balancesheet").then((r: any) => {
      this.data = r;
    });
  }
  addNewRow() {
    this.grid.addRecord({}); // Add a new empty row
  }
  toolbarClick(args: any): void {
    if (args.item.id === 'grid_add') {
      this.addNewRow(); // Call the method to add a new row
    }
  }
}
