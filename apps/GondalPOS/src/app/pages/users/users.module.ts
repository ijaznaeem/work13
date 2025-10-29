import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';

const routes:any = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UsersListComponent, data: { breadcrumb: 'List' } },

];

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }
