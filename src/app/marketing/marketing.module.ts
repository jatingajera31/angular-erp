import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';
import { MarketingRoutingModule } from './marketing-routing.module';
import { InquiryReceiptComponent } from './inquiry-receipt/inquiry-receipt.component';
import { InquiryAssignComponent } from './inquiry-assign/inquiry-assign.component';
import { InquiryFollowupComponent } from './inquiry-followup/inquiry-followup.component';
import { DailyMarketingActivityComponent } from './daily-marketing-activity/daily-marketing-activity.component';
import { DailyMarketingReportComponent } from './daily-marketing-report/daily-marketing-report.component';


@NgModule({
  declarations: [
    InquiryReceiptComponent,
    InquiryAssignComponent,
    InquiryFollowupComponent,
    DailyMarketingActivityComponent,
    DailyMarketingReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    MarketingRoutingModule
  ]
})
export class MarketingModule { }
