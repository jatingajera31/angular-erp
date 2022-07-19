import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { RightsComponent } from './rights/rights.component';
import { SettingsComponent } from './settings/settings.component';
import { PhotoComponent } from './photo/photo.component';

const routes: Routes = [
  { path: 'executive-profile', component: ProfileComponent },
  { path: 'executive-access-rights', component: RightsComponent },
  { path: 'password-settings', component: SettingsComponent },
  { path: 'profile-photo', component: PhotoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveRoutingModule { }
