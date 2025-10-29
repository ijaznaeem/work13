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
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, concat, of, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { CachedDataService } from '../../../services/cacheddata.service';

@Component({
  selector: 'app-search-account',
  templateUrl: './search-account.component.html',
  styleUrls: ['./search-account.component.scss'],
})
export class SearchAccountComponent implements OnInit, AfterViewInit {
  @ViewChild('ngSelect') ngSelect!: NgSelectComponent ;
  @Input() Table = 'products';
  @Input() Term = '';
  @Input() Fields = [
    {
      fldName: 'AccountCode',
      label: 'Code',
      search: true,
      size: 2
    },
    {
      fldName: 'Category',
      label: 'Category',
      size: 2
    },
    {
      fldName: 'Description',
      label: 'Description',
      size: 2
    },
    {
      fldName: 'AccountName',
      label: 'AccountName',
      search: true,
      size: 6
    },
    
  ];

  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  data$: Observable<any> | undefined;
  isLoading = false;
  dataInput$ = new Subject<string>();
  selectedItem: any;
  minLengthTerm = 3;
  AccountCashed$ = new Observable();
  constructor(
    public bsModalRef: BsModalRef,
    private cachedData: CachedDataService
  ) {
    this.AccountCashed$ = this.cachedData.Account$;
  }

  ngOnInit() {
    this.loaData();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.ngSelect?.focus();
      this.ngSelect!.searchTerm = this.Term;
      if (this.Term.length > 2) {
        this.loaData();
      }
      console.log(this.Term);
    }, 500);
  }
  Selected(e:any) {
    this.Event.emit({ data: e, res: 'selected' });
  }

  Clicked(e:any) {
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
        debounceTime(500),
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
  term = term ? term.toLowerCase() : '';

  return this.AccountCashed$.pipe(
    map((resp: any) => {
      if (resp.Error) {
        throwError(() => new Error(resp.Error));
      } else {
        let filteredData = resp.filter((x: any) => {
          if (term && !isNaN(Number(term))) {
            return Number(x.AccountCode) >= Number(term);
          } else {
            return x.AccountName.toLowerCase().includes(term);
          }
        });

        // Sorting based on the type of term
        filteredData.sort((a: any, b: any) => {
          if (term && !isNaN(Number(term))) {
            return Number(a.AccountCode) - Number(b.AccountCode);
          } else {
            return a.AccountName.localeCompare(b.AccountName);
          }
        });
        return filteredData.slice(0, 100);;
      }
    }),
    take(100)
  );
}


  ItemSelected(e: any) {
    this.Event.emit({ data: e, res: 'ok' });
  }
}
