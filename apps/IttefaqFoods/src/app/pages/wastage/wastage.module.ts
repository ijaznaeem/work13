import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { AddwastageComponent } from './addwastage/addwastage.component';
import { SendmessagesComponent } from './sendmessages/sendmessages.component';
import { ShopAcctsComponent } from './shop-accts/shop.accts.component';
import { ShopsComponent } from './shops/shops.component';
import { VehiclesloadComponent } from './vehiclesload/vehiclesload.component';
import { WastageComponent } from './wastage/wastage.component';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';

const routes: any = [
  { path: '', redirectTo: 'wastage', pathMatch: 'full' },
  { path: 'shops',    component: ShopsComponent,    data: { breadcrumb: 'Purchase' },  },
  { path: 'add',    component: AddwastageComponent,    data: { breadcrumb: 'Add Wastage' },  },
  { path: 'wastage',    component: WastageComponent,    data: { breadcrumb: 'Wastage' },  },
  { path: 'accts',    component: ShopAcctsComponent,    data: { breadcrumb: 'Shop Accounts' },  },
  { path: 'messages',    component: SendmessagesComponent,    data: { breadcrumb: 'Send Messages' },  },
  { path: 'vehicles',    component: VehiclesloadComponent,    data: { breadcrumb: 'Vehicles load' },  },

];

@NgModule({
  declarations: [
    ShopsComponent,
    AddwastageComponent,
    WastageComponent,
    ShopAcctsComponent,
    SendmessagesComponent,
    VehiclesloadComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class WastageModule {}
