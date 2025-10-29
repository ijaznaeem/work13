import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss'],
})
export class DocumentViewComponent implements OnInit {

@Input()
Document: '';
uploadPath = UPLOADS_URL
  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,
    private imageService: ImageService,
  ) {}

  ngOnInit() {

  }
  FileDownload(){
    this.imageService.download(this.uploadPath + this.Document);
  }
}
