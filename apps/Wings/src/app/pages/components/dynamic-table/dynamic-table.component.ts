import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UPLOADS_URL } from '../../../config/constants';
import { FindTotal, RoundTo2 } from '../../../factories/utilities';
@Component({
  selector: 'ft-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('Settings') settings = {
    Columns: [],
    Actions: [],
    SubTable: null,
    Checkbox: false,
    CheckboxAtRight: false,
    crud: false,
    ButtonsAtRight: false,
  };
  SubTable: any;
  RowData: any = [];
  @Input('Data') Data: any = [];
  @Output() ClickAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() RowChecked: EventEmitter<any> = new EventEmitter<any>();
  @Input() Search: string = '';
  public UploadUrl = UPLOADS_URL;

  hasSubTable = false;

  constructor() {


  }

  ngOnInit() {
    if (this.settings.SubTable) {
      this.SubTable = this.settings.SubTable;
      this.hasSubTable = true;
    }
  }
  GetFldCounts() {
    return this.settings.Columns.length;
  }
  ExandRow(e, i) {
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
      return RoundTo2(FindTotal(this.Data, fld));
    }
  }
  ngOnDestroy(): void {
  }
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

  public RowCheckedEv() {
    this.RowChecked.emit(this.GetSelected());
  }
}
