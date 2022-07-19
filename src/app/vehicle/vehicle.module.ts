import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleDrivingPermissionComponent } from './vehicle-driving-permission/vehicle-driving-permission.component';
import { VehicleReturnComponent } from './vehicle-return/vehicle-return.component';


@NgModule({
  declarations: [
    VehicleDrivingPermissionComponent,
    VehicleReturnComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    VehicleRoutingModule
  ]
})
export class VehicleModule { }
