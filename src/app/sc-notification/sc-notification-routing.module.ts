import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegularClientComponent } from './regular-client/regular-client.component';
import { ScDeliveryComponent } from './sc-delivery/sc-delivery.component';
import { ScApprovalComponent } from './sc-approval/sc-approval.component';
import { ScGenerationComponent } from './sc-generation/sc-generation.component';
import { NonRegularClientComponent } from './non-regular-client/non-regular-client.component';

const routes: Routes = [
  { path: 'regular-client', component: RegularClientComponent },
  { path: 'sc-delivery', component: ScDeliveryComponent },
  { path: 'sc-approval', component: ScApprovalComponent },
  { path: 'sc-generation', component: ScGenerationComponent },
  { path: 'non-regular-client', component: NonRegularClientComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScNotificationRoutingModule { }
