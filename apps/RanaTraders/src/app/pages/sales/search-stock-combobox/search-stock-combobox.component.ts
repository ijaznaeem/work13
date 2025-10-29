import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ComboBoxComponent,
  FilteringEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { CachedDataService } from '../../../services/cacheddata.service';

@Component({
  selector: 'app-search-stock-combobox',
  templateUrl: './search-stock-combobox.component.html',
  styleUrls: ['./search-stock-combobox.component.scss'],
})
export class SearchStockComboboxComponent implements OnInit, AfterViewInit {
  @ViewChild('cmbMulti') cmbMulti: ComboBoxComponent;
  @Input() Table = 'products';
  @Input() Term = '';
  @Input() Fields = [
    {
      fldName: 'PCode',
      label: 'Barcode',
      search: true,
    },
    {
      fldName: 'ProductName',
      label: 'Product',
      search: true,
    },
    {
      fldName: 'Packing',
      label: 'Packing',
    },
    {
      fldName: 'PPrice',
      label: 'PPrice',
    },
  ];

  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  data$: Observable<any>;
  Data: any = [];
  fitered: any = [];
  isLoading = false;
  dataInput$ = new Subject<string>();
  selectedItem: any;
  minLengthTerm = 3;
  StockCashed$ = this.cachedData.Stock$;
  constructor(
    public bsModalRef: BsModalRef,
    private cachedData: CachedDataService
  ) {}

  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cmbMulti.focusIn();
    }, 500);

    // this.cmbMulti.showPopup();
  }
  Selected(e) {
    if (e.item) this.Event.emit({ data: e.itemData, command: 'OK' });
  }

  trackByFn(item: any) {
    return item.ProductID;
  }

  loadData() {
    this.StockCashed$.subscribe((d) => {
      this.Data = d;
    });
  }

  ItemSelected(e: any) {
    this.Event.emit({ data: e.itemData, command: 'OK' });
  }
  public onFiltering = async (e: FilteringEventArgs) => {
    let filtered;
    const filterText = e.text ? e.text.trim() : '';

    // If the filter text is empty or null, return the entire dataset
    if (!filterText) {
      e.updateData(this.Data);
      return;
    }

    const isNumeric = !isNaN(Number(filterText));
    const filterValue:any = isNumeric ? Number(filterText) : filterText.toLowerCase();

    // Filter the data based on numeric or text input
    filtered = await this.Data.filter((x) => {
      if (isNumeric) {
        return Number(x.PCode) >= filterValue;
      } else {
        return x.ProductName.toLowerCase().startsWith(filterValue);
      }
    });


    // Only sort if filtering by numeric PCode
    if (isNumeric && filtered.length > 0) {
      filtered.sort((a, b) => Number(a.PCode) - Number(b.PCode));
    }

    // Update the dropdown with filtered data
    e.updateData(filtered);
  };

  OnClose() {
    this.Event.emit({ data: null, command: 'Cancell' });
    this.bsModalRef.hide();
  }
}
