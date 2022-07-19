import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';

import { SalesReturnRoutingModule } from './sales-return-routing.module';
import { SalesReturnDemandComponent } from './sales-return-demand/sales-return-demand.component';
import { SalesReturnDemandApprovalComponent } from './sales-return-demand-approval/sales-return-demand-approval.component';
import { SalesReturnReceivedComponent } from './sales-return-received/sales-return-received.component';
import { SalesReturnUpdatesComponent } from './sales-return-updates/sales-return-updates.component';
import { SalesReturnDemandDisapprovalComponent } from './sales-return-demand-disapproval/sales-return-demand-disapproval.component';


@NgModule({
  declarations: [
    SalesReturnDemandComponent,
    SalesReturnDemandApprovalComponent,
    SalesReturnReceivedComponent,
    SalesReturnUpdatesComponent,
    SalesReturnDemandDisapprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SalesReturnRoutingModule
  ],
  providers: [DatePipe]
})
export class SalesReturnModule { }
