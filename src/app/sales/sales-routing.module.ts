import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: 'quotation', component: QuotationComponent },
  { path: 'pre-sales-demand', component: PreSalesDemandComponent },
  { path: 'pre-sales-demand-approval', component: PreSalesDemandApprovalComponent },
  { path: 'delivery-challan', component: DeliveryChallanComponent },
  { path: 'delivery-get-pass', component: DeliveryGatePassComponent },
  { path: 'sales-purchase-paid', component: SalesPurchasePaidComponent },
  { path: 'delivery-challan-recovery', component: DeliveryChallanRecoveryComponent },
  { path: 'discount-manager', component: DiscountManagerComponent },
  { path: 'discount-project', component: DiscountProjectComponent },
  { path: 'sales-collection', component: SalesCollectionComponent },
  { path: 'delivery-challan-undelivered', component: DeliveryChallanUndeliveredComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
