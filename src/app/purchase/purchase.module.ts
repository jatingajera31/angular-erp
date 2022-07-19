import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PurchaseRoutingModule } from './purchase-routing.module';
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
import { QRCodeModule } from 'angularx-qrcode';
import { LabelPrintComponent } from './label-print/label-print.component';

@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PIInformationComponent,
    DispatchDetailComponent,
    PurchaseComponent,
    PurchaseApprovalComponent,
    PurchaseRateComponent,
    PurchaseReturnComponent,
    PurchaseReturnDispatchComponent,
    ImportComponent,
    PurchaseNotificationComponent,
    ReplaceDeamndComponent,
    ReplaceDeamndApprovalComponent,
    ReplaceDeamndNotificationComponent,
    ReplaceReturnComponent,
    ReplaceReceiptComponent,
    InventoryComponent,
    LabelPrintComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    QRCodeModule,
    PurchaseRoutingModule
  ],
  providers: [DatePipe]
})
export class PurchaseModule { }
