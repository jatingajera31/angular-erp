import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SpareServiceRoutingModule } from './spare-service-routing.module';
import { SpareServiceDemandComponent } from './spare-service-demand/spare-service-demand.component';
import { SpareServiceDemandApprovalComponent } from './spare-service-demand-approval/spare-service-demand-approval.component';
import { SpareServiceDispatchComponent } from './spare-service-dispatch/spare-service-dispatch.component';
import { SpareServiceReturnReceiptComponent } from './spare-service-return-receipt/spare-service-return-receipt.component';
import { SpareServiceDemandDisapprovalComponent } from './spare-service-demand-disapproval/spare-service-demand-disapproval.component';


@NgModule({
  declarations: [
    SpareServiceDemandComponent,
    SpareServiceDemandApprovalComponent,
    SpareServiceDispatchComponent,
    SpareServiceReturnReceiptComponent,
    SpareServiceDemandDisapprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    SpareServiceRoutingModule
  ],
  providers: [DatePipe]
})
export class SpareServiceModule { }
