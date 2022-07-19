import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleRequestDemandComponent } from './sample-request-demand/sample-request-demand.component';
import { SampleRequestDemandApprovalComponent } from './sample-request-demand-approval/sample-request-demand-approval.component';
import { SampleDispatchComponent } from './sample-dispatch/sample-dispatch.component';
import { SampleReturnReceiptComponent } from './sample-return-receipt/sample-return-receipt.component';
import { SampleRequestDemandDisapprovalComponent } from './sample-request-demand-disapproval/sample-request-demand-disapproval.component';

const routes: Routes = [
  { path: 'request-demand', component: SampleRequestDemandComponent },
  { path: 'request-demand-approval', component: SampleRequestDemandApprovalComponent },
  { path: 'dispatch', component: SampleDispatchComponent },
  { path: 'return-receipt', component: SampleReturnReceiptComponent },
  { path: 'request-demand-disapproval', component: SampleRequestDemandDisapprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRoutingModule { }
