import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ExchangeRoutingModule } from './exchange-routing.module';
import { SalesExchangeDemandComponent } from './sales-exchange-demand/sales-exchange-demand.component';
import { SalesExchangeDemandApprovalComponent } from './sales-exchange-demand-approval/sales-exchange-demand-approval.component';
import { SalesExchangeDispatchComponent } from './sales-exchange-dispatch/sales-exchange-dispatch.component';
import { SalesExchangeReturnINComponent } from './sales-exchange-return-in/sales-exchange-return-in.component';
import { SalesExchangeDemandDisapprovalComponent } from './sales-exchange-demand-disapproval/sales-exchange-demand-disapproval.component';


@NgModule({
  declarations: [
    SalesExchangeDemandComponent,
    SalesExchangeDemandApprovalComponent,
    SalesExchangeDispatchComponent,
    SalesExchangeReturnINComponent,
    SalesExchangeDemandDisapprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    ExchangeRoutingModule
  ],
  providers: [DatePipe]
})
export class ExchangeModule { }
