import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteComponent } from './delete/delete.component';
import { AddressComponent } from './address/address.component';
import { FormatInputDirective } from '../directive/format-input.directive';
import { ProductViewComponent } from './product-view/product-view.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmationService } from '../services/confirmation.service';  

@NgModule({
  declarations: [
    DeleteComponent,
    AddressComponent,
    FormatInputDirective,
    ProductViewComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [DeleteComponent, AddressComponent, ProductViewComponent, FormatInputDirective, ConfirmDialogComponent],
  providers: [  
     ConfirmationService  
  ]
})
export class SharedModule { }
