import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { ROUTES } from '../../../shared/vertical-menu/vertical-menu-routes.config';



@Component({
  selector: 'app-grouprights',
  templateUrl: './grouprights.component.html',
  styleUrls: ['./grouprights.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupRightsComponent implements OnInit {
  @ViewChild('cmbGrp') cmbGrp;
  menuItems: MenuItem[] = [];
  group_id: '';
  groups: any = [];
  constructor(private http: HttpBase, private myToaster: MyToastService) {}

  ngOnInit() {
    
  }
 

  
  
}
