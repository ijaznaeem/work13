import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AccountDetailsComponent } from './account-details/account-details.component';

const routes: Routes = [
  { path: 'accounts-details', component: AccountDetailsComponent },
  { path: '', redirectTo: 'accounts-details', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AccountDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    Ng2SmartTableModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountListModule { }