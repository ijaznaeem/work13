import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PDFViewComponent implements OnInit {

@Input()
Document: '';
pdfSrc = "http://localhost:4200/apis/uploads/2.pdf";
uploadPath = UPLOADS_URL
  constructor(
    private http: HttpBase,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {

  }

}
