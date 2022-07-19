import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  selectedModal: any;
  productImage = './assets/images/product.jpg';
  @Input() ProductId:any;
  @Output() closeView = new EventEmitter<any>();
  constructor(private apiService: ApiService, private loader: LoaderService) {

  }

  ngOnInit(): void {
    this.viewProduct();
  }

  viewProduct() {
    this.loader.start();
    this.apiService.viewProduct({id: this.ProductId}).subscribe(data => {
      this.selectedModal = data['data'];
      if (this.selectedModal.photo) {
        this.productImage = this.selectedModal.photo;
      }
      this.loader.stop();
    });
  }

  closeDialog() {
    this.closeView.emit(true);
  }

}
