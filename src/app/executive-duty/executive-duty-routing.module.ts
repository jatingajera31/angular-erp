import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DutyComponent } from './duty/duty.component';

const routes: Routes = [
  { path: 'duty-assignment', component: DutyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveDutyRoutingModule { }
