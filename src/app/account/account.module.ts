import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AccountComponent,
    AccountInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    AccountRoutingModule
  ],
  providers: [DatePipe]
})
export class AccountModule { }
