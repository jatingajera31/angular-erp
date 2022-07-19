import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';
import { DatePipe } from '@angular/common';
import { CallManagementRoutingModule } from './call-management-routing.module';
import { CallRegistrationComponent } from './call-registration/call-registration.component';
import { CallAssignComponent } from './call-assign/call-assign.component';
import { CallClosureComponent } from './call-closure/call-closure.component';
import { CallOnHoldComponent } from './call-on-hold/call-on-hold.component';
import { CallTransferComponent } from './call-transfer/call-transfer.component';
import { CallChargeCollectionComponent } from './call-charge-collection/call-charge-collection.component';
import { DayendReportingComponent } from './dayend-reporting/dayend-reporting.component';


@NgModule({
  declarations: [
    CallRegistrationComponent,
    CallAssignComponent,
    CallClosureComponent,
    CallOnHoldComponent,
    CallTransferComponent,
    CallChargeCollectionComponent,
    DayendReportingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    CallManagementRoutingModule
  ],
  providers: [DatePipe]
})
export class CallManagementModule { }
