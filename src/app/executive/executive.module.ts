import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ExecutiveRoutingModule } from './executive-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { RightsComponent } from './rights/rights.component';
import { SettingsComponent } from './settings/settings.component';
import { PhotoComponent } from './photo/photo.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ProfileComponent,
    RightsComponent,
    SettingsComponent,
    PhotoComponent
  ],
  imports: [
    CommonModule,
    ExecutiveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule
  ],
  providers: [DatePipe]
})
export class ExecutiveModule { }
