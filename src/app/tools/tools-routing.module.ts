import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  { path: 'yield-on-installation', component: InstallationComponent },
  { path: 'extended-warranty-planner', component: WarrantyComponent },
  { path: 'service-contract-planner', component: ContractComponent },
  { path: 'distance-variable', component: DistanceComponent },
  { path: 'supply-life-variable', component: SupplyComponent },
  { path: 'sales-rate-editor', component: SaleRateComponent },
  { path: 'discount-type-master', component: DiscountComponent },
  { path: 'sales-rate-discount-matrix', component: SaleMatrixComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'configuration-setting', component: ConfigurationSettingComponent },
  { path: 'currency', component: CurrencyComponent },
  { path: 'utility', component: UtilityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
