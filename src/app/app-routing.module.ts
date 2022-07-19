import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { GaurdService as AuthGuard } from './services/gaurd.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/' },
  { 
    path: '',
    loadChildren: () => import('./login/login.module').then(res => res.LoginModule)
  },
  { 
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
    {
      path: 'actions',
      loadChildren: () => import('./actions/actions.module').then(res => res.ActionsModule),
    }, {
      path: 'account',
      loadChildren: () => import('./account/account.module').then(res => res.AccountModule),
    }, {
      path: 'executive',
      loadChildren: () => import('./executive/executive.module').then(res => res.ExecutiveModule),
    }, {
      path: 'executive-duty',
      loadChildren: () => import('./executive-duty/executive-duty.module').then(res => res.ExecutiveDutyModule),
    }, {
      path: 'product-and-service',
      loadChildren: () => import('./products/products.module').then(res => res.ProductsModule),
    }, {
      path: 'tools',
      loadChildren: () => import('./tools/tools.module').then(res => res.ToolsModule),
    }, {
      path: 'purchase',
      loadChildren: () => import('./purchase/purchase.module').then(res => res.PurchaseModule),
    }, {
      path: 'sales',
      loadChildren: () => import('./sales/sales.module').then(res => res.SalesModule),
    }, {
      path: 'sales-return',
      loadChildren: () => import('./sales-return/sales-return.module').then(res => res.SalesReturnModule),
    }, {
      path: 'demo',
      loadChildren: () => import('./demo/demo.module').then(res => res.DemoModule),
    }, {
      path: 'sample',
      loadChildren: () => import('./sample/sample.module').then(res => res.SampleModule),
    }, {
      path: 'spare-service',
      loadChildren: () => import('./spare-service/spare-service.module').then(res => res.SpareServiceModule),
    }, {
      path: 'exchange',
      loadChildren: () => import('./exchange/exchange.module').then(res => res.ExchangeModule),
    }, {
      path: 'product-scrap',
      loadChildren: () => import('./product-scrap/product-scrap.module').then(res => res.ProductScrapModule),
    }, {
      path: 'product-missing',
      loadChildren: () => import('./product-missing/product-missing.module').then(res => res.ProductMissingModule),
    }, {
      path: 'installation',
      loadChildren: () => import('./installation/installation.module').then(res => res.InstallationModule),
    }, {
      path: 'verification',
      loadChildren: () => import('./verification/verification.module').then(res => res.VerificationModule),
    }, {
      path: 'call-management',
      loadChildren: () => import('./call-management/call-management.module').then(res => res.CallManagementModule),
    }, {
      path: 'repair',
      loadChildren: () => import('./repair/repair.module').then(res => res.RepairModule),
    }, {
      path: 'sc-notification',
      loadChildren: () => import('./sc-notification/sc-notification.module').then(res => res.ScNotificationModule),
    }, {
      path: 'bill-generation',
      loadChildren: () => import('./bill-generation/bill-generation.module').then(res => res.BillGenerationModule),
    }, {
      path: 'marketing',
      loadChildren: () => import('./marketing/marketing.module').then(res => res.MarketingModule),
    }, {
      path: 'reports',
      loadChildren: () => import('./reports/reports.module').then(res => res.ReportsModule),
    }, {
      path: 'vehicle',
      loadChildren: () => import('./vehicle/vehicle.module').then(res => res.VehicleModule),
    }, {
      path: 'fuel-management',
      loadChildren: () => import('./fuel-management/fuel-management.module').then(res => res.FuelManagementModule),
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
