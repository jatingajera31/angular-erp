import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';

import { FuelManagementRoutingModule } from './fuel-management-routing.module';
import { EntryComponent } from './entry/entry.component';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { AdminApprovalComponent } from './admin-approval/admin-approval.component';
import { FuelReportComponent } from './fuel-report/fuel-report.component';


@NgModule({
  declarations: [
    EntryComponent,
    UserApprovalComponent,
    AdminApprovalComponent,
    FuelReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    FuelManagementRoutingModule
  ]
})
export class FuelManagementModule { }
