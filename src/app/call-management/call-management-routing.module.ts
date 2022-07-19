import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallRegistrationComponent } from './call-registration/call-registration.component';
import { CallAssignComponent } from './call-assign/call-assign.component';
import { CallClosureComponent } from './call-closure/call-closure.component';
import { CallOnHoldComponent } from './call-on-hold/call-on-hold.component';
import { CallTransferComponent } from './call-transfer/call-transfer.component';
import { CallChargeCollectionComponent } from './call-charge-collection/call-charge-collection.component';
import { DayendReportingComponent } from './dayend-reporting/dayend-reporting.component';

const routes: Routes = [
  { path: 'call-registration', component: CallRegistrationComponent },
  { path: 'call-assign', component: CallAssignComponent },
  { path: 'call-closure', component: CallClosureComponent },
  { path: 'call-on-hold', component: CallOnHoldComponent },
  { path: 'call-transfer', component: CallTransferComponent },
  { path: 'call-charge-collection', component: CallChargeCollectionComponent },
  { path: 'dayend-reporting', component: DayendReportingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallManagementRoutingModule { }
