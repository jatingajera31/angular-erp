import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DemoRoutingModule } from './demo-routing.module';
import { DemoDemandComponent } from './demo-demand/demo-demand.component';
import { DemoDemandApprovalComponent } from './demo-demand-approval/demo-demand-approval.component';
import { DemoDispatchComponent } from './demo-dispatch/demo-dispatch.component';
import { DemoReturnReceiptComponent } from './demo-return-receipt/demo-return-receipt.component';
import { DemoDemandDisapprovalComponent } from './demo-demand-disapproval/demo-demand-disapproval.component';


@NgModule({
  declarations: [
    DemoDemandComponent,
    DemoDemandApprovalComponent,
    DemoDispatchComponent,
    DemoReturnReceiptComponent,
    DemoDemandDisapprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    DemoRoutingModule
  ],
  providers: [DatePipe]
})
export class DemoModule { }
