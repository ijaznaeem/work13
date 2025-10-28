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
import { environment } from '../../../../environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, AfterViewInit {
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

  constructor(
    private http: HttpClient,
    private http2: HttpBase,
    public bsModalRef: BsModalRef
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
    let filter = this.Fields.filter((x) => x.search == true)
      .map((x) => x.fldName)
      .join(" like '%" + term + "%' Or ");
    filter += " like '%" + term + "%' ";
    // console.log(filter);

    return this.http
      .get<any>(
        environment.INSTANCE_URL +
          'apis/' +
          this.Table +
          '?bid=' +
          this.http2.getBusinessID() +
          '&limit=10&filter=(' +
          filter +
          ')'
      )
      .pipe(
        map((resp) => {
          if (resp.Error) {
            throwError(() => new Error(resp.Error));
          } else {
            return resp;
          }
        })
      );
  }

  ItemSelected(e: any) {
    this.Event.emit({ data: e, res: 'ok' });
  }
}
