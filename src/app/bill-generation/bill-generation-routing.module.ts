import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceBillGenerationComponent } from './service-bill-generation/service-bill-generation.component';
import { CallChargeGenerationComponent } from './call-charge-generation/call-charge-generation.component';
import { AccountFreezingOrderComponent } from './account-freezing-order/account-freezing-order.component';
import { ZeroCallChargeComponent } from './zero-call-charge/zero-call-charge.component';

const routes: Routes = [
  { path: 'service-bill-generatio', component: ServiceBillGenerationComponent },
  { path: 'call-charge-generation', component: CallChargeGenerationComponent },
  { path: 'account-freezing-order', component: AccountFreezingOrderComponent },
  { path: 'zero-call-charge', component: ZeroCallChargeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillGenerationRoutingModule { }
