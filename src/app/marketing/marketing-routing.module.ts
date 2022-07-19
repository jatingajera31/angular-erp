import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InquiryReceiptComponent } from './inquiry-receipt/inquiry-receipt.component';
import { InquiryAssignComponent } from './inquiry-assign/inquiry-assign.component';
import { InquiryFollowupComponent } from './inquiry-followup/inquiry-followup.component';
import { DailyMarketingActivityComponent } from './daily-marketing-activity/daily-marketing-activity.component';
import { DailyMarketingReportComponent } from './daily-marketing-report/daily-marketing-report.component';

const routes: Routes = [
  { path: 'inquiry-receipt', component: InquiryReceiptComponent },
  { path: 'inquiry-assign', component: InquiryAssignComponent },
  { path: 'inquiry-followup', component: InquiryFollowupComponent },
  { path: 'daily-marketing-activity', component: DailyMarketingActivityComponent },
  { path: 'daily-marketing-report', component: DailyMarketingReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
