import { DecimalPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { CountryService } from './country.service';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'ft-datatable',
  templateUrl: './ft-data-table.component.html',
  styleUrls: ['./ft-data-table.component.css'],
  providers: [CountryService, DecimalPipe],
})
export class FtDataTableComponent implements OnInit {
  @ViewChild(DataTableDirective)
  private dtElement: DataTableDirective;

  @Input() Settings: any = {
    columns: [],
    actions: [],

    crud: false,

    sort: null || [],
  };
  @Input() Filter: any = '1=1';
  @Input() CRUD: boolean = false;
  @Input() ScrollX: boolean = true;
  @Input() Side: 'right' | 'left' = 'right';
  @Output() ClickAction: EventEmitter<any> = new EventEmitter<any>();
  public UploadUrl = UPLOADS_URL;
  dtOptions: any = {};
  data: any = [];
  columns: any = [];
  // We use this trigger because fetching the Settings of data can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject<void>();
  selectedRow: any = null;

  constructor(private http: HttpBase) {}
  ngOnInit(): void {
    this.columns = this.Settings.columns;
    let act = this.columns.filter((x) => {
      return x.title == 'Action';
    });

    if (act.length == 0) {
      this.columns.push({
        title: 'Action',
        isAction: true,
        orderable: false,
      });
    }
    console.log(this.columns);

    this.CreateTable();
  }

  ReCreate() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.CreateTable();
      this.dtTrigger.next();
    });
  }
  CreateTable() {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      scrollX: this.ScrollX,
      columns: this.columns,

      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.filter = this.Filter;
        that.http
          .DataTable(this.Settings.tableName, dataTablesParameters)
          .then((resp: DataTablesResponse) => {
            that.data = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
    if (this.Settings.sort) {
      this.dtOptions.order = [this.Settings.sort];
    }
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  realoadTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      // Destroy the table first
      dtInstance.ajax.reload();
      this.clearRowSelection();
    });
  }
  SortByColumn(col, dir = 'asc'): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.order([col, dir]).draw();
    });
  }
  public selectRow(row: any): void {
    this.selectedRow = this.rowSelected(row) ? null : row;
  }
  public rowSelected(row: any): boolean {
    if (this.selectedRow) {
      return this.selectedRow[this.Settings.pk] === row[this.Settings.pk];
    }
    return false;
  }

  public clearRowSelection(): void {
    this.selectedRow = null;
  }
  ClickActionEv(r, a) {
    this.ClickAction.emit({ data: r, action: a });
    return false;
  }
  FilterTable(sFilter): void {
    this.Filter = sFilter;
    this.realoadTable();
  }
}
