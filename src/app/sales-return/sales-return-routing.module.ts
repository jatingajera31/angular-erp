import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReturnDemandComponent } from './sales-return-demand/sales-return-demand.component';
import { SalesReturnDemandApprovalComponent } from './sales-return-demand-approval/sales-return-demand-approval.component';
import { SalesReturnReceivedComponent } from './sales-return-received/sales-return-received.component';
import { SalesReturnUpdatesComponent } from './sales-return-updates/sales-return-updates.component';
import { SalesReturnDemandDisapprovalComponent } from './sales-return-demand-disapproval/sales-return-demand-disapproval.component';

const routes: Routes = [
  { path: 'demand', component: SalesReturnDemandComponent },
  { path: 'demand-approval', component: SalesReturnDemandApprovalComponent },
  { path: 'received', component: SalesReturnReceivedComponent },
  { path: 'updates', component: SalesReturnUpdatesComponent },
  { path: 'demand-disapproval', component: SalesReturnDemandDisapprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReturnRoutingModule { }
