import { Component, OnInit, Input, Output, EventEmitter, forwardRef, Injector, ViewChild } from '@angular/core';
import { FilteringEventArgs, ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { ValueAccessorBase } from './value-accessor';

@Component({
  selector: 'app-multi-col-combobox',
  templateUrl: './multi-col-combobox.component.html',
  styleUrls: ['./multi-col-combobox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiColComboboxComponent),
    multi: true
  }]
})

export class MultiColComboboxComponent extends ValueAccessorBase<string> {
  @ViewChild(NgModel) model: NgModel;
  @ViewChild('cmbMulti')
  public cmbMulti: ComboBoxComponent;
  // tslint:disable-next-line:no-input-rename
  @Input('dataSource') public Data = [];
  @Input() public fields: any;
  // @Input() public value: any;
  @Input() public Cols: ColSettings[] = [];
  @Output() Change: EventEmitter<any> = new EventEmitter<any>();


  public isDisabled = false;
  ngModelChange: any;

  constructor(
    private injector: Injector
  ) {
    super(injector);
  }

  setDisabledState?(isDisabled: boolean) {

  }
  public onFiltering = (e: FilteringEventArgs) => {
    let filtered;
    if (e.text === '') {
      e.updateData(this.Data);
      this.Data = [...this.Data];
    } else {
      let query = new Query();
      // frame the query based on search string with filter type.
      query =
        e.text !== ''
          ? query.search(e.text)
          : query;
      filtered = this.Data.filter((x:string[]) => {
        let idx = -1;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.Cols.length; i++) {
          idx = x[this.Cols[i].fldName].toUpperCase().indexOf(e.text.toUpperCase());
          if (idx >= 0) {

            return true;
          }
        }

        return idx >= 0;
      });
      console.log(filtered);
      // pass the filter data source, filter query to updateData method.
      e.updateData(filtered);
    }
  }
  public get text() {
    return this.cmbMulti.text;
  }
  public set test(v) {
    this.cmbMulti.text = v;
  }
  Selected(event) {
    this.Change.emit(event);

  }
  public focusIn() {
    this.cmbMulti.focusIn();
  }
}
export class ColSettings {
  title: string;
  fldName: string;
  size: number;
}
