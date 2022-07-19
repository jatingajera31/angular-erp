import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoDemandComponent } from './demo-demand/demo-demand.component';
import { DemoDemandApprovalComponent } from './demo-demand-approval/demo-demand-approval.component';
import { DemoDispatchComponent } from './demo-dispatch/demo-dispatch.component';
import { DemoReturnReceiptComponent } from './demo-return-receipt/demo-return-receipt.component';
import { DemoDemandDisapprovalComponent } from './demo-demand-disapproval/demo-demand-disapproval.component';

const routes: Routes = [
  { path: 'demand', component: DemoDemandComponent },
  { path: 'demand-approval', component: DemoDemandApprovalComponent },
  { path: 'dispatch', component: DemoDispatchComponent },
  { path: 'return-receipt', component: DemoReturnReceiptComponent },
  { path: 'demand-disapproval', component: DemoDemandDisapprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
