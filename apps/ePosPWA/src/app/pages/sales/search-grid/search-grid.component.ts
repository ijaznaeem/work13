import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-search-grid',
  templateUrl: './search-grid.component.html',
})
export class SearchGridComponent implements OnInit {
  @Input() Table = '';
  @Input() Term = '';
  @Input() Fields = [];
  @Input() OrderBy = '';
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpBase) {}
  ngOnInit(): void {}
  ItemSelected(e: any) {
    this.Event.emit({ data: e.data, res: 'ok' });
  }
}
