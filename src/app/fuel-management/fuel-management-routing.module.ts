import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { AdminApprovalComponent } from './admin-approval/admin-approval.component';
import { FuelReportComponent } from './fuel-report/fuel-report.component';

const routes: Routes = [
  { path: 'entry', component: EntryComponent },
  { path: 'user-approval', component: UserApprovalComponent },
  { path: 'admin-approval', component: AdminApprovalComponent },
  { path: 'fuel-report', component: FuelReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelManagementRoutingModule { }
