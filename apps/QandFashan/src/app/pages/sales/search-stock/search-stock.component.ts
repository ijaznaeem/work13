import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  map,
  filter,
} from 'rxjs/operators';
import { HttpBase } from '../../../services/httpbase.service';
import { CachedDataService } from '../../../services/cacheddata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search-stock',
  templateUrl: './search-stock.component.html',
  styleUrls: ['./search-stock.component.scss'],
})
export class SearchStockComponent implements OnInit, AfterViewInit {
  @ViewChild('ngSelect') ngSelect: NgSelectComponent;
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
      fldName: 'SPrice',
      label: 'Price',
    },
  ];

  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  data$: Observable<any>;
  isLoading = false;
  dataInput$ = new Subject<string>();
  selectedItem: any;
  minLengthTerm = 3;
  StockCashed$ = this.cachedData.Stock$;
  constructor(
    private http: HttpClient,
    private http2: HttpBase,
    public bsModalRef: BsModalRef,
    private cachedData: CachedDataService
  ) {}

  ngOnInit() {
    this.loaData();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.ngSelect.focus();
      this.ngSelect.searchTerm = this.Term;
      if (this.Term.length > 2) {
        this.loaData();
      }
      console.log(this.Term);
    }, 500);
  }
  Selected(e) {
    this.Event.emit({ data: e, res: 'selected' });
  }

  Clicked(e) {
    console.log(e);

    if (e.action == 'ok') {
      this.Event.emit({ data: e.data, res: 'ok' });
    }
  }

  trackByFn(item: any) {
    return item.ProductID;
  }

  loaData() {
    this.data$ = concat(
      of([]), // default items
      this.dataInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => (this.isLoading = true)),
        switchMap((term) => {
          return this.getData(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.isLoading = false))
          );
        })
      )
    );
  }

  getData(term: string | null = null): Observable<any> {
    term = term!.toLowerCase();
    return this.StockCashed$.pipe(
      map((resp: any) => {
        if (resp.Error) {
          throwError(resp.Error);
        } else {
          let r = resp.filter(
            (x) =>
              x.PCode.toLowerCase().indexOf(term) >= 0 ||
              x.ProductName.toLowerCase().indexOf(term) >= 0
          );
          return r;
        }
      })
    );
  }

  ItemSelected(e: any) {
    this.Event.emit({ data: e, res: 'ok' });
  }
}
