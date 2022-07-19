import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-purchase-rate',
  templateUrl: './purchase-rate.component.html',
  styleUrls: ['./purchase-rate.component.css']
})
export class PurchaseRateComponent implements OnInit {

  purchaseForm: FormGroup;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  viewModeModal = false;
  viewMode = false;
  clearMode = false;
  suppliers : any[] = [];
  staffs : any[] = [];
  purchases : any[] = [];
  productDetails : any[] = [];
  purchaseOrders : any[] = [];
  supplierId: any = null;
  purchaseId: any = null;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      purchase_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      remarks: new FormControl(null),
      item_amount: new FormControl(null),
      packing_amount: new FormControl(null),
      freight_amount: new FormControl(null),
      correction_amount: new FormControl(null),
      net_amount: new FormControl(null),
      invoice_amount: new FormControl(null),
      supplier_id: new FormControl(null),
      invoice_date: new FormControl(null),
      invoice_no: new FormControl(null),
      received_by: new FormControl(null),
      materials_received_date: new FormControl(null),
      purchase_no: new FormControl(null),
      due_date: new FormControl(null),
      due_days: new FormControl(),
      payment_done_date: new FormControl(null)
    });
    this.getStaff();
    this.getAllPurchaseOrder();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getAllPurchaseOrder() {
    this.apiService.getAllPurchaseOrder({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchaseOrders = data['data'];
      }
    });
  }

  getSupplier(mode: string) {
    this.apiService.editSuppliers({page: 'purc', purchase_rate: mode}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getPoInfo(prod: any) {
    if (prod.purchase_order_id || prod.purchase_order_id == '0') {
      if (prod.purchase_order_id == 'null') {
        prod.rate =0;
        prod.amount = 0;
        prod.gst_percentage = 0;
        prod.gst_amount = 0;
        prod.total_amount = 0;
        this.calculate();
        return;
      } else if (prod.purchase_order_id == '0') {
        prod.rate = prod.prmodel.purchase_rate;
        prod.amount = (prod.qty * prod.rate);
        prod.gst_percentage = prod.prmodel.gst_rate;
        prod.gst_amount = ((prod.qty * prod.rate) * Number(prod.gst_percentage)) / 100;
        prod.total_amount = Number(prod.amount) + Number(prod.gst_amount)
        this.calculate();
      } else {
        this.loader.start();
        this.apiService.getPurchaseOrderDetail({purchase_order_id: prod.purchase_order_id, group_id: prod.group_id, product_id: prod.product_id}).subscribe(data => {
          if (data['status'] == 1 && data['data']) {
            prod.rate = data['data']['rate'];
            prod.amount = (prod.qty * prod.rate);
            prod.gst_percentage = data['data']['gst_percentage'];
            prod.gst_amount = ((prod.qty * prod.rate) * Number(prod.gst_percentage)) / 100;
            prod.total_amount = Number(prod.amount) + Number(prod.gst_amount)
            this.calculate();
          }
          this.loader.stop();
        });
      }
    }
  }

  setRate(prod: any) {
    prod.amount = (prod.qty * prod.rate);
    prod.gst_amount = ((prod.qty * prod.rate) * Number(prod.gst_percentage)) / 100;
    prod.total_amount = Number(prod.amount) + Number(prod.gst_amount);
    this.calculate();
  }

  getPurchase(purchase_rate: string) {
    this.purchaseId = null;
    if (this.supplierId) {
      this.loader.start();
      this.apiService.getPurchase({supplier_id: this.supplierId, status: 'Purchased', purchase_rate: purchase_rate}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchases = data['data'];
        }
        this.loader.stop();
      });
    } else {
      this.purchases = [];
    }
  }

  showPurchase() {
    if (this.purchaseId) {
      this.loader.start();
      this.apiService.showPurchase({id: this.purchaseId, purchase_rate: 1}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.controls.remarks.setValue(data['data']['remarks']);
          this.purchaseForm.controls.invoice_amount.setValue(data['data']['invoice_amount']);
          this.purchaseForm.controls.supplier_id.setValue(data['data']['supplier_id']);
          this.purchaseForm.controls.invoice_date.setValue(data['data']['invoice_date']);
          this.purchaseForm.controls.invoice_no.setValue(data['data']['invoice_no']);
          this.purchaseForm.controls.received_by.setValue(data['data']['received_by']);
          this.purchaseForm.controls.materials_received_date.setValue(data['data']['materials_received_date']);
          this.purchaseForm.controls.purchase_no.setValue(data['data']['purchase_no']);
          this.purchaseForm.controls.purchase_id.setValue(data['data']['id']);
          this.purchaseForm.controls.due_days.setValue(45);
          let date = new Date(data['data']['invoice_date']);
          date.setDate(date.getDate() + 45);
          const ddate = this.datePipe.transform(date, 'yyyy-MM-dd');
          this.purchaseForm.controls.due_date.setValue(ddate);
          this.productDetails = data['data']['details'];
          this.productDetails.forEach((item, key) => {
              let sw = 'Not Applicable';
              let hsn = '';
              let product_code = '';
              if (item.prmodel.supplier_warranty > 0) {
                sw = item.prmodel.supplier_warranty + ' Months';
              }
              if (item.prmodel.hsn_code) {
                hsn = item.prmodel.hsn_code;
              }
              if (item.prmodel.product_code) {
                product_code = item.prmodel.product_code;
              }
              item.description = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
              item.tdescription = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;

              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
          });
          this.supplierId = null;
          this.purchaseId = null;
          setTimeout(() => {
            $('.purchase-rate-cn td[data-toggle="tooltip"]').tooltip({html: true,trigger: 'click'})
          }, 1000);
        }
        this.loader.stop();
      });

      this.apiService.showPurchaseRate({purchase_id: this.purchaseId}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.controls.id.setValue(data['data']['id']);
          this.purchaseForm.controls.item_amount.setValue(data['data']['item_amount']);
          this.purchaseForm.controls.packing_amount.setValue(data['data']['packing_amount']);
          this.purchaseForm.controls.freight_amount.setValue(data['data']['freight_amount']);
          this.purchaseForm.controls.correction_amount.setValue(data['data']['correction_amount']);
          this.purchaseForm.controls.net_amount.setValue(data['data']['net_amount']);
        }
      });
    }
  }

  closeForm() {
    this.editMode = false;
    this.viewMode = false;
    this.clearMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.suppliers = [];
    this.purchases = [];
  }

  viewRateMode() {
    this.viewMode = true;
    this.purchaseForm.reset();
    this.getSupplier('VIEW');
    this.viewModeModal = true;
  }

  viewClearMode() {
    this.clearMode = true;
    this.purchaseForm.reset();
    this.getSupplier('VIEW');
    this.viewModeModal = true;
  }
  
  viewEditMode() {
    this.getSupplier('EDIT');
    this.purchaseForm.reset();
    this.showEditModal = true;
  }

  saveInfo() {
    for(var r in this.purchaseForm.controls) {
      console.log(r, this.purchaseForm.controls[r].invalid)
    }
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.productDetails.length == 0) {
      this.toastr.error('ERROR', 'Please select atleast one product.');
      return
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.product_details = JSON.parse(JSON.stringify(this.productDetails));
    this.loader.start();
    this.apiService.savePurchaseRate(params).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'Purchase Rate saved successfully.');
        this.closeForm();
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
    });
  }

  clearInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Purchase.');
    }
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Purchase.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please select one rate.');
    } else {
      this.loader.start();
      this.apiService.deletePurchaseRate({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm();
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase Rate cleared successfully.'); 
        }
      });
    }
  }

  showData() {
    if (this.purchaseId) {
      this.showPurchase();
      this.editMode = true;
      this.showEditModal = false;
      this.viewModeModal = false;
    }
  }

  calculate() {
    let final_amount = 0;
    this.productDetails.forEach((item) => {
      if(!item.rate) {
        item.rate = 0;
      }
      if(!item.amount) {
        item.amount = 0;
      }
      if(!item.gst_percentage) {
        item.gst_percentage = 0;
      }
      if(!item.gst_amount) {
        item.gst_amount = 0;
      }
      if(!item.total_amount) {
        item.total_amount = 0;
      }
      final_amount += parseFloat(item.total_amount);
    });
    this.purchaseForm.controls.item_amount.setValue(final_amount);
    let net_amount = 0;
    if (this.purchaseForm.value.item_amount) {
      net_amount += parseFloat(this.purchaseForm.value.item_amount);
    }
    if (this.purchaseForm.value.packing_amount) {
      net_amount += parseFloat(this.purchaseForm.value.packing_amount);
    }
    if (this.purchaseForm.value.freight_amount) {
      net_amount += parseFloat(this.purchaseForm.value.freight_amount);
    }
    if (this.purchaseForm.value.correction_amount) {
      net_amount += parseFloat(this.purchaseForm.value.correction_amount);
    }
    this.purchaseForm.controls.net_amount.setValue(net_amount.toFixed(2));
  }

  calculateCorrection() {
    let net_amount = 0;
    if (this.purchaseForm.value.item_amount) {
      net_amount += parseFloat(this.purchaseForm.value.item_amount);
    }
    if (this.purchaseForm.value.packing_amount) {
      net_amount += parseFloat(this.purchaseForm.value.packing_amount);
    }
    if (this.purchaseForm.value.freight_amount) {
      net_amount += parseFloat(this.purchaseForm.value.freight_amount);
    }

    if (this.purchaseForm.value.net_amount) {
      let cr_amount = parseFloat(this.purchaseForm.value.net_amount) - net_amount;
      this.purchaseForm.controls.correction_amount.setValue(cr_amount.toFixed(2));
    }
  }

  toFixed(value: any) {
    return parseFloat(value).toFixed(2);
  }

}
