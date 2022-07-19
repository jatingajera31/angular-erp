import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationPaymentsCollectionsComponent } from './verification-payments-collections/verification-payments-collections.component';

const routes: Routes = [
  { path: 'payments-collections', component: VerificationPaymentsCollectionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationRoutingModule { }
