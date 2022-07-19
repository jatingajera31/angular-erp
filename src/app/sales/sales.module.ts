import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { SalesRoutingModule } from './sales-routing.module';
import { QuotationComponent } from './quotation/quotation.component';
import { PreSalesDemandComponent } from './pre-sales-demand/pre-sales-demand.component';
import { PreSalesDemandApprovalComponent } from './pre-sales-demand-approval/pre-sales-demand-approval.component';
import { DeliveryChallanComponent } from './delivery-challan/delivery-challan.component';
import { SalesPurchasePaidComponent } from './sales-purchase-paid/sales-purchase-paid.component';
import { DeliveryChallanRecoveryComponent } from './delivery-challan-recovery/delivery-challan-recovery.component';
import { DiscountManagerComponent } from './discount-manager/discount-manager.component';
import { DiscountProjectComponent } from './discount-project/discount-project.component';
import { SalesCollectionComponent } from './sales-collection/sales-collection.component';
import { DeliveryChallanUndeliveredComponent } from './delivery-challan-undelivered/delivery-challan-undelivered.component';
import { DeliveryGatePassComponent } from './delivery-gate-pass/delivery-gate-pass.component';


@NgModule({
  declarations: [
    QuotationComponent,
    PreSalesDemandComponent,
    PreSalesDemandApprovalComponent,
    DeliveryChallanComponent,
    SalesPurchasePaidComponent,
    DeliveryChallanRecoveryComponent,
    DiscountManagerComponent,
    DiscountProjectComponent,
    SalesCollectionComponent,
    DeliveryChallanUndeliveredComponent,
    DeliveryGatePassComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    SalesRoutingModule
  ],
  providers: [DatePipe]
})
export class SalesModule { }
