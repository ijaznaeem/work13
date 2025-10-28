import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import {
  ComboBoxComponent,
  FilteringEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import { ValueAccessorBase } from './value-accessor';

@Component({
  selector: 'app-multi-col-combobox',
  templateUrl: './multi-col-combobox.component.html',
  styleUrls: ['./multi-col-combobox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiColComboboxComponent),
      multi: true,
    },
  ],
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

  constructor(private injector: Injector) {
    super(injector);
  }

  setDisabledState?(isDisabled: boolean) {}
  public onFiltering = (e: FilteringEventArgs) => {
    if (!this.Data || !Array.isArray(this.Data)) {
      console.error('Data source is not valid.');
      e.updateData([]);
      return;
    }

    if (e.text === '') {
      e.updateData(this.Data);
    } else {
      const filtered = this.Data.filter((item: any) => {
        return this.Cols.some((col) => {
          const fieldValue = item[col.fldName];
          return (
            col.fldName &&
            fieldValue &&
            fieldValue.toString().toUpperCase().includes(e.text.toUpperCase())
          );
        });
      });

      e.updateData(filtered);
    }
  };
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
