import { formatNumber } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FindTotal,
  GroupBy,
} from '../../utilities/utilities';

@Component({
  selector: 'ft-table-with-group',
  templateUrl: './table-with-group.component.html',
  styleUrls: ['./table-with-group.component.scss'],
})
export class TableWithGroupComponent implements OnInit,  OnChanges {

  @Input('Settings') settings = {
    Columns: [],
    Actions: [],
    GroupBy: '',
  };

  @Input() Data: any = [];
  @Input() OnlyGroups= false;
  @Output() ClickAction: EventEmitter<any> = new EventEmitter<any>();
  public Groups: any = [];

  public GroupedData: any = [];

  constructor() {}

  ngOnInit() {
  }
  GetFldCounts() {
    return this.settings.Columns.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.Data) {
      this.GroupedData = GroupBy(this.Data, this.settings.GroupBy);
      console.log(this.GroupedData);
      this.Groups = Object.keys(this.GroupedData);
    }
  }

  ClickActionEv(r, a) {
    console.log('data', r);

    this.ClickAction.emit({ data: r, action: a });
    return false;
  }
  FindTotal(fld) {
    if (this.Data) {
      return formatNumber( (FindTotal(this.Data, fld)),'en', '1.2-2');
    }
  }
  FindGroupTotal(fld, grp) {
    if (this.GroupedData) {
      return formatNumber(FindTotal(this.GroupedData[grp], fld),'en', '1.2-2');
    }
  }


  formattedValue(row: any, col: any, data) {
      if (col.valueFormatter) return col.valueFormatter(row);
      else if (col.type == 'number' || col.sum) {
        return formatNumber(data, 'en', '1.2-2');
      } else return data;
    }
}
