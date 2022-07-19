import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ActionsRoutingModule } from './actions-routing.module';
import { ActionListComponent } from './action-list/action-list.component';


@NgModule({
  declarations: [
    ActionListComponent
  ],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    ActionsRoutingModule
  ]
})
export class ActionsModule { }
