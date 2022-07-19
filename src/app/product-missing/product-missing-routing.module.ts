import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemLostComponent } from './item-lost/item-lost.component';
import { ItemLostApprovalComponent } from './item-lost-approval/item-lost-approval.component';

const routes: Routes = [
  { path: 'item-lost', component: ItemLostComponent },
  { path: 'item-lost-approval', component: ItemLostApprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMissingRoutingModule { }
