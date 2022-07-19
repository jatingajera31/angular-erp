import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstallationPlanningComponent } from './installation-planning/installation-planning.component';
import { ItemInstallationComponent } from './item-installation/item-installation.component';
import { ItemInstalledApprovalComponent } from './item-installed-approval/item-installed-approval.component';
import { InstallationCompletionClaimVerificationComponent } from './installation-completion-claim-verification/installation-completion-claim-verification.component';
import { InstallationCompletionClaimSelfApprovalComponent } from './installation-completion-claim-self-approval/installation-completion-claim-self-approval.component';
import { ProjectPreCompletionComponent } from './project-pre-completion/project-pre-completion.component';
import { ProjectCompletionComponent } from './project-completion/project-completion.component';
import { ProjectCompletionApprovalComponent } from './project-completion-approval/project-completion-approval.component';
import { ProjectCompletionDocumentGenerationComponent } from './project-completion-document-generation/project-completion-document-generation.component';

const routes: Routes = [
  { path: 'installation-planning', component: InstallationPlanningComponent },
  { path: 'item-installation', component: ItemInstallationComponent },
  { path: 'item-installed-approval', component: ItemInstalledApprovalComponent },
  { path: 'installation-completion-claim-verification', component: InstallationCompletionClaimVerificationComponent },
  { path: 'installation-completion-claim-self-approval', component: InstallationCompletionClaimSelfApprovalComponent },
  { path: 'project-pre-completion', component: ProjectPreCompletionComponent },
  { path: 'project-completion', component: ProjectCompletionComponent },
  { path: 'project-completion-approval', component: ProjectCompletionApprovalComponent },
  { path: 'project-completion-document-generation', component: ProjectCompletionDocumentGenerationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationRoutingModule { }
