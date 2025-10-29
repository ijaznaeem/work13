import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {Observable} from 'rxjs';
import {CountryService} from './country.service';
import {Country} from './country';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';


@Component({
  selector: 'app-dynamic-tables',
  templateUrl: './dynamic-tables.component.html',
  styleUrls: ['./dynamic-tables.component.scss'],
  providers: [CountryService, DecimalPipe]
})

export class DynamicTablesComponent {

  countries$: Observable<Country[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: CountryService) {
    this.countries$ = service.countries$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
