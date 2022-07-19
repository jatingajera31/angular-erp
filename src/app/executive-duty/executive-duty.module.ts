import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ExecutiveDutyRoutingModule } from './executive-duty-routing.module';
import { DutyComponent } from './duty/duty.component';


@NgModule({
  declarations: [
    DutyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    ExecutiveDutyRoutingModule
  ]
})
export class ExecutiveDutyModule { }
