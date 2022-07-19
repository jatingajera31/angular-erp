import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { ProductScrapRoutingModule } from './product-scrap-routing.module';
import { ScrapItemChallanComponent } from './scrap-item-challan/scrap-item-challan.component';
import { ScrapItemChallanApprovalComponent } from './scrap-item-challan-approval/scrap-item-challan-approval.component';
import { ScrapItemComponent } from './scrap-item/scrap-item.component';


@NgModule({
  declarations: [
    ScrapItemChallanComponent,
    ScrapItemChallanApprovalComponent,
    ScrapItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    ProductScrapRoutingModule
  ],
  providers: [DatePipe]
})
export class ProductScrapModule { }
