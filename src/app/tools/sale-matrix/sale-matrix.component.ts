import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sale-matrix',
  templateUrl: './sale-matrix.component.html',
  styleUrls: ['./sale-matrix.component.css']
})
export class SaleMatrixComponent implements OnInit {

  invalidForm = false;
  showPreview = false;
  rateForm: FormGroup;
  purchaseSources : any[] = [];
  rates : any[] = [];
  defaultRate: any;
  msp_profit: any;
  sourceName: any;
  purchaseRate: any;
  maxUnitRate: any;
  maxUnitdiscount: any;
  maxExUnitRate: any;
  maxExUnitdiscount: any;
  maxMgUnitRate: any;
  maxMgUnitdiscount: any;
  maxPrUnitRate: any;
  maxPrUnitdiscount: any;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.rateForm = this.fb.group({
      source_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      max_profit: new FormControl(null, Validators.required),
    });
    this.loadDefaultData('Standard');
    this.loadDefaultData('Executive');
    this.loadDefaultData('Manager');
    this.loadDefaultData('Project');
    this.getPurchaseSources();
    this.getDiscount();
  }

  ngOnInit(): void {

  }

  resetForm() {
    this.rateForm.reset();
    this.rates = [];
    this.loadDefaultData('Standard');
    this.loadDefaultData('Executive');
    this.loadDefaultData('Manager');
    this.loadDefaultData('Project');
  }

  viewPreview() {
    this.showPreview = true;
  }

  viewResult() {
    if (this.purchaseRate) {
      this.maxUnitRate = this.purchaseRate + ((this.purchaseRate * this.rates[0].profit_margin_discount) / 100);
      this.maxExUnitRate = this.purchaseRate + ((this.purchaseRate * this.rates[1].profit_margin_discount) / 100);
      this.maxMgUnitRate = this.purchaseRate + ((this.purchaseRate * this.rates[2].profit_margin_discount) / 100);
      this.maxPrUnitRate = this.purchaseRate + ((this.purchaseRate * this.rates[3].profit_margin_discount) / 100);
      
      this.maxUnitdiscount = 100 - ((this.maxUnitRate * 100) / this.maxUnitRate);
      this.maxExUnitdiscount = 100 - ((this.maxExUnitRate * 100) / this.maxUnitRate);
      this.maxMgUnitdiscount = 100 - ((this.maxMgUnitRate * 100) / this.maxUnitRate);
      this.maxPrUnitdiscount = 100 - ((this.maxPrUnitRate * 100) / this.maxUnitRate);
    }
  }

  loadDefaultData(type: string) {
    this.rates.push({
      discount_type: type,
      discount_on_profit: 0,
      max_discount_on_profit: 0,
      max_discount_on_margin: 0,
      profit_margin_discount: 0
    });
  }

  getPurchaseSources() {
    this.apiService.getPurchaseSources({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchaseSources = data['data'];
      }
    });
  }

  getDiscount() {
    this.apiService.getDiscount({}).subscribe(data => {
      if (data && data['status'] == 1 && data['data']) {
        this.defaultRate = data['data'];
      }
    });
  }

  getDiscountMatrix() {
    if (this.rateForm.value.source_id) {
      this.loader.start();
      this.apiService.getDiscountMatrix({source_id: this.rateForm.value.source_id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.rateForm.patchValue(data['data']);
        } else {
          this.rateForm.controls.max_profit.setValue(null);
        }
        let item = this.purchaseSources.filter((item) => { return (item.id == this.rateForm.value.source_id) })
        if (item.length) {
          this.sourceName = item[0].name;
        }
        this.setRate();
        this.calculateRate();
        this.loader.stop();
      });
    } else {
      this.rateForm.controls.max_profit.setValue(null);
    }
  }

  setRate() {
    this.rates[0].discount_on_profit = this.defaultRate['standard_discount'];
    this.rates[1].discount_on_profit = this.defaultRate['executive_discount'];
    this.rates[2].discount_on_profit = this.defaultRate['manager_discount'];
    this.rates[3].discount_on_profit = this.defaultRate['project_discount'];
  }

  saveRate() {
    this.invalidForm = false;
    if (this.rateForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid discount.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.rateForm.value));
    params.msp_profit = this.msp_profit;
    this.loader.start();
    this.apiService.saveDiscountMatrix(params).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'Sale Data Submit Successfully.');
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
    });
  }

  calculateRate() {
    this.rates[0].profit_margin_discount = (this.rateForm.value.max_profit) ? this.rateForm.value.max_profit : 0;
    this.rates[1].max_discount_on_profit = parseFloat(this.rates[0]['max_discount_on_profit']) + parseFloat(this.rates[1].discount_on_profit);
    this.rates[2].max_discount_on_profit = parseFloat(this.rates[1]['max_discount_on_profit']) + parseFloat(this.rates[2].discount_on_profit);
    this.rates[3].max_discount_on_profit = parseFloat(this.rates[2]['max_discount_on_profit']) + parseFloat(this.rates[3].discount_on_profit);

    this.rates[1].max_discount_on_margin = (this.rates[0].profit_margin_discount * this.rates[1].max_discount_on_profit) / 100;
    this.rates[1].max_discount_on_margin = Math.floor(this.rates[1].max_discount_on_margin * 100) / 100;
    this.rates[1].profit_margin_discount = (this.rates[0].profit_margin_discount - this.rates[1].max_discount_on_margin);

    this.rates[2].max_discount_on_margin = (this.rates[0].profit_margin_discount * this.rates[2].max_discount_on_profit) / 100;
    this.rates[2].max_discount_on_margin = Math.floor(this.rates[2].max_discount_on_margin * 100) / 100;
    this.rates[2].profit_margin_discount = (this.rates[0].profit_margin_discount - this.rates[2].max_discount_on_margin);

    this.rates[3].max_discount_on_margin = (this.rates[0].profit_margin_discount * this.rates[3].max_discount_on_profit) / 100;
    this.rates[3].max_discount_on_margin = Math.floor(this.rates[3].max_discount_on_margin * 100) / 100;
    this.rates[3].profit_margin_discount = (this.rates[0].profit_margin_discount - this.rates[3].max_discount_on_margin);
    this.msp_profit = this.rates[3].profit_margin_discount;
    
  }

  toFixed(value: any) {
    if (value != null && value != undefined) {
      return value.toFixed(2);
    } else {
      return value;
    }
  }

}
