import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PurchaseReturnListComponent } from "./purchasereturnlist/purchasereturnlist.component";
import { NewpurchaseComponent } from "./newpurchase/newpurchase.component";
import { PurchaselistComponent } from "./purchaselist/purchaselist.component";
import { PurchaseorderComponent } from "./purchaseorder/purchaseorder.component";
import { PurchasereturnComponent } from "./purchasereturn/purchasereturn.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComboBoxAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { ModalModule } from "ngx-bootstrap/modal";

export const routes:any = [
  { path: "", redirectTo: "newpurchase", pathMatch: "full" },
  {
    path: "newpurchase",
    component: NewpurchaseComponent,
    data: { breadcrumb: "New Purchase" }
  },
  {
    path: "newpurchase/:editID",
    component: NewpurchaseComponent,
    data: { breadcrumb: "Edit Purchase" }
  },
  {
    path: "purchaselist",
    component: PurchaselistComponent,
    data: { breadcrumb: "Purchase Report" }
  },
  {
    path: "purchaseorder",
    component: PurchaseorderComponent,
    data: { breadcrumb: "Purchase Order" }
  },
  {
    path: "purchasereturn",
    component: PurchasereturnComponent,
    data: { breadcrumb: "Purchase Return" }
  },
  {
    path: "purchasereturn/:editID",
    component: PurchasereturnComponent,
    data: { breadcrumb: "Edit Purchase Return" }
  },
  {
    path: "purchasereturnlist",
    component: PurchaseReturnListComponent,
    data: { breadcrumb: "Purchase Return Report" }
  }
];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild(routes),

    NgbModule,
    ComboBoxAllModule,
    ModalModule
  ],

  declarations: [
    NewpurchaseComponent,
    PurchaseReturnListComponent,
    PurchaselistComponent,
    PurchasereturnComponent,
    PurchaseorderComponent
  ]
})
export class PurchaseModule {}
