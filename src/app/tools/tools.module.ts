import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';
import { ToolsRoutingModule } from './tools-routing.module';
import { InstallationComponent } from './installation/installation.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { ContractComponent } from './contract/contract.component';
import { DistanceComponent } from './distance/distance.component';
import { SupplyComponent } from './supply/supply.component';
import { SaleRateComponent } from './sale-rate/sale-rate.component';
import { DiscountComponent } from './discount/discount.component';
import { SaleMatrixComponent } from './sale-matrix/sale-matrix.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationSettingComponent } from './configuration-setting/configuration-setting.component';
import { CurrencyComponent } from './currency/currency.component';
import { UtilityComponent } from './utility/utility.component';

@NgModule({
  declarations: [
    InstallationComponent,
    WarrantyComponent,
    ContractComponent,
    DistanceComponent,
    SupplyComponent,
    SaleRateComponent,
    DiscountComponent,
    SaleMatrixComponent,
    ConfigurationComponent,
    ConfigurationSettingComponent,
    CurrencyComponent,
    UtilityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SharedModule,
    ToolsRoutingModule
  ]
})
export class ToolsModule { }
