import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationPaymentsCollectionsComponent } from './verification-payments-collections/verification-payments-collections.component';


@NgModule({
  declarations: [
    VerificationPaymentsCollectionsComponent
  ],
  imports: [
    CommonModule,
    VerificationRoutingModule
  ]
})
export class VerificationModule { }
