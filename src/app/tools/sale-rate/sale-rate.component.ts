import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
declare var $: any;

@Component({
  selector: 'app-sale-rate',
  templateUrl: './sale-rate.component.html',
  styleUrls: ['./sale-rate.component.css']
})
export class SaleRateComponent implements OnInit {

  installations : any[] = [];
  originalData : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  brands : any[] = [];
  purchaseSources : any[] = [];
  productSources : any[] = [];
  selectAll = false;
  isChecked = false;
  singleMode = false;
  isEditModel = false;
  confirmModel = false;
  horizonalScroll:any;
  group_id: any = null;
  brand_id: any = null;
  defaultRate: any;
  editForm: FormGroup;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.editForm = this.fb.group({
      is_source_id: new FormControl(null),
      source_id: new FormControl({value: null, disabled: true}),
      is_purchase_rate: new FormControl(null),
      purchase_rate: new FormControl({value: null, disabled: true}),
      is_gst: new FormControl(null),
      gst_rate: new FormControl({value: null, disabled: true}),
      is_sale_gst: new FormControl(null),
      sale_gst: new FormControl({value: null, disabled: true}),
      is_itc_gst: new FormControl(null),
      itc_gst: new FormControl({value: null, disabled: true}),
      is_itc_hsn: new FormControl(null),
      itc_hsn: new FormControl({value: null, disabled: true}),
      is_handling_gst: new FormControl(null),
      handling_charge_gst: new FormControl({value: null, disabled: true}),
      is_handling_hsn: new FormControl(null),
      handling_charge_hsn: new FormControl({value: null, disabled: true}),
      is_warranty_addon: new FormControl(null),
      warranty_addon: new FormControl({value: null, disabled: true}),
      is_warranty_factor: new FormControl(null),
      warranty_factor: new FormControl({value: null, disabled: true}),
      is_comp_addon: new FormControl(null),
      comp_addon: new FormControl({value: null, disabled: true}),
      is_comp_factor: new FormControl(null),
      comp_factor: new FormControl({value: null, disabled: true}),
      is_non_comp_addon: new FormControl(null),
      non_comp_addon: new FormControl({value: null, disabled: true}),
      is_non_comp_factor: new FormControl(null),
      non_comp_factor: new FormControl({value: null, disabled: true}),
    });
    this.getPurchaseSources();
    this.getProductGroup();
  }

  ngOnInit(): void {
    
  }

  ngAfterContentInit() {
    var div = document.getElementById('tableResponsive');
    if (div) {
      this.horizonalScroll = (div.scrollWidth > div.clientWidth);
      if (this.horizonalScroll) {
        setTimeout(() => {
          $('[data-toggle="tooltip"]').tooltip()
        }, 500)
      }
    }
  }

  leftClick() {
    const leftBtn = document.querySelector('#left-button');
    const conent = document.querySelector('#tableResponsive');
    if (conent) {
      conent.scrollLeft -= 250;
    }
  }

  rightClick() {
    const rightBtn = document.querySelector('#right-button');    
    const conent = document.querySelector('#tableResponsive');
    if (conent) {
      conent.scrollLeft += 250;
    }
  }

  getPurchaseSources() {
    this.apiService.getPurchaseSources({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchaseSources = data['data'];
        this.productSources = [];
        this.purchaseSources.forEach((item) => {
          this.productSources[item.id] = item.name;
        })
      }
    });
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getBrand() {
    this.selectAll = false;
    if (this.group_id && this.group_id != 'null') {
      this.apiService.getBrand({group_id: this.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.brands = data['data'];
        }
      });
    } else {
      this.brands = [];
    }
  }

  getProducts() {
    this.installations = [];
    this.originalData = [];
    if (this.group_id && this.group_id != 'null') {
      this.loader.start();
      this.apiService.getProductSalesRate({group_id: this.group_id, brand_id: (this.brand_id == 'null') ? null : this.brand_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
          this.products.forEach((item) => {
            this.installations.push({
              product_category: item.category.name,
              model_no: item.model_no,
              product_code: item.product_code,
              hsn_code: item.hsn_code,
              is_itc: item.is_itc,
              itc_rate: item.itc_rate,
              itc_gst_rate: item.itc_gst_rate,
              itc_hsncode: item.itc_hsncode,
              is_handling_charge: item.is_handling_charge,
              handling_charge_rate: item.handling_charge_rate,
              handling_charge_gst: item.handling_charge_gst,
              handling_charge_hsn: item.handling_charge_hsn,
              source_id: item.source_id,
              extended_warranty: item.extended_warranty,
              extended_warranty_rate: item.extended_warranty_rate,
              extended_warranty_yearly_increment: item.extended_warranty_yearly_increment,
              sc_rate: item.sc_rate,
              sc_rate_comprehensive_rate: item.sc_rate_comprehensive_rate,
              sc_rate_comprehensive_yearly_increment: item.sc_rate_comprehensive_yearly_increment,
              sc_rate_non_comprehensive_rate: item.sc_rate_non_comprehensive_rate,
              sc_rate_non_comprehensive_yearly_increment: item.sc_rate_non_comprehensive_yearly_increment,
              product_id: item.id,
              purchase_rate: item.purchase_rate,
              mrp_rate: item.max_retail_price,
              msp_rate: item.max_selling_price,
              gst_rate: item.gst_rate,
              sale_gst: item.sale_gst,
              max_profit: item.matrix.max_profit,
              msp_profit: item.matrix.msp_profit,
            });
          });
          this.originalData = JSON.parse(JSON.stringify(this.installations));
        }
        this.loader.stop();
      });
    }
  }

  showEditModal() {
    this.editForm.reset();
    this.singleMode = false;
    let items = this.installations.filter((item) => { return (item.checked == true) });
    if (items.length == 1) {
      this.singleMode = true;
      let rows = this.originalData.filter((item) => { return (item.product_id == items[0].product_id) });
      if(rows.length) {
        let row = rows[0];
        if (row.source_id) {
          // this.editForm.controls.is_source_id.setValue(true);
          this.editForm.controls.source_id.setValue(row.source_id);
        }
        if (row.purchase_rate) {
          this.editForm.controls.is_purchase_rate.enable();
          // this.editForm.controls.is_purchase_rate.setValue(true);
          this.editForm.controls.purchase_rate.setValue(row.purchase_rate);
        }
        if (row.gst_rate) {
          this.editForm.controls.is_gst.enable();
          // this.editForm.controls.is_gst.setValue(true);
          this.editForm.controls.gst_rate.setValue(row.gst_rate);
        }
        if (row.sale_gst) {
          this.editForm.controls.is_sale_gst.enable();
          // this.editForm.controls.is_sale_gst.setValue(true);
          this.editForm.controls.sale_gst.setValue(row.sale_gst);
        }
        if (row.is_itc) {
          this.editForm.controls.is_itc_gst.enable();
          this.editForm.controls.is_itc_hsn.enable();
          if (row.itc_gst_rate) {
            // this.editForm.controls.is_itc_gst.setValue(true);
            this.editForm.controls.itc_gst.setValue(row.itc_gst_rate);
          }
          if (row.itc_hsncode) {
            // this.editForm.controls.is_itc_hsn.setValue(true);
            this.editForm.controls.itc_hsn.setValue(row.itc_hsncode);
          }
        } else {
          this.editForm.controls.is_itc_gst.disable();
          this.editForm.controls.is_itc_hsn.disable();
        }
        if (row.is_handling_charge) {
          this.editForm.controls.is_handling_gst.enable();
          this.editForm.controls.is_handling_hsn.enable();
          if (row.handling_charge_gst) {
            // this.editForm.controls.is_handling_gst.setValue(true);
            this.editForm.controls.handling_charge_gst.setValue(row.handling_charge_gst);
          }
          if (row.handling_charge_hsn) {
            // this.editForm.controls.is_handling_hsn.setValue(true);
            this.editForm.controls.handling_charge_hsn.setValue(row.handling_charge_hsn);
          }
        } else {
          this.editForm.controls.is_handling_gst.disable();
          this.editForm.controls.is_handling_hsn.disable();
        }
        if (row.extended_warranty) {
          this.editForm.controls.is_warranty_addon.enable();
          this.editForm.controls.is_warranty_factor.enable();
          if (row.extended_warranty_rate) {
            // this.editForm.controls.is_warranty_addon.setValue(true);
            this.editForm.controls.warranty_addon.setValue(row.extended_warranty_rate);
          }
          if (row.extended_warranty_yearly_increment) {
            // this.editForm.controls.is_warranty_factor.setValue(true);
            this.editForm.controls.warranty_factor.setValue(row.extended_warranty_yearly_increment);
          }
        } else {
          this.editForm.controls.is_warranty_addon.disable();
          this.editForm.controls.is_warranty_factor.disable();
        }
        if (row.sc_rate) {
          this.editForm.controls.is_comp_addon.enable();
          this.editForm.controls.is_comp_factor.enable();
          this.editForm.controls.is_non_comp_addon.enable();
          this.editForm.controls.is_non_comp_factor.enable();
          if (row.sc_rate_comprehensive_rate) {
            // this.editForm.controls.is_comp_addon.setValue(true);
            this.editForm.controls.comp_addon.setValue(row.sc_rate_comprehensive_rate);
          }
          if (row.sc_rate_comprehensive_yearly_increment) {
            // this.editForm.controls.is_comp_factor.setValue(true);
            this.editForm.controls.comp_factor.setValue(row.sc_rate_comprehensive_yearly_increment);
          }
          if (row.sc_rate_non_comprehensive_rate) {
            // this.editForm.controls.is_non_comp_addon.setValue(true);
            this.editForm.controls.non_comp_addon.setValue(row.sc_rate_non_comprehensive_rate);
          }
          if (row.sc_rate_non_comprehensive_yearly_increment) {
            // this.editForm.controls.is_non_comp_factor.setValue(true);
            this.editForm.controls.non_comp_factor.setValue(row.sc_rate_non_comprehensive_yearly_increment);
          }
        } else {
          this.editForm.controls.is_comp_addon.disable();
          this.editForm.controls.is_comp_factor.disable();
          this.editForm.controls.is_non_comp_addon.disable();
          this.editForm.controls.is_non_comp_factor.disable();
        }
      }
    } else {
      this.editForm.reset();
      this.editForm.controls.is_purchase_rate.enable();
      this.editForm.controls.is_gst.enable();
      this.editForm.controls.is_sale_gst.enable();
      this.editForm.controls.is_itc_gst.enable();
      this.editForm.controls.is_itc_hsn.enable();
      this.editForm.controls.is_handling_gst.enable();
      this.editForm.controls.is_handling_hsn.enable();
      this.editForm.controls.is_warranty_addon.enable();
      this.editForm.controls.is_warranty_factor.enable();
      this.editForm.controls.is_comp_addon.enable();
      this.editForm.controls.is_comp_factor.enable();
      this.editForm.controls.is_non_comp_addon.enable();
      this.editForm.controls.is_non_comp_factor.enable();
      this.setEnableDisable();
    }
    this.isEditModel = true;
  }

  setEnableDisable() {
    if (this.editForm.value.is_source_id) {
      this.editForm.controls.source_id.enable();
    } else {
      this.editForm.controls.source_id.disable();
    }
    if (this.editForm.value.is_purchase_rate) {
      this.editForm.controls.purchase_rate.enable();
    } else {
      this.editForm.controls.purchase_rate.disable();
    }
    if (this.editForm.value.is_gst) {
      this.editForm.controls.gst_rate.enable();
    } else {
      this.editForm.controls.gst_rate.disable();
    }
    if (this.editForm.value.is_sale_gst) {
      this.editForm.controls.sale_gst.enable();
    } else {
      this.editForm.controls.sale_gst.disable();
    }
    if (this.editForm.value.is_itc_gst) {
      this.editForm.controls.itc_gst.enable();
    } else {
      this.editForm.controls.itc_gst.disable();
    }
    if (this.editForm.value.is_itc_hsn) {
      this.editForm.controls.itc_hsn.enable();
    } else {
      this.editForm.controls.itc_hsn.disable();
    }
    if (this.editForm.value.is_handling_gst) {
      this.editForm.controls.handling_charge_gst.enable();
    } else {
      this.editForm.controls.handling_charge_gst.disable();
    }
    if (this.editForm.value.is_handling_hsn) {
      this.editForm.controls.handling_charge_hsn.enable();
    } else {
      this.editForm.controls.handling_charge_hsn.disable();
    }
    if (this.editForm.value.is_warranty_addon) {
      this.editForm.controls.warranty_addon.enable();
    } else {
      this.editForm.controls.warranty_addon.disable();
    }
    if (this.editForm.value.is_warranty_factor) {
      this.editForm.controls.warranty_factor.enable();
    } else {
      this.editForm.controls.warranty_factor.disable();
    }
    if (this.editForm.value.is_comp_addon) {
      this.editForm.controls.comp_addon.enable();
    } else {
      this.editForm.controls.comp_addon.disable();
    }
    if (this.editForm.value.is_comp_factor) {
      this.editForm.controls.comp_factor.enable();
    } else {
      this.editForm.controls.comp_factor.disable();
    }
    if (this.editForm.value.is_non_comp_addon) {
      this.editForm.controls.non_comp_addon.enable();
    } else {
      this.editForm.controls.non_comp_addon.disable();
    }
    if (this.editForm.value.is_non_comp_factor) {
      this.editForm.controls.non_comp_factor.enable();
    } else {
      this.editForm.controls.non_comp_factor.disable();
    }
    // this.productForm.controls.itc_rate.enable();
    // this.productForm.controls.itc_rate.setValidators([Validators.required])
    // this.productForm.controls.handling_charge_rate.clearValidators()
    // this.productForm.controls.itc_rate.updateValueAndValidity();  
  }

  confirmChange() {
    this.confirmModel = true;
  }

  updateInfo() {
    this.installations.forEach((item) => {
      if (item.checked) {
        if (this.editForm.value.is_purchase_rate && this.singleMode) {
          item.purchase_rate = this.editForm.value.purchase_rate;
        }
        if (this.editForm.value.is_purchase_rate && !this.singleMode) {
          item.purchase_rate = Number(item.purchase_rate) + Number((item.purchase_rate * this.editForm.value.purchase_rate) / 100);
          if (!this.editForm.value.is_source_id) {
            this.setRate(item);
          }
        }
        if (this.editForm.value.is_source_id) {
          item.source_id = this.editForm.value.source_id;
          if (this.defaultRate) {
            item.max_profit = this.defaultRate.max_profit;
            item.msp_profit = this.defaultRate.msp_profit;
            this.setRate(item);
          }
        }
        if (this.editForm.value.is_gst) {
          item.gst_rate = this.editForm.value.gst_rate;
        }
        if (this.editForm.value.is_sale_gst) {
          item.sale_gst = this.editForm.value.sale_gst;
        }

        if (this.editForm.value.is_itc_gst && item.is_itc) {
          item.itc_gst_rate = this.editForm.value.itc_gst;
        }
        if (this.editForm.value.is_itc_hsn && item.is_itc) {
          item.itc_hsncode = this.editForm.value.itc_hsn;
        }
        if (this.editForm.value.is_handling_gst && item.is_handling_charge) {
          item.handling_charge_gst = this.editForm.value.handling_charge_gst;
        }
        if (this.editForm.value.is_handling_hsn && item.is_handling_charge) {
          item.handling_charge_hsn = this.editForm.value.handling_charge_hsn;
        }
        if (this.editForm.value.is_warranty_addon && item.extended_warranty) {
          item.extended_warranty_rate = this.editForm.value.warranty_addon;
        }
        if (this.editForm.value.is_warranty_factor && item.extended_warranty) {
          item.extended_warranty_yearly_increment = this.editForm.value.warranty_factor;
        }
        if (this.editForm.value.is_comp_addon && item.sc_rate) {
          item.sc_rate_comprehensive_rate = this.editForm.value.comp_addon;
        }
        if (this.editForm.value.is_comp_factor && item.sc_rate) {
          item.sc_rate_comprehensive_yearly_increment = this.editForm.value.comp_factor;
        }
        if (this.editForm.value.is_non_comp_addon && item.sc_rate) {
          item.sc_rate_non_comprehensive_rate = this.editForm.value.non_comp_addon;
        }
        if (this.editForm.value.is_non_comp_factor && item.sc_rate) {
          item.sc_rate_non_comprehensive_yearly_increment = this.editForm.value.non_comp_factor;
        }
      }
    });
    this.confirmModel = false;
    this.isEditModel = false;
  }

  getDiscountMatrix() {
    this.apiService.getDiscountMatrix({source_id: this.editForm.value.source_id}).subscribe(data => {
      if (data && data['status'] == 1 && data['data']) {
        this.defaultRate = data['data'];
      }
    });
  }

  getMatrix(item: any) {
    this.apiService.getDiscountMatrix({source_id: item.source_id}).subscribe(data => {
      if (data && data['status'] == 1 && data['data']) {
        item.max_profit = data['data'].max_profit;
        item.msp_profit = data['data'].msp_profit;
        this.setRate(item);
      }
    });
  }

  setRate(item: any) {
    if (item.purchase_rate) {
      let mrp_rate = parseFloat(item.purchase_rate) + ((item.purchase_rate * item.max_profit) / 100);
      let msp_rate = parseFloat(item.purchase_rate) + ((item.purchase_rate * item.msp_profit) / 100);
      item.mrp_rate = mrp_rate;
      item.msp_rate = msp_rate;
    }
  }

  selectAllChk() {
    if (this.installations.length) {
      for(var r in this.installations) {
        this.installations[r].checked = this.selectAll;
      }
      this.isChecked = this.selectAll;
    }
  }

  checkUncheck() {
    let rows = this.installations.filter((item:any) => { return (item.checked == true); })
    this.selectAll = (rows.length == this.installations.length);
    if (rows.length) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  resetForm() {
    this.group_id = null;
    this.brand_id = null;
    this.isChecked = false;
    this.selectAll = false;
    this.installations = [];
    this.originalData = [];
  }

  saveRate() {
    if (this.installations.length && this.group_id) {
      this.loader.start();
      this.apiService.saveSalesRate({ items: this.installations, group_id: this.group_id, brand_id: (this.brand_id == 'null') ? null : this.brand_id }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Sales Rate Data Submit Successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
        this.toastr.error('ERROR', 'Please enter valid data.');
        return;
    }
  }

}
