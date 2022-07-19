import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AccountInfoComponent } from './account-info/account-info.component';

const routes: Routes = [
  { path: 'view', component: AccountComponent },
  { path: 'info', component: AccountInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
