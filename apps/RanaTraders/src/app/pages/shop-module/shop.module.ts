import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CartService } from '../../services/cart.service';
import { PipeModule } from '../../shared/pipes/pipe.module';
import { ShopComponent } from './shop/shop.component';

const routes: any = [
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  { path: 'shop', component: ShopComponent, data: { breadcrumb: 'Shop' } },
];

@NgModule({
declarations: [
  ShopComponent
  ],
  imports: [CommonModule,
    FormsModule,
     NgxDatatableModule,
    PipeModule,
    RouterModule.forChild(routes)],
  exports: [],

  providers: [
    CartService
  ],
})
export class ShopModule {}
