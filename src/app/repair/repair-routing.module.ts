import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RepairINComponent } from './repair-in/repair-in.component';
import { ProductRepairHistoryComponent } from './product-repair-history/product-repair-history.component';
import { InHouseRepairCheckComponent } from './in-house-repair-check/in-house-repair-check.component';
import { InHouseRepairCheckApprovalComponent } from './in-house-repair-check-approval/in-house-repair-check-approval.component';
import { RepairComponent } from './repair/repair.component';
import { RepairedReturnedToClientComponent } from './repaired-returned-to-client/repaired-returned-to-client.component';
import { NotRepairedReturnedToClientComponent } from './not-repaired-returned-to-client/not-repaired-returned-to-client.component';
import { RepairOUTComponent } from './repair-out/repair-out.component';
import { RepairDIspatchEnlistComponent } from './repair-dispatch-enlist/repair-dispatch-enlist.component';
import { DispatchConfirmationComponent } from './dispatch-confirmation/dispatch-confirmation.component';
import { OutsideRepairActivityComponent } from './outside-repair-activity/outside-repair-activity.component';

const routes: Routes = [
  { path: 'repair-in', component: RepairINComponent },
  { path: 'product-repair-history', component: ProductRepairHistoryComponent },
  { path: 'in-house-repair-check', component: InHouseRepairCheckComponent },
  { path: 'in-house-repair-check-approval', component: InHouseRepairCheckApprovalComponent },
  { path: 'repair', component: RepairComponent },
  { path: 'repaired-returned-to-client', component: RepairedReturnedToClientComponent },
  { path: 'not-repaired-returned-to-client', component: NotRepairedReturnedToClientComponent },
  { path: 'repair-out', component: RepairOUTComponent },
  { path: 'repair-dispatch-enlist', component: RepairDIspatchEnlistComponent },
  { path: 'dispatch-confirmation', component: DispatchConfirmationComponent },
  { path: 'outside-repair-activity', component: OutsideRepairActivityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepairRoutingModule { }
