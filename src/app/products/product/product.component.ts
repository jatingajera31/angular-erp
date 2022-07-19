import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  cardImageBase64 = './assets/images/product.jpg';
  productForm: FormGroup;
  productAssemblyForm: FormGroup;
  showQrConfirm = false;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  showServiceGroupModal = false;
  showServiceCodeModal = false;
  showUnitModal = false;
  showCategoryModal = false;
  showBrandModal = false;
  showPairedModal = false;
  invalidForm = false;
  isITCAlert = false;
  showItcConfirm = false;
  showRemoveButton = false;
  showPairedTable = false;
  isUsed = false;
  productLists : any[] = [];
  unitLists : any[] = [];
  categoryLists : any[] = [];
  brandLists : any[] = [];
  productListGroup : any[] = [];
  productModelNoLists : any[] = [];
  modelLists : any[] = [];
  purchaseSources : any[] = [];
  pairedProducts : any[] = [];
  suppliers : any[] = [];
  pairedProductNames: any = '';
  serviceGroupName: any;
  serviceCodeName: any;
  unitName: any;
  categoryName: any;
  brandName: any;
  defaultRate: any;
  ProductAccessoryGroup: any = null;
  ProductAccessoryModel: any = null;
  ProductAccessoryQty: any = null;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.productForm = this.fb.group({
      id: new FormControl(null),
      group_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      model_no: new FormControl(null, Validators.required),
      category_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      unit_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      brand_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      paired_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      paired_qty: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      source_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      availibility: new FormControl(null),
      stock_reminder: new FormControl(null),
      extended_warranty: new FormControl(null),
      sc_rate: new FormControl(null),
      sc_month: new FormControl(null),
      qr_code: new FormControl(null),
      yield_by_installation: new FormControl(null),
      product_type: new FormControl('General', Validators.required),
      product_code: new FormControl(null),
      hsn_code: new FormControl(null),
      purchase_rate: new FormControl(null, Validators.required),
      sales_rate: new FormControl(null),
      max_retail_price: new FormControl(null, Validators.required),
      max_selling_price: new FormControl(null, Validators.required),
      sale_gst: new FormControl(null, Validators.required),
      gst_rate: new FormControl(null, Validators.required),
      weight_gram: new FormControl(null),
      weight_kg: new FormControl(null),
      description: new FormControl(null, Validators.required),
      sort_description: new FormControl(null, Validators.required),
      opening_stock: new FormControl(null),
      stock_reminder_qty: new FormControl({value: null, disabled: true}),
      supplier_warranty: new FormControl(null, Validators.required),
      client_warranty: new FormControl(null, Validators.required),
      extended_month: new FormControl(null),
      extended_warranty_rate: new FormControl(null),
      extended_warranty_yearly_increment: new FormControl(null),
      sc_rate_comprehensive_rate: new FormControl(null),
      sc_rate_comprehensive_yearly_increment: new FormControl(null),
      sc_rate_non_comprehensive_rate: new FormControl(null),
      sc_rate_non_comprehensive_yearly_increment: new FormControl(null),
      mac_address: new FormControl(null),
      serial_no: new FormControl(null),
      photo: new FormControl(null),
      photo_name: new FormControl(null),
      remarks: new FormControl(null),
      is_itc: new FormControl(null),
      itc_rate: new FormControl({value: null, disabled: true}),
      itc_gst_rate: new FormControl(null),
      itc_hsncode: new FormControl(null),
      is_repair: new FormControl(null),
      repair_rate: new FormControl({value: null, disabled: true}),
      repair_gst_rate: new FormControl(null),
      repair_hsncode: new FormControl(null),
      is_handling_charge: new FormControl(null),
      handling_charge_rate: new FormControl({value: null, disabled: true}),
      hsn_code_allow: new FormControl(null),
      hsn_code_alert: new FormControl(null),
    });

    this.productAssemblyForm = this.fb.group({
      id: new FormControl(null),
      product_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      product_group_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      model_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      quantity: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
    });

    this.getProducts();
    this.getPurchaseSources();
    this.getUnit();
    this.getCategory();
    this.getProductGroup();
    this.getSupplier();
  }

  ngOnInit(): void {
  }

  getSupplier() {
    this.apiService.getSupplier({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  changeType() {
    if (this.productForm.value.product_type == 'General') {
      this.productForm.controls.group_id.setValidators([Validators.required])
      this.productForm.controls.category_id.setValidators([Validators.required])
      this.productForm.controls.source_id.setValidators([Validators.required])
      this.productForm.controls.purchase_rate.setValidators([Validators.required])
      this.productForm.controls.max_retail_price.setValidators([Validators.required])
      this.productForm.controls.max_selling_price.setValidators([Validators.required])
      this.productForm.controls.gst_rate.setValidators([Validators.required])
      this.productForm.controls.sale_gst.setValidators([Validators.required])
      this.productForm.controls.sort_description.setValidators([Validators.required])
      this.productForm.controls.supplier_warranty.setValidators([Validators.required])
      this.productForm.controls.client_warranty.setValidators([Validators.required])

      this.productForm.controls.group_id.updateValueAndValidity()
      this.productForm.controls.category_id.updateValueAndValidity()
      this.productForm.controls.source_id.updateValueAndValidity()
      this.productForm.controls.purchase_rate.updateValueAndValidity()
      this.productForm.controls.max_retail_price.updateValueAndValidity()
      this.productForm.controls.max_selling_price.updateValueAndValidity()
      this.productForm.controls.gst_rate.updateValueAndValidity()
      this.productForm.controls.sale_gst.updateValueAndValidity()
      this.productForm.controls.sort_description.updateValueAndValidity()
      this.productForm.controls.supplier_warranty.updateValueAndValidity()
      this.productForm.controls.client_warranty.updateValueAndValidity()
      
      this.productForm.controls.sales_rate.clearValidators();
      this.productForm.controls.sales_rate.updateValueAndValidity();

    } else {
      this.productForm.controls.sales_rate.setValidators([Validators.required])
      this.productForm.controls.sales_rate.updateValueAndValidity();

      this.productForm.controls.group_id.clearValidators()
      this.productForm.controls.category_id.clearValidators()
      this.productForm.controls.source_id.clearValidators()
      this.productForm.controls.purchase_rate.clearValidators()
      this.productForm.controls.max_retail_price.clearValidators()
      this.productForm.controls.max_selling_price.clearValidators()
      this.productForm.controls.gst_rate.clearValidators()
      this.productForm.controls.sale_gst.clearValidators()
      this.productForm.controls.sort_description.clearValidators()
      this.productForm.controls.supplier_warranty.clearValidators()
      this.productForm.controls.client_warranty.clearValidators()

      this.productForm.controls.group_id.updateValueAndValidity()
      this.productForm.controls.category_id.updateValueAndValidity()
      this.productForm.controls.source_id.updateValueAndValidity()
      this.productForm.controls.purchase_rate.updateValueAndValidity()
      this.productForm.controls.max_retail_price.updateValueAndValidity()
      this.productForm.controls.max_selling_price.updateValueAndValidity()
      this.productForm.controls.gst_rate.updateValueAndValidity()
      this.productForm.controls.sale_gst.updateValueAndValidity()
      this.productForm.controls.sort_description.updateValueAndValidity()
      this.productForm.controls.supplier_warranty.updateValueAndValidity()
      this.productForm.controls.client_warranty.updateValueAndValidity()
    }
  }

  getDiscountMatrix() {
    this.apiService.getDiscountMatrix({source_id: this.productForm.value.source_id}).subscribe(data => {
      if (data && data['status'] == 1 && data['data']) {
        this.defaultRate = data['data'];
        this.setRate();
      }
    });
  }

  setRate() {
    if (this.defaultRate && this.productForm.value.purchase_rate) {
      let max_retail_price = parseFloat(this.productForm.value.purchase_rate) + ((this.productForm.value.purchase_rate * this.defaultRate.max_profit) / 100);
      let max_selling_price = parseFloat(this.productForm.value.purchase_rate) + ((this.productForm.value.purchase_rate * this.defaultRate.msp_profit) / 100);
      max_retail_price = parseFloat(max_retail_price.toFixed(2));
      max_selling_price = parseFloat(max_selling_price.toFixed(2));
      this.productForm.controls.max_retail_price.setValue(max_retail_price);
      this.productForm.controls.max_selling_price.setValue(max_selling_price);
    }
  }

  changeHand() {
    if (this.productForm.value.is_handling_charge) {
      this.productForm.controls.handling_charge_rate.enable();
      this.productForm.controls.handling_charge_rate.setValidators([Validators.required])
      this.productForm.controls.handling_charge_rate.updateValueAndValidity()
    } else {
      this.productForm.controls.handling_charge_rate.disable();
      this.productForm.controls.handling_charge_rate.clearValidators()
      this.productForm.controls.handling_charge_rate.updateValueAndValidity()
    }
  }

  changeStock() {      
    if (this.productForm.value.stock_reminder) {
      this.productForm.controls.stock_reminder_qty.enable();
      this.productForm.controls.stock_reminder_qty.setValidators([Validators.required])
      this.productForm.controls.stock_reminder_qty.updateValueAndValidity()
    } else {
      this.productForm.controls.stock_reminder_qty.disable();
      this.productForm.controls.stock_reminder_qty.clearValidators()
      this.productForm.controls.stock_reminder_qty.updateValueAndValidity()
    }
  }

  yesItcModal() {
    this.isITCAlert = false;
    this.showItcConfirm = false
    this.productForm.controls.itc_rate.setValue(null);
  }

  noItcModal() {
    this.isITCAlert = true;
    this.showItcConfirm = false
    this.productForm.controls.is_itc.setValue(true);
  }

  changeItc() {
    if (this.isITCAlert && this.productForm.value.id) {
      this.showItcConfirm = true;
    } else {
      if (this.productForm.value.is_itc) {
        this.productForm.controls.itc_rate.enable();
        this.productForm.controls.itc_rate.setValidators([Validators.required])
        this.productForm.controls.itc_gst_rate.setValidators([Validators.required])
        this.productForm.controls.itc_hsncode.setValidators([Validators.required])

        this.productForm.controls.itc_rate.updateValueAndValidity();
        this.productForm.controls.itc_gst_rate.updateValueAndValidity();
        this.productForm.controls.itc_hsncode.updateValueAndValidity();
      } else {
        this.productForm.controls.itc_rate.disable();
        this.productForm.controls.itc_rate.clearValidators()
        this.productForm.controls.itc_gst_rate.clearValidators()
        this.productForm.controls.itc_hsncode.clearValidators()
        
        this.productForm.controls.itc_rate.updateValueAndValidity();
        this.productForm.controls.itc_gst_rate.updateValueAndValidity();
        this.productForm.controls.itc_hsncode.updateValueAndValidity();
      }
    }
  }

  changeRepair() {
    if (this.productForm.value.is_repair) {
      this.productForm.controls.repair_rate.enable();
      this.productForm.controls.repair_rate.setValidators([Validators.required])
      this.productForm.controls.repair_gst_rate.setValidators([Validators.required])
      this.productForm.controls.repair_hsncode.setValidators([Validators.required])

      this.productForm.controls.repair_rate.updateValueAndValidity();
      this.productForm.controls.repair_gst_rate.updateValueAndValidity();
      this.productForm.controls.repair_hsncode.updateValueAndValidity();
    } else {
      this.productForm.controls.repair_rate.disable();
      this.productForm.controls.repair_rate.clearValidators()
      this.productForm.controls.repair_gst_rate.clearValidators()
      this.productForm.controls.repair_hsncode.clearValidators()
      
      this.productForm.controls.repair_rate.updateValueAndValidity();
      this.productForm.controls.repair_gst_rate.updateValueAndValidity();
      this.productForm.controls.repair_hsncode.updateValueAndValidity();
    }
  }

  changeContract() {
    if (this.productForm.value.sc_rate) {
      this.productForm.controls.sc_month.setValidators([Validators.required]);
      this.productForm.controls.sc_rate_comprehensive_rate.setValidators([Validators.required]);
      this.productForm.controls.sc_rate_comprehensive_yearly_increment.setValidators([Validators.required]);
      this.productForm.controls.sc_rate_non_comprehensive_rate.setValidators([Validators.required]);
      this.productForm.controls.sc_rate_non_comprehensive_yearly_increment.setValidators([Validators.required]);
    } else {
      this.productForm.controls.sc_month.clearValidators();
      this.productForm.controls.sc_rate_comprehensive_rate.clearValidators();
      this.productForm.controls.sc_rate_comprehensive_yearly_increment.clearValidators();
      this.productForm.controls.sc_rate_non_comprehensive_rate.clearValidators();
      this.productForm.controls.sc_rate_non_comprehensive_yearly_increment.clearValidators();
    }
    this.productForm.controls.sc_month.updateValueAndValidity();
    this.productForm.controls.sc_rate_comprehensive_rate.updateValueAndValidity();
    this.productForm.controls.sc_rate_comprehensive_yearly_increment.updateValueAndValidity();
    this.productForm.controls.sc_rate_non_comprehensive_rate.updateValueAndValidity();
    this.productForm.controls.sc_rate_non_comprehensive_yearly_increment.updateValueAndValidity();
  }

  changeWarranty() {
    if (this.productForm.value.extended_warranty) {
      this.productForm.controls.extended_month.setValidators([Validators.required]);
      this.productForm.controls.extended_warranty_rate.setValidators([Validators.required]);
      this.productForm.controls.extended_warranty_yearly_increment.setValidators([Validators.required]);
    } else {
      this.productForm.controls.extended_month.clearValidators();
      this.productForm.controls.extended_warranty_rate.clearValidators();
      this.productForm.controls.extended_warranty_yearly_increment.clearValidators();
    }
    this.productForm.controls.extended_month.updateValueAndValidity();
    this.productForm.controls.extended_warranty_rate.updateValueAndValidity();
    this.productForm.controls.extended_warranty_yearly_increment.updateValueAndValidity();
  }

  changeGmWeight() {
    if (this.productForm.value.weight_gram) {
      let kgw = this.productForm.value.weight_gram / 1000;
      this.productForm.controls.weight_kg.setValue(kgw);
    }
  }

  changeKgWeight() {
    if (this.productForm.value.weight_kg) {
      let kgw = this.productForm.value.weight_kg * 1000;
      this.productForm.controls.weight_gram.setValue(kgw);
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.showPairedTable = false;
    this.showQrConfirm = false;
    this.productForm.reset();
    this.cardImageBase64 = './assets/images/product.jpg';
    this.productForm.controls.product_type.setValue('General');
    this.pairedProducts = [];
    this.pairedProductNames = null;
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.productForm.reset();
    this.productForm.controls['model_no'].setValidators([Validators.required]);
    this.productForm.controls['model_no'].updateValueAndValidity();
    this.productForm.controls['id'].clearValidators();
    this.productForm.controls['id'].updateValueAndValidity();
    this.productForm.controls.product_type.setValue('General');
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.productForm.reset();
    this.productForm.controls['id'].setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
    this.productForm.controls['id'].updateValueAndValidity();
    this.productForm.controls['model_no'].clearValidators();
    this.productForm.controls['model_no'].updateValueAndValidity();
    this.productForm.controls.product_type.setValue('General');
  }

  deleteProduct() {
    if (this.productForm.value.id && this.productForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Product.');
    }
  }

  deleteData() {
    if (!this.productForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Product Info.');
    } else {
      this.loader.start();
      this.apiService.deleteProduct({id: this.productForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Product deleted successfully.'); 
        }
      });
    }
  }

  getProducts() {
    this.apiService.getProduct({product_type: 'Special'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productLists = data['data'];
      }
    });
  }

  getPurchaseSources() {
    this.apiService.getPurchaseSources({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchaseSources = data['data'];
      }
    });
  }

  getUnit() {
    this.apiService.getUnit({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.unitLists = data['data'];
      }
    });
  }

  getCategory() {
    this.apiService.getCategory({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.categoryLists = data['data'];
      }
    });
  }

  getBrand() {
    this.apiService.getBrand({group_id: this.productForm.value.group_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.brandLists = data['data'];
      }
    });
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productListGroup = data['data'];
      }
    });
  }

  getProductGroupCode() {
    this.productForm.controls.id.setValue(null);
    if (this.productForm.value.group_id && this.editMode) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.productForm.value.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.productModelNoLists = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getModels() {
    if (this.ProductAccessoryGroup && this.ProductAccessoryGroup != 'null') {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.ProductAccessoryGroup, product_id: this.productForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.modelLists = data['data'];
        }
        this.loader.stop();
      });
    } else {
      this.modelLists = [];
    }
  }

  viewServiceGroupModal() {
    if (this.productForm.value.group_id && this.productForm.value.group_id != 'null') {
      for(let i in this.productListGroup) {
        if (this.productListGroup[i].id == this.productForm.value.group_id) {
          this.serviceGroupName = this.productListGroup[i].name;
          this.showServiceGroupModal = true;
        }
      }
    } else {
      this.serviceGroupName = '';
      this.showServiceGroupModal = true;
    }
  }

  viewServiceCodeModal() {
    if (this.productForm.value.id) {
      for(let i in this.productModelNoLists) {
        if (this.productModelNoLists[i].id == this.productForm.value.id) {
          this.serviceCodeName = this.productModelNoLists[i].model_no;
          this.showServiceCodeModal = true;
        }
      }
    }
  }

  viewUnitModal() {
    if (this.productForm.value.unit_id && this.productForm.value.unit_id != 'null') {
      for(let i in this.unitLists) {
        if (this.unitLists[i].id == this.productForm.value.unit_id) {
          this.unitName = this.unitLists[i].name;
          this.showUnitModal = true;
        }
      }
    } else {
      this.unitName = '';
      this.showUnitModal = true;
    }
  }

  viewCategoryModal() {
    if (this.productForm.value.category_id && this.productForm.value.category_id != 'null') {
      for(let i in this.categoryLists) {
        if (this.categoryLists[i].id == this.productForm.value.category_id) {
          this.categoryName = this.categoryLists[i].name;
          this.showCategoryModal = true;
        }
      }
    } else {
      this.categoryName = '';
      this.showCategoryModal = true;
    }
  }

  viewBrandModal() {
    if (this.productForm.value.brand_id && this.productForm.value.brand_id != 'null') {
      for(let i in this.brandLists) {
        if (this.brandLists[i].id == this.productForm.value.brand_id) {
          this.brandName = this.brandLists[i].name;
          this.showBrandModal = true;
        }
      }
    } else {
      this.brandName = '';
      this.showBrandModal = true;
    }
  }

  setEditFormData() {
    if (this.productForm.value.id && this.productForm.value.id != 'null') {
      if (this.productForm.value.product_type == 'General') {
        for(let i in this.productModelNoLists) {
          if (this.productModelNoLists[i].id == this.productForm.value.id) {
            this.isITCAlert = false;
            this.productForm.patchValue(this.productModelNoLists[i]);
            if (this.productModelNoLists[i].is_itc) {
              this.isITCAlert = true;  
              this.productForm.controls.itc_rate.enable();
              this.productForm.controls.itc_rate.setValidators([Validators.required])
              this.productForm.controls.itc_gst_rate.setValidators([Validators.required])
              this.productForm.controls.itc_hsncode.setValidators([Validators.required])

              this.productForm.controls.itc_rate.updateValueAndValidity();
              this.productForm.controls.itc_gst_rate.updateValueAndValidity();
              this.productForm.controls.itc_hsncode.updateValueAndValidity();
            } else {
              this.productForm.controls.itc_rate.disable();
              this.productForm.controls.itc_rate.clearValidators()
              this.productForm.controls.itc_gst_rate.clearValidators()
              this.productForm.controls.itc_hsncode.clearValidators()
              
              this.productForm.controls.itc_rate.updateValueAndValidity();
              this.productForm.controls.itc_gst_rate.updateValueAndValidity();
              this.productForm.controls.itc_hsncode.updateValueAndValidity();
            }
            this.changeRepair();
            this.changeStock();
            this.changeHand();
            if (this.productModelNoLists[i].photo) {
              this.cardImageBase64 = this.productModelNoLists[i].photo;
            }
            this.productForm.controls.photo.setValue(null);
            this.getDiscountMatrix();
          }
        }
      } else {
        for(let i in this.productLists) {
          if (this.productLists[i].id == this.productForm.value.id) {
            this.productForm.patchValue(this.productLists[i]);
            if (this.productLists[i].photo) {
              this.cardImageBase64 = this.productLists[i].photo;
            }
            this.productForm.controls.photo.setValue(null);
          }
        }
      }

      this.loader.start();
      this.apiService.showProduct({id: this.productForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.pairedProducts = [];
          for(var i in data['paired']) {
            this.pairedProducts.push({
              group_id: data['paired'][i].group_id,
              group_name: data['paired'][i]['group'].name,
              model_id: data['paired'][i].model_id,
              model_name: (data['paired'][i]['prmodel']) ? data['paired'][i]['prmodel'].model_no: '',
              qty: data['paired'][i].qty,
            });
          }
          this.setPairedProductNames();
        }
        this.isUsed = data['used'];
      });
    }
  }

  undoForm() {
    this.cardImageBase64 = './assets/images/product.jpg';
    this.invalidForm = false;
    this.productForm.reset();
    this.productForm.controls.product_type.setValue('General');
    this.productForm.controls.is_itc.setValue(false);
    this.productForm.controls.stock_reminder.setValue(false);
    this.productForm.controls.is_handling_charge.setValue(false);
    this.isITCAlert = false;
    this.showPairedTable = false;
    this.pairedProducts = [];
    this.pairedProductNames = null;
    this.changeStock();
    this.changeHand();
    this.changeItc();
  }

  saveProduct() {
    for(var r in this.productForm.controls) {
      console.log(r, this.productForm.controls[r].invalid)
    }
    this.invalidForm = false;
    if (this.productForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (!this.productForm.value.qr_code && !this.isUsed) {
      this.showQrConfirm = true;
    } else {
      this.confirmQrCode();
    }
  }

  confirmQrCode() {
    let params = JSON.parse(JSON.stringify(this.productForm.value));
    params.paired_ids = this.pairedProducts;
    if (this.productForm.value.id) {
      this.loader.start();
      this.apiService.updateProduct(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm();
          this.toastr.success('SUCCESS', 'Product details updated successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveProduct(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm();
          this.getProducts();
          this.toastr.success('SUCCESS', 'Product details saved successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveServiceGroup() {
    if (!this.serviceGroupName) {
      this.toastr.error('ERROR', 'Please enter product group.');
      return;
    }
    if (this.productForm.value.group_id) {
      this.loader.start();
      this.apiService.updateProductGroup({id:this.productForm.value.group_id, name: this.serviceGroupName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.productListGroup) {
            if (this.productListGroup[i].id == this.productForm.value.group_id) {
              this.productListGroup[i].name = data['data'].name;
            }
          }
          this.showServiceGroupModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      })
    } else {
      this.loader.start();
      this.apiService.saveProductGroup({name: this.serviceGroupName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.productListGroup.push(data['data']);
          this.productForm.controls.group_id.setValue(data['data'].id);
          this.showServiceGroupModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveUnit() {
    if (!this.unitName) {
      this.toastr.error('ERROR', 'Please enter unit.');
      return;
    }
    if (this.productForm.value.unit_id) {
      this.loader.start();
      this.apiService.updateUnit({id: this.productForm.value.unit_id, name: this.unitName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.unitLists) {
            if (this.unitLists[i].id == this.productForm.value.unit_id) {
              this.unitLists[i].name = data['data'].name;
            }
          }
          this.showUnitModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveUnit({name: this.unitName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.unitLists.push(data['data']);
          this.productForm.controls.unit_id.setValue(data['data'].id);
          this.showUnitModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveCategory() {
    if (!this.productForm.value.group_id || this.productForm.value.group_id == 'null') {
      this.toastr.error('ERROR', 'Please Select Product Group.');
      return;
    }
    if (!this.categoryName) {
      this.toastr.error('ERROR', 'Please enter category.');
      return;
    }
    if (this.productForm.value.category_id && this.productForm.value.category_id != 'null') {
      this.loader.start();
      this.apiService.updateCategory({id: this.productForm.value.category_id, name: this.categoryName, group_id: this.productForm.value.group_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.categoryLists) {
            if (this.categoryLists[i].id == this.productForm.value.category_id) {
              this.categoryLists[i].name = data['data'].name;
            }
          }
          this.showCategoryModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveCategory({name: this.categoryName, group_id: this.productForm.value.group_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.categoryLists.push(data['data']);
          this.productForm.controls.category_id.setValue(data['data'].id);
          this.showCategoryModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveBrand() {
    if (!this.brandName) {
      this.toastr.error('ERROR', 'Please enter brand.');
      return;
    }
    if (!this.productForm.value.group_id) {
      this.toastr.error('ERROR', 'Please select group.');
      return;
    }
    if (this.productForm.value.brand_id && this.productForm.value.brand_id != 'null') {
      this.loader.start();
      this.apiService.updateBrand({id: this.productForm.value.brand_id, name: this.brandName, group_id: this.productForm.value.group_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.brandLists) {
            if (this.brandLists[i].id == this.productForm.value.brand_id) {
              this.brandLists[i].name = data['data'].name;
            }
          }
          this.showBrandModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveBrand({name: this.brandName, group_id: this.productForm.value.group_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.brandLists.push(data['data']);
          this.productForm.controls.brand_id.setValue(data['data'].id);
          this.showBrandModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  viewPairedModal() {
    this.showPairedModal = true;
    this.ProductAccessoryGroup = null;
    this.ProductAccessoryModel = null;
    this.ProductAccessoryQty = null;
  }

  checkExist() {
    this.showRemoveButton = false;
    this.pairedProducts.forEach((item) => {
      if (item.group_id == this.ProductAccessoryGroup && item.model_id == this.ProductAccessoryModel) {
        this.showRemoveButton = true;
      }
    });
  }

  removeProductAccessory() {
    this.pairedProducts.forEach((item:any, key: any) => {
      if (item.group_id == this.ProductAccessoryGroup && item.model_id == this.ProductAccessoryModel) {
        this.pairedProducts.splice(key, 1);
      }
    }); 
    this.setPairedProductNames();
    this.showPairedModal = false;
    this.showRemoveButton = false;
  }

  saveProductAccessory() {
    if (!this.ProductAccessoryGroup || this.ProductAccessoryGroup == 'null') {
      this.toastr.error('ERROR', 'Please select product group.');
      return;
    }
    if (!this.ProductAccessoryModel || this.ProductAccessoryModel == 'null') {
      this.toastr.error('ERROR', 'Please select product model.');
      return;
    }
    if (!this.ProductAccessoryQty || this.ProductAccessoryQty == 'null') {
      this.toastr.error('ERROR', 'Please enetr product quantity.');
      return;
    }

    if (this.showRemoveButton) {
      this.toastr.error('ERROR', 'Product already exist.');
      return; 
    }

    let grow = this.productListGroup.filter((item:any) => { return (item.id == this.ProductAccessoryGroup) });
    let mrow = this.modelLists.filter((item:any) => { return (item.id == this.ProductAccessoryModel) });

    if (grow.length && mrow.length) {
      this.pairedProducts.push({
        group_id: this.ProductAccessoryGroup,
        group_name: grow[0].name,
        model_id: this.ProductAccessoryModel,
        model_name: mrow[0].model_no,
        qty: this.ProductAccessoryQty
      });
      this.setPairedProductNames();

      this.showPairedModal = false;
    }
  }

  removePrd(key: any) {
    this.pairedProducts.splice(key, 1);
    this.setPairedProductNames();
  }

  setPairedProductNames() {
    let names = this.pairedProducts.map((item:any) => { return item.model_name } );
    this.pairedProductNames = names.join(', ');
  }

  saveServiceGroupCode() {
    if (!this.serviceCodeName || !this.productForm.value.id) {
      this.toastr.error('ERROR', 'Please enter service code.');
      return;
    }
    this.loader.start();
    this.apiService.saveProductGroupCode({id: this.productForm.value.id,  model_no: this.serviceCodeName}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.productForm.controls.model_no.setValue(data['data'].model_no);
        for(let i in this.productModelNoLists) {
          if (this.productModelNoLists[i].id == this.productForm.value.id) {
            this.productModelNoLists[i].model_no = data['data'].model_no;
          }
        }
        this.showServiceCodeModal = false;
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.cardImageBase64 = e.target.result;
          this.productForm.controls.photo.setValue(e.target.result);
          this.productForm.controls.photo_name.setValue(fileInput.target.files[0].name);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  toFixed(value:any) {
    if (value) {
      value = parseFloat(value);
      return value.toFixed(2);
    }
  }

  isValid(value: any) {
    return (!value || value == 'null' || value == 'undefined' || value == '');
  }

}
