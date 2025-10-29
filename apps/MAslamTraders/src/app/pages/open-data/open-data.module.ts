import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountsModule } from "../accounts/acounts.module";

const routes:any = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AccountsModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [
  ],
  providers: [],
})
export class OpenDataModule { }
