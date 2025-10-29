import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountsModule } from "../accounts/acounts.module";
import { CustomerDetailsComponent } from "./customer-details/customer-details.component";

const routes:any = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: "customers", component: CustomerDetailsComponent, data: { breadcrumb: 'Print' } },
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
    CustomerDetailsComponent
  ],
  providers: [],
})
export class OpenDataModule { }
