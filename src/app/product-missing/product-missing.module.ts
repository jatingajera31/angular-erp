import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProductMissingRoutingModule } from './product-missing-routing.module';
import { ItemLostComponent } from './item-lost/item-lost.component';
import { ItemLostApprovalComponent } from './item-lost-approval/item-lost-approval.component';


@NgModule({
  declarations: [
    ItemLostComponent,
    ItemLostApprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    ProductMissingRoutingModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class ProductMissingModule { }
