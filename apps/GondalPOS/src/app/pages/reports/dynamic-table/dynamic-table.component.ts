import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FindTotal, RoundTo2 } from '../../../factories/utilities';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})

export class DynamicTableComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input() Settings = {
    Columns: [],
    Actions: [],
    SubTable: null,
  };
  SubTable: any;
  RowData: any = [];
  // tslint:disable-next-line:no-input-rename
  @Input() Data: any = [];
  @Input() ShowSearch = false;
  @Output() ClickAction: EventEmitter<any> = new EventEmitter<any>();

  hasSubTable = false;

  constructor() { }

  ngOnInit() {
    // this.dtTrigger.next();
    if (this.Settings.SubTable) {
      this.SubTable = this.Settings.SubTable;
      this.hasSubTable = true;
    }
  }
  GetFldCounts() {
    return this.Settings.Columns.length;
  }
  ExandRow(e, i) {
    const icon = document.getElementById('icon' + i);
    const el = document.getElementById('rsub' + i);
    if (this.Data[i].expanded) {
      el.style.visibility = 'hidden';
      icon.classList.remove('fa-minus');
      icon.classList.add('fa-plus');
      this.Data[i].expanded = false;
    } else {
      el.style.visibility = 'visible';
      icon.classList.remove('fa-plus');
      icon.classList.add('fa-minus');
      this.Data[i].expanded = true;
    }

  }

  ClickActionEv(r, a) {
    console.log(a);

    this.ClickAction.emit({ data: r, action: a });
    return false;
  }
  FindTotal(fld) {
    if (this.Data) {
      return RoundTo2(FindTotal(this.Data, fld));
    }

  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }
}
