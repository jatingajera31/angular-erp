import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrapItemChallanComponent } from './scrap-item-challan/scrap-item-challan.component';
import { ScrapItemChallanApprovalComponent } from './scrap-item-challan-approval/scrap-item-challan-approval.component';
import { ScrapItemComponent } from './scrap-item/scrap-item.component';

const routes: Routes = [
  { path: 'scrap-item-challan', component: ScrapItemChallanComponent },
  { path: 'scrap-item-challan-approval', component: ScrapItemChallanApprovalComponent },
  { path: 'scrap-item', component: ScrapItemComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductScrapRoutingModule { }
