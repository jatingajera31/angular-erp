import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VehicleDrivingPermissionComponent } from './vehicle-driving-permission/vehicle-driving-permission.component';
import { VehicleReturnComponent } from './vehicle-return/vehicle-return.component';

const routes: Routes = [
  { path: 'vehicle-driving-permission', component: VehicleDrivingPermissionComponent },
  { path: 'vehicle-return', component: VehicleReturnComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
