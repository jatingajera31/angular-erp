import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';

import { BillGenerationRoutingModule } from './bill-generation-routing.module';
import { ServiceBillGenerationComponent } from './service-bill-generation/service-bill-generation.component';
import { CallChargeGenerationComponent } from './call-charge-generation/call-charge-generation.component';
import { AccountFreezingOrderComponent } from './account-freezing-order/account-freezing-order.component';
import { ZeroCallChargeComponent } from './zero-call-charge/zero-call-charge.component';


@NgModule({
  declarations: [
    ServiceBillGenerationComponent,
    CallChargeGenerationComponent,
    AccountFreezingOrderComponent,
    ZeroCallChargeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    BillGenerationRoutingModule
  ]
})
export class BillGenerationModule { }
