import { formatNumber } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FindTotal, GroupBy } from '../../utilities/utilities';

@Component({
  selector: 'ft-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input('Settings') settings = {
    Columns: [],
    Actions: [],
    SubTable: null,
    Checkbox: false,
    crud: false,
    ButtonsAtRight: false,
  };
  SubTable: any;
  RowData: any = [];
  // tslint:disable-next-line:no-input-rename
  @Input('Data') Data: any = [];
  @Output() ClickAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() RowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() Search: string = '';
  @Input() Groupby: string = '';
  public GroupedData: any = [];
  hasSubTable = false;

  constructor() {}

  ngOnInit() {
    // this.dtTrigger.next();
    if (this.settings.SubTable) {
      this.SubTable = this.settings.SubTable;
      this.hasSubTable = true;
    }
    console.log('Settings is:');
    console.log(this.settings);
  }
  GetFldCounts() {
    return this.settings.Columns.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.Groupby == '') {
      this.GroupedData.push({ group: '', Data: this.Data });
    } else {
      this.GroupedData = GroupBy(this.Data, this.Groupby);
    }
  }
  ExandRow(e, i) {
    this.RowClicked.emit({ data: this.Data[i], index: i });

    const icon: any = document.getElementById('icon' + i);
    const el: any = document.getElementById('rsub' + i);

    if (this.Data[i].expanded) {
      el.style.visibility = 'hidden';
      icon.classList.remove('fa-minus');
      icon.classList.add('fa-plus');
      this.Data[i].expanded = false;
    } else {
      if (el) {
        el.style.visibility = 'visible';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
        this.Data[i].expanded = true;
      }
    }
  }

  ClickActionEv(r, a) {
    console.log('data', r);

    this.ClickAction.emit({ data: r, action: a });
    return false;
  }
  FindTotal(fld) {
    if (this.Data) {
      return formatNumber(FindTotal(this.Data, fld), 'en', '1.2-2');
    }
  }
  ngOnDestroy(): void {}
  checkAllCheckBox(ev) {
    this.Data.forEach((x) => (x.checked = ev.target.checked));
  }
  isAllCheckBoxChecked() {
    return this.Data ? this.Data.every((p) => p.checked) : false;
  }
  public GetSelected() {
    const data = this.Data.filter((p) => p.checked);
    // console.log(data);
    return data;
  }
  formattedValue(row: any, col: any, data) {
    if (col.valueFormatter) return col.valueFormatter(row);
    else if (col.type == 'number' || col.sum) {
      return formatNumber(data, 'en', '1.2-2');
    } else return data;
  }
}
