import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PIInformationComponent } from './p-iinformation/p-iinformation.component';
import { DispatchDetailComponent } from './dispatch-detail/dispatch-detail.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseApprovalComponent } from './purchase-approval/purchase-approval.component';
import { PurchaseRateComponent } from './purchase-rate/purchase-rate.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseReturnDispatchComponent } from './purchase-return-dispatch/purchase-return-dispatch.component';
import { ImportComponent } from './import/import.component';
import { PurchaseNotificationComponent } from './purchase-notification/purchase-notification.component';
import { ReplaceDeamndComponent } from './replace-deamnd/replace-deamnd.component';
import { ReplaceDeamndApprovalComponent } from './replace-deamnd-approval/replace-deamnd-approval.component';
import { ReplaceDeamndNotificationComponent } from './replace-deamnd-notification/replace-deamnd-notification.component';
import { ReplaceReturnComponent } from './replace-return/replace-return.component';
import { ReplaceReceiptComponent } from './replace-receipt/replace-receipt.component';
import { InventoryComponent } from './inventory/inventory.component';
import { LabelPrintComponent } from './label-print/label-print.component';

const routes: Routes = [
  { path: 'purchase-order', component: PurchaseOrderComponent },
  { path: 'pi-information', component: PIInformationComponent },
  { path: 'dispatch-detail', component: DispatchDetailComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'purchase-approval', component: PurchaseApprovalComponent },
  { path: 'inventory-storebook', component: InventoryComponent },
  { path: 'label-print', component: LabelPrintComponent },
  { path: 'purchase-rate', component: PurchaseRateComponent },
  { path: 'purchase-return', component: PurchaseReturnComponent },
  { path: 'purchase-return-dispatch', component: PurchaseReturnDispatchComponent },
  { path: 'replace-demand', component: ReplaceDeamndComponent },
  { path: 'replace-demand-approval', component: ReplaceDeamndApprovalComponent },
  { path: 'replace-demand-notification', component: ReplaceDeamndNotificationComponent },
  { path: 'replace-return', component: ReplaceReturnComponent },
  { path: 'replace-receipt', component: ReplaceReceiptComponent },
  { path: 'import', component: ImportComponent },
  { path: 'purchase-notification', component: PurchaseNotificationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
