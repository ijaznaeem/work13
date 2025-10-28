import { Component, OnInit } from '@angular/core';
import { GetDateJSON } from '../../../factories/utilities';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drcr-noteslist',
  templateUrl: './drcr-noteslist.component.html',
  styleUrls: ['./drcr-noteslist.component.scss'],
})
export class DrCrNotesListComponent implements OnInit {
  public data: any = [];
public Type : any = '1';

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    StatusID: '0',
  };
 
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    
  }
  
 

}
