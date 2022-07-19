import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';

import { InstallationRoutingModule } from './installation-routing.module';
import { InstallationPlanningComponent } from './installation-planning/installation-planning.component';
import { ItemInstallationComponent } from './item-installation/item-installation.component';
import { ItemInstalledApprovalComponent } from './item-installed-approval/item-installed-approval.component';
import { InstallationCompletionClaimVerificationComponent } from './installation-completion-claim-verification/installation-completion-claim-verification.component';
import { InstallationCompletionClaimSelfApprovalComponent } from './installation-completion-claim-self-approval/installation-completion-claim-self-approval.component';
import { ProjectPreCompletionComponent } from './project-pre-completion/project-pre-completion.component';
import { ProjectCompletionComponent } from './project-completion/project-completion.component';
import { ProjectCompletionApprovalComponent } from './project-completion-approval/project-completion-approval.component';
import { ProjectCompletionDocumentGenerationComponent } from './project-completion-document-generation/project-completion-document-generation.component';


@NgModule({
  declarations: [
    InstallationPlanningComponent,
    ItemInstallationComponent,
    ItemInstalledApprovalComponent,
    InstallationCompletionClaimVerificationComponent,
    InstallationCompletionClaimSelfApprovalComponent,
    ProjectPreCompletionComponent,
    ProjectCompletionComponent,
    ProjectCompletionApprovalComponent,
    ProjectCompletionDocumentGenerationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    InstallationRoutingModule
  ],
  providers: [DatePipe]
})
export class InstallationModule { }
