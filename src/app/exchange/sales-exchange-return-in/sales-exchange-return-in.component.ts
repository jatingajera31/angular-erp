import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-sales-exchange-return-in',
  templateUrl: './sales-exchange-return-in.component.html',
  styleUrls: ['./sales-exchange-return-in.component.css']
})
export class SalesExchangeReturnINComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showItemBox = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  productDetails : any[] = [];
  staffs : any[] = [];
  ExchangeDemands : any[] = [];
  clients : any[] = [];
  dispatchedDemands : any[] = [];
  deliver_items : any[] = [];
  delivered_products : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  coded_item: any = 'Coded';
  clientId: any = null;
  returnId: any = null;
  group_id: any = null;
  product_id: any = null;
  qr_code: any;
  qty: any;
  selectedModal: any;
  selectedProductIndex: any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      exchange_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      exchange_dispatch_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      store_in_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      return_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      noticed_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      exchange_return_date: new FormControl(null, [Validators.required]),
      exchange_return_time: new FormControl(null, [Validators.required]),
      exchange_return_no: new FormControl(null, [Validators.required]),
      t_exchange_return_date: new FormControl(null),
      project_id: new FormControl(null),
      client: new FormControl(null),
      location: new FormControl(null),
      project: new FormControl(null),
      exchange_no: new FormControl(null),
      exchange_date: new FormControl(null),
      exchange_time: new FormControl(null),
      approved_by: new FormControl(null),
      status_date: new FormControl(null),
      status_time: new FormControl(null),
      remarks: new FormControl(null)
    });
    this.getStaff();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#exchange_return_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.exchange_return_date.setValue(date);
        this.purchaseForm.controls.t_exchange_return_date.setValue(e.format());
      });
      $("#exchange_return_date").mask('00/00/0000');

      $('#exchange_return_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.exchange_return_time.setValue(this.getTimes(time));
        }
      });

    }, 1000);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  changeDate(field: any, iField: any) {
    if (this.purchaseForm.value[field]) {
      let d = this.makeDate(this.purchaseForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.purchaseForm.controls[iField].setValue(date);
    }
  }

  makeDate(tarik: string) {
    if (tarik) {
      let t = tarik.split('/');
      return t[1] + '/' + t[0] + '/' + t[2];
    } else {
      return null;
    }
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getEditClients() {
    this.apiService.editClients({page: 'ddd'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  // getExchangeDemand(status: string) {
  //   this.loader.start();
  //   this.apiService.getExchangeDemand({status: status}).subscribe(data => {
  //     this.loader.stop();
  //     if (data && data['status'] == 1) {
  //       this.ExchangeDemands = data['data'];
  //     }
  //   });
  // }

  getExchangeDispatch() {
    this.loader.start();
    this.apiService.getExchangeDispatch({status: 'Pending'}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.ExchangeDemands = data['data'];
      }
    });
  }

  getExchangeReturn() {
    if (this.isNotValid(this.clientId)) {
      return;
    }
    this.loader.start();
    this.apiService.getExchangeReturn({client_id: this.clientId}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.dispatchedDemands = data['data'];
      }
    });
  }

  getExchangeReturnNo() {
    if (this.purchaseForm.value.client_id && this.createMode) {
      this.loader.start();
      this.apiService.getExchangeReturnNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.exchange_return_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }
  }

  setRow(item: any) {
    this.purchaseForm.controls.exchange_dispatch_id.setValue(item.id);
    this.purchaseForm.controls.exchange_id.setValue(item.exchange.id);
    this.purchaseForm.controls.client_id.setValue(item.client_id);
    this.purchaseForm.controls.location_id.setValue(item.location_id);
    this.purchaseForm.controls.project_id.setValue(item.project_id);
    let project = (item.project) ? item.project.name: '';
    this.purchaseForm.controls.client.setValue(item.client.account_name);
    this.purchaseForm.controls.location.setValue(item.location.name);
    this.purchaseForm.controls.project.setValue(project);
    this.purchaseForm.controls.exchange_no.setValue(item.exchange.exchange_no);
    this.purchaseForm.controls.exchange_date.setValue(item.exchange.exchange_date);
    this.purchaseForm.controls.exchange_time.setValue(item.exchange.exchange_time);
    this.getExchangeReturnNo();
    this.showExchangeDispatch();
  }

  showExchangeDispatch() {
    this.loader.start();
    this.apiService.showExchangeDispatch({id: this.purchaseForm.value.exchange_dispatch_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1 && data['data']) {
        this.purchaseForm.patchValue(data['data']);
        this.delivered_products = data['data']['details'];
        this.delivered_products.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
        });
        if (data['data']['exchange_return_date']) {
          $("#exchange_return_date").datepicker('setDate', new Date(data['data']['exchange_return_date']));
        }
        if (data['exchange']) {
          let project = (data['exchange'].project) ? data['exchange'].project.name: '';
          this.purchaseForm.controls.client.setValue(data['exchange'].client.account_name);
          this.purchaseForm.controls.location.setValue(data['exchange'].location.name);
          this.purchaseForm.controls.project.setValue(project);
          this.purchaseForm.controls.exchange_no.setValue(data['exchange'].exchange_no);
          this.purchaseForm.controls.exchange_date.setValue(data['exchange'].exchange_date);
          this.purchaseForm.controls.exchange_time.setValue(data['exchange'].exchange_time);
        }
      }
      this.purchaseForm.controls.id.setValue(null);
    });
  }

  showExchangeReturn() {
    this.loader.start();
    this.apiService.showExchangeReturn({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1 && data['data']) {
        this.purchaseForm.patchValue(data['data']);
        this.delivered_products = data['data']['details'];
        this.delivered_products.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
        });
        if (data['data']['exchange_return_date']) {
          $("#exchange_return_date").datepicker('setDate', new Date(data['data']['exchange_return_date']));
        }
        if (data['exchange']) {
          let project = (data['exchange'].project) ? data['exchange'].project.name: '';
          this.purchaseForm.controls.client.setValue(data['exchange'].client.account_name);
          this.purchaseForm.controls.location.setValue(data['exchange'].location.name);
          this.purchaseForm.controls.project.setValue(project);
          this.purchaseForm.controls.exchange_no.setValue(data['exchange'].exchange_no);
          this.purchaseForm.controls.exchange_date.setValue(data['exchange'].exchange_date);
          this.purchaseForm.controls.exchange_time.setValue(data['exchange'].exchange_time);
        }
      }
    });
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.delivered_products = [];
    this.productDetails = [];
    this.ExchangeDemands = [];
    this.showItemBox = false;
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getExchangeDispatch();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.exchange_return_date.setValue(date);
    $("#exchange_return_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.exchange_return_time.setValue(tims);
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.editMode = true;
    this.getEditClients();
  }

  getModels() {
    if (!this.isNotValid(this.group_id)) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getProductQrCode(prod: any, i: any) {
    if (prod.return_qr_code) {
      this.loader.start();
      this.apiService.getProductQrCode({qr_code: prod.return_qr_code}).subscribe(data => {
        if (data && data['data']) {
          if (data['data']['item']['product_id'] != prod.product_id) {
            let itesm = data['products'].filter((ite: any) => { return (ite.id == data['data']['item']['product_id']) });
            if (itesm.length) {
              this.toastr.error('Sorry Gentleman !', 'This is not ' + prod.product.model_no + ', it is ' + itesm[0].model_no);
            } else {
              this.toastr.error('Sorry Gentleman !', 'This is not ' + prod.product.model_no);
            }
            prod.return_qr_code = null;
          } else {
            this.toastr.info('Hello, Gentleman!', 'QR Code is for ' + prod.product.model_no + ' only you can proceed further.');
          }
        } else {
          this.toastr.error('Sorry Gentleman !', prod.return_qr_code + ' QR-Code item did not found.');
          prod.return_qr_code = null;
        }
        this.loader.stop();
      });
    }
  }

  viewProductDetailModal(prod: any) {
    this.loader.start();
    this.apiService.viewProduct({id: prod.product_id}).subscribe(data => {
      this.selectedModal = data['data'];
      if (this.selectedModal.photo) {
        this.productImage = this.selectedModal.photo;
      }
      this.showProductDetailModal = true;
      this.loader.stop();
    });
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    let row = this.delivered_products[this.selectedProductIndex];
    this.productDetails.forEach((item: any) => {
      if (item.product_id == row.product_id && item.group_id == row.group_id) {
        item.pending_qty = item.pending_qty + row.qty;
      }
    });

    this.delivered_products.splice(this.selectedProductIndex, 1);
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.delivered_products.length) {
      this.delivered_products.forEach((item) => {
        if (this.isNotValid(item.return_qr_code)) {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid Return QR Code.');
        return;
      }
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.products = this.delivered_products;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateExchangeReturn(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replate Return Detail Changed Successfully');
          this.closeForm();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveExchangeReturn(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replate Return Detail Changed Successfully');
          this.closeForm();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  showData() {
    if (this.isNotValid(this.clientId) || this.isNotValid(this.returnId)) {
      return
    }
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.id.setValue(this.returnId);
    this.showEditModal = false;
    this.showExchangeReturn();
    this.clientId = null;
    this.returnId = null;
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Exchange Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Exchange Demand.');
    } else {
      this.loader.start();
      this.apiService.deleteExchangeDemand({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Exchange Demand deleted successfully.'); 
        }
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }
}