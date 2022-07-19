import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesExchangeDemandComponent } from './sales-exchange-demand/sales-exchange-demand.component';
import { SalesExchangeDemandApprovalComponent } from './sales-exchange-demand-approval/sales-exchange-demand-approval.component';
import { SalesExchangeDispatchComponent } from './sales-exchange-dispatch/sales-exchange-dispatch.component';
import { SalesExchangeReturnINComponent } from './sales-exchange-return-in/sales-exchange-return-in.component';
import { SalesExchangeDemandDisapprovalComponent } from './sales-exchange-demand-disapproval/sales-exchange-demand-disapproval.component';

const routes: Routes = [
  { path: 'demand', component: SalesExchangeDemandComponent },
  { path: 'demand-approval', component: SalesExchangeDemandApprovalComponent },
  { path: 'dispatch', component: SalesExchangeDispatchComponent },
  { path: 'return-in', component: SalesExchangeReturnINComponent },
  { path: 'demand-disapproval', component: SalesExchangeDemandDisapprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule { }
