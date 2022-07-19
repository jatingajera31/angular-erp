import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SampleRoutingModule } from './sample-routing.module';
import { SampleRequestDemandComponent } from './sample-request-demand/sample-request-demand.component';
import { SampleRequestDemandApprovalComponent } from './sample-request-demand-approval/sample-request-demand-approval.component';
import { SampleDispatchComponent } from './sample-dispatch/sample-dispatch.component';
import { SampleReturnReceiptComponent } from './sample-return-receipt/sample-return-receipt.component';
import { SampleRequestDemandDisapprovalComponent } from './sample-request-demand-disapproval/sample-request-demand-disapproval.component';


@NgModule({
  declarations: [
    SampleRequestDemandComponent,
    SampleRequestDemandApprovalComponent,
    SampleDispatchComponent,
    SampleReturnReceiptComponent,
    SampleRequestDemandDisapprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    SampleRoutingModule
  ],
  providers: [DatePipe]
})
export class SampleModule { }
