import { Component, OnInit } from '@angular/core';
import { AddLookupFld } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  public form = {
    title: 'Videos List',
    tableName: 'videos',
    pk: 'videoID',
    columns: [
      {
        fldName: 'title',
        control: 'input',
        type: 'text',
        label: 'Title',
        required: true,
        size: 12,
      },

      {
        fldName: 'description',
        control: 'input',
        type: 'text',
        label: 'Description',
        required: true,
        size: 12,
      },
      AddLookupFld(
        'categoryID',
        'Categories',
        'categories',
        'categoryID',
        'categoryName',
        6
      ),

      {
        fldName: 'image',
        control: 'input',
        type: 'file',
        label: 'Poster File',
        required: true,
        size: 12,
      },
      {
        fldName: 'videoFile',
        control: 'input',
        type: 'text',
        label: 'Video file url',
        required: true,
        size: 6,
      },
      {
        fldName: 'pdfFile',
        control: 'input',
        type: 'text',
        label: 'PDF file url',
        required: false,
        size: 6,
      },
      {
        fldName: 'animationFile',
        control: 'input',
        type: 'text',
        label: 'Aniamtion file url',
        required: false,
        size: 6,
      },
    ],
  };

  public list = {
    title: 'Videos List',
    tableName: 'videos',
    pk: 'videoID',
    columns: [{ fldName: 'title', label: 'Title' }],
  };

  constructor() {}

  ngOnInit() {}
}
