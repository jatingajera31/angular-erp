import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';

import { RepairRoutingModule } from './repair-routing.module';
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


@NgModule({
  declarations: [
    RepairINComponent,
    ProductRepairHistoryComponent,
    InHouseRepairCheckComponent,
    InHouseRepairCheckApprovalComponent,
    RepairComponent,
    RepairedReturnedToClientComponent,
    NotRepairedReturnedToClientComponent,
    RepairOUTComponent,
    RepairDIspatchEnlistComponent,
    DispatchConfirmationComponent,
    OutsideRepairActivityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    RepairRoutingModule
  ]
})
export class RepairModule { }
