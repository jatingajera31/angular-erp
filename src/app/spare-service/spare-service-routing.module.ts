import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpareServiceDemandComponent } from './spare-service-demand/spare-service-demand.component';
import { SpareServiceDemandApprovalComponent } from './spare-service-demand-approval/spare-service-demand-approval.component';
import { SpareServiceDispatchComponent } from './spare-service-dispatch/spare-service-dispatch.component';
import { SpareServiceReturnReceiptComponent } from './spare-service-return-receipt/spare-service-return-receipt.component';
import { SpareServiceDemandDisapprovalComponent } from './spare-service-demand-disapproval/spare-service-demand-disapproval.component';

const routes: Routes = [
  { path: 'demand', component: SpareServiceDemandComponent },
  { path: 'demand-approval', component: SpareServiceDemandApprovalComponent },
  { path: 'dispatch', component: SpareServiceDispatchComponent },
  { path: 'return-receipt', component: SpareServiceReturnReceiptComponent },
  { path: 'demand-disapproval', component: SpareServiceDemandDisapprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpareServiceRoutingModule { }
