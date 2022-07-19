import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';
import { ScNotificationRoutingModule } from './sc-notification-routing.module';
import { RegularClientComponent } from './regular-client/regular-client.component';
import { ScDeliveryComponent } from './sc-delivery/sc-delivery.component';
import { ScApprovalComponent } from './sc-approval/sc-approval.component';
import { ScGenerationComponent } from './sc-generation/sc-generation.component';
import { NonRegularClientComponent } from './non-regular-client/non-regular-client.component';


@NgModule({
  declarations: [
    RegularClientComponent,
    ScDeliveryComponent,
    ScApprovalComponent,
    ScGenerationComponent,
    NonRegularClientComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    ScNotificationRoutingModule
  ]
})
export class ScNotificationModule { }
