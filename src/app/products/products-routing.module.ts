import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ServiceComponent } from './service/service.component';

const routes: Routes = [
  { path: 'product', component: ProductComponent },
  { path: 'service', component: ServiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
