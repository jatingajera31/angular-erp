import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-replace-receipt',
  templateUrl: './replace-receipt.component.html',
  styleUrls: ['./replace-receipt.component.css']
})
export class ReplaceReceiptComponent implements OnInit {

  purchaseForm: FormGroup;
  prodForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  showAddItemModal = false;
  showDeliveredModal = false;
  skipConfirmReturn = false;
  showConfirmReturn = false;
  showDiffProdModal = false;
  staffs : any[] = [];
  suppliers : any[] = [];
  purchaseDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  ReplaceReceipts : any[] = [];
  ReplaceDemands : any[] = [];
  ReplaceReturns : any[] = [];
  transportList : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  TransportName:any;
  productImage = './assets/images/product.jpg';
  latestQrCode:any = {
    qr_code: null,
    code: 0,
    year: 0
  };
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      replace_receipt_no: new FormControl(null, Validators.required),
      replace_demand_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      replace_return_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      return_date: new FormControl(null, Validators.required),
      return_time: new FormControl(null, Validators.required),
      m_received_date: new FormControl(null, Validators.required),
      m_received_time: new FormControl(null, Validators.required),
      received_by: new FormControl(null, Validators.required),
      stage_of_purchase: new FormControl(null, Validators.required),
      challan_no: new FormControl(null, Validators.required),
      challan_date: new FormControl(null, Validators.required),
      no_of_cartons: new FormControl(null),
      transporter_id: new FormControl(null),
      docket_no: new FormControl(null),
      dispatch_date: new FormControl(null),
      t_return_date: new FormControl(null),
      t_m_received_date: new FormControl(null),
      t_challan_date: new FormControl(null),
      t_dispatch_date: new FormControl(null),
      exchange_date: new FormControl(null),
      exchange_time: new FormControl(null),
      remarks: new FormControl(null),
    });
    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      description: new FormControl(null),
      product_code: new FormControl(null),
      hsn_code: new FormControl(null),
      category_name: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      warranty: new FormControl(null),
      warranty_date: new FormControl(null),
      serial_no: new FormControl(null),
      mac_address: new FormControl(null),
      invoice_no: new FormControl(null),
      return_date: new FormControl(null),
      problem: new FormControl(null)
    });
    this.getStaff();
    this.getTransport();
    this.getProductGroup();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#dispatch_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.dispatch_date.setValue(date);
        this.purchaseForm.controls.t_dispatch_date.setValue(e.format());
      });
      $( "#m_received_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.m_received_date.setValue(date);
        this.purchaseForm.controls.t_m_received_date.setValue(e.format());
      });
      $( "#challan_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.challan_date.setValue(date);
        this.purchaseForm.controls.t_challan_date.setValue(e.format());
      });
      $("#dispatch_date").mask('00/00/0000');

      $('#m_received_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.m_received_time.setValue(this.getTimes(time));
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

  getLatestQrCode() {
    this.apiService.getLatestQrCode({}).subscribe(data => {
      if (data && data['data']) {
        this.latestQrCode = data['data'];
      }

      let qrCode = parseInt(this.latestQrCode.code);
      qrCode = qrCode + 1;
      let text = "0000" + qrCode;
      let result = text.substr(text.length - 5);
      let qr_code = result + '' + this.datePipe.transform(new Date(), 'yyMMdd');
      this.prodForm.controls.qr_code.setValue(qr_code)
    });
  }

  changeStage() {
    if (this.purchaseForm.value.stage_of_purchase == 'After faulty item returned') {
      this.purchaseForm.controls.replace_demand_id.disable();
      this.purchaseForm.controls.replace_demand_id.clearValidators();
      this.purchaseForm.controls.replace_return_id.enable();
      this.purchaseForm.controls.replace_return_id.setValidators([Validators.required]);
      this.purchaseForm.controls.no_of_cartons.setValidators([Validators.required]);
      this.purchaseForm.controls.transporter_id.setValidators([Validators.required]);
      this.purchaseForm.controls.docket_no.setValidators([Validators.required]);
      this.purchaseForm.controls.dispatch_date.setValidators([Validators.required]);
      this.purchaseForm.controls.challan_no.clearValidators();
      this.purchaseForm.controls.challan_date.clearValidators();
    } else {
      this.purchaseForm.controls.replace_demand_id.enable();
      this.purchaseForm.controls.replace_demand_id.setValidators([Validators.required]);
      this.purchaseForm.controls.no_of_cartons.clearValidators();
      this.purchaseForm.controls.transporter_id.clearValidators();
      this.purchaseForm.controls.docket_no.clearValidators();
      this.purchaseForm.controls.dispatch_date.clearValidators();
      this.purchaseForm.controls.replace_return_id.clearValidators();
      this.purchaseForm.controls.replace_return_id.disable();
      this.purchaseForm.controls.challan_no.setValidators([Validators.required]);
      this.purchaseForm.controls.challan_date.setValidators([Validators.required]);
    }
    this.purchaseForm.controls.replace_demand_id.updateValueAndValidity();
    this.purchaseForm.controls.replace_return_id.updateValueAndValidity();
    this.purchaseForm.controls.no_of_cartons.updateValueAndValidity();
    this.purchaseForm.controls.transporter_id.updateValueAndValidity();
    this.purchaseForm.controls.docket_no.updateValueAndValidity();
    this.purchaseForm.controls.dispatch_date.updateValueAndValidity();
    this.purchaseForm.controls.challan_no.updateValueAndValidity();
    this.purchaseForm.controls.challan_date.updateValueAndValidity();
  }

  getTransport() {
    this.apiService.getTransport({}).subscribe(data => {
        this.transportList = data['data'];
    });
  }

  showReplaceReturn() {
    if (!this.isNotValid(this.purchaseForm.value.replace_return_id)) {
      this.loader.start();
      this.apiService.showReplaceReturn({id: this.purchaseForm.value.replace_return_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseDetails = data['data']['details'];
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
            item.product_code = item.product.product_code;
            item.hsn_code = item.product.hsn_code;
          })
          if (data['data']['return_date']) {
            this.purchaseForm.controls.exchange_time.setValue(data['data']['return_time'])
            this.purchaseForm.controls.exchange_date.setValue(data['data']['return_date'])
            this.purchaseForm.controls.no_of_cartons.setValue(data['data']['no_of_cartons'])
            this.purchaseForm.controls.transporter_id.setValue(data['data']['transporter_id'])
            this.purchaseForm.controls.docket_no.setValue(data['data']['docket_no'])
            this.purchaseForm.controls.dispatch_date.setValue(data['data']['dispatch_date'])
            $("#exchange_date").datepicker("setDate", new Date(data['data']['return_date']));
          }
          if (data['data']['dispatch_date']) {
            $("#dispatch_date").datepicker("setDate", new Date(data['data']['dispatch_date']));
          }
        }
        this.loader.stop();
      });
    }
  }

  showReplaceDemand() {
    if (!this.isNotValid(this.purchaseForm.value.replace_demand_id)) {
      this.loader.start();
      this.apiService.showReplaceDemand({id: this.purchaseForm.value.replace_demand_id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseDetails = data['data']['details'];
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
            item.product_code = item.product.product_code;
            item.hsn_code = item.product.hsn_code;
          })
          if (data['data']['exchange_date']) {
            this.purchaseForm.controls.exchange_date.setValue(data['data']['exchange_date']);
            this.purchaseForm.controls.exchange_time.setValue(data['data']['exchange_time']);
          }
        }
        this.loader.stop();
      });
    }
  }

  getReplaceDemand() {
    if (this.purchaseForm.value.supplier_id && this.purchaseForm.value.stage_of_purchase == 'Before faulty item returned') {
      this.apiService.getReplaceDemand({supplier_id: this.purchaseForm.value.supplier_id, is_received: this.createMode}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceDemands = data['data'];
          if (!this.isNotValid(this.purchaseForm.value.replace_demand_id)) {
            this.ReplaceDemands.forEach((item) => {
              if (item.id == this.purchaseForm.value.replace_demand_id) {
                this.purchaseForm.controls.exchange_date.setValue(item['exchange_date']);
                this.purchaseForm.controls.exchange_time.setValue(item['exchange_time']);
              }
            })
          }
        }
      });
    } else {
      this.ReplaceDemands = [];
    }
  }

  getReplaceReturn() {
    if (this.purchaseForm.value.supplier_id && this.purchaseForm.value.stage_of_purchase == 'After faulty item returned') {
      this.apiService.getReplaceReturn({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceReturns = data['data'];
        }
      });
    } else {
      this.ReplaceReturns = [];
    }
  }

  getReplaceReceipt() {
    if (!this.isNotValid(this.clientId)) {
      this.apiService.getReplaceReceipt({supplier_id: this.clientId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceReceipts = data['data'];
        }
      });
    } else {
      this.ReplaceReceipts = [];
    }
  }

  getProductGroup() {
    this.apiService.getProductGroup({coded_item: 'Non-Coded'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
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

  getSupplier() {
    this.apiService.editSuppliers({page: 'rprcpt', 'replace_receipt': 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'rprcpt'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getReplaceReceiptNo() {
    if (this.purchaseForm.value.supplier_id && this.createMode) {
      this.loader.start();
      this.apiService.getReplaceReceiptNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.replace_receipt_no.setValue(this.demandNo);
        }
        this.loader.stop();
      });
    }
  }

  resetForm() {
    this.purchaseDetails = [];
    if (this.editMode) {
      this.demandId = this.purchaseForm.value.id;
      this.showData();
    } else {
      this.purchaseForm.reset();
    }
  }

  closeForm() {
    this.purchaseDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getSupplier();
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.return_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.return_time.setValue(tims);
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getEditSuppliers();
  }

  editRow(prod: any, i: any) {
    if (this.isNotValid(prod.qr_code)) {
      this.prodForm.controls.qty.setValue(prod.qty);
      this.prodForm.controls.qr_code.setValue(0);
    } else {
      this.prodForm.controls.qty.setValue(1);
      this.prodForm.controls.group_id.setValue(prod.group_id);
      if (prod.is_purchased != 1) {
        this.getModels();
      }
      // this.getCodedNonCoded();
    }

    if (prod.is_purchased == 1) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
          setTimeout(() => {
            this.prodForm.patchValue(prod);
            this.prodForm.controls.product_id.setValue(prod.purchase_product_id);
            this.prodForm.controls.qr_code.setValue(prod.purchase_qr_code);
            this.prodForm.controls.mac_address.setValue(prod.purchase_mac_address);
            this.prodForm.controls.serial_no.setValue(prod.purchase_serial_no);
            this.prodForm.controls.hsn_code.setValue(prod.purchase_hsn_code);
            for(var r in this.products) {
              if (this.products[r].id == this.prodForm.value.product_id) {
                this.prodForm.controls.product_code.setValue(this.products[r].product_code);
                this.prodForm.controls.category_name.setValue(this.products[r].category.name);
                if (this.products[r].mac_address) {
                  this.prodForm.controls.mac_address.enable();
                } else {
                  this.prodForm.controls.mac_address.disable();
                }
                if (this.products[r].serial_no) {
                  this.prodForm.controls.serial_no.enable();
                } else {
                  this.prodForm.controls.serial_no.disable();
                }
              }
            }
            if (this.isNotValid(prod.qr_code)) {
              this.prodForm.controls.qr_code.setValue(0);
            }
          },200)
        }
        this.loader.stop();
      });
    }
    this.selectedModal = prod;
    this.selectedProductIndex = i;
    this.invalidForm = false;
    this.showAddItemModal = true;
  }

  closeItemModal() {
    this.prodForm.reset();
    this.showAddItemModal = false;
  }

  addItem() {
    this.invalidForm = false;
    if (this.prodForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.selectedModal.product_id == this.prodForm.value.product_id) {
      this.updateRow();
    } else {
      this.showDiffProdModal = true;
    }
  }

  updateRow() {
    this.showAddItemModal = false;
    this.purchaseDetails[this.selectedProductIndex].purchase_product_id = this.prodForm.value.product_id;  
    this.purchaseDetails[this.selectedProductIndex].purchase_qr_code = this.prodForm.value.qr_code;  
    this.purchaseDetails[this.selectedProductIndex].purchase_serial_no = this.prodForm.value.serial_no;  
    this.purchaseDetails[this.selectedProductIndex].purchase_mac_address = this.prodForm.value.mac_address;  
    this.purchaseDetails[this.selectedProductIndex].purchase_hsn_code = this.prodForm.value.hsn_code;  
    this.purchaseDetails[this.selectedProductIndex].is_purchased = 1;  
    this.prodForm.reset();
  }

  clearItem() {
    this.prodForm.reset();
    if (!this.selectedModal.qr_code) {
      this.prodForm.controls.qr_code.setValue(0);
    }
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.purchaseDetails.splice(this.selectedProductIndex, 1);
  }

  getModels() {
    if (this.prodForm.value.group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.prodForm.value.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getCodedNonCoded() {
    this.loader.start();
    this.apiService.getCodedNonCoded({qr_code: 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.products = data['data'];
      }
      this.loader.stop();
    });
  }

  changeModel() {
    if (this.prodForm.value.product_id) {
      for(var r in this.products) {
        if (this.products[r].id == this.prodForm.value.product_id) {
          this.prodForm.controls.group_id.setValue(this.products[r].group_id);
          this.prodForm.controls.product_name.setValue(this.products[r].model_no);
          this.prodForm.controls.description.setValue(this.products[r].category_name);
          this.prodForm.controls.warranty.setValue(this.products[r].extended_warranty);
          this.prodForm.controls.product_code.setValue(this.products[r].product_code);
          this.prodForm.controls.hsn_code.setValue(this.products[r].hsn_code);
          this.prodForm.controls.category_name.setValue(this.products[r].category.name);
          if (this.products[r].mac_address) {
            this.prodForm.controls.mac_address.enable();
          } else {
            this.prodForm.controls.mac_address.disable();
          }
          if (this.products[r].serial_no) {
            this.prodForm.controls.serial_no.enable();
          } else {
            this.prodForm.controls.serial_no.disable();
          }
          // this.mac_address = this.products[r].mac_address;
          // this.serial_no = this.products[r].mac_address;
          // if (this.products[r].extended_warranty == '1') {
            // let extended_month = this.products[r].extended_month;
            // let challan_date = new Date(this.purchaseForm.value.exchange_date_time);
            // let challan_date = new Date();
            // let date = new Date(challan_date.setMonth(challan_date.getMonth() + Number(extended_month)));
            // let warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
            // this.prodForm.controls.warranty_date.setValue(warranty_date);
          // }
        }
      }
    }
  }

  getProductQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.loader.start();
      this.apiService.getProductQrCode({qr_code: this.prodForm.value.qr_code}).subscribe(data => {
        if (data && data['data']) {
          if (data['data']['item']['product_id'] != this.selectedModal.product_id) {
            let itesm = data['products'].filter((ite: any) => { return (ite.id == data['data']['item']['product_id']) });
            if (itesm.length) {
              this.toastr.error('Sorry Gentleman !', 'This is not ' + this.selectedModal['product_name'] + ', it is ' + itesm[0].model_no);
            } else {
              this.toastr.error('Sorry Gentleman !', 'This is not ' + this.selectedModal['product_name']);
            }
            this.prodForm.value.qr_code = null;
          } else {
            this.toastr.info('Hello, Gentleman!', 'QR Code is for ' + this.selectedModal['product_name'] + ' only you can proceed further.');
          }
        } else {
          this.toastr.error('Sorry Gentleman !', this.prodForm.value.qr_code + ' QR-Code item did not found.');
          this.prodForm.controls.qr_code.setValue(null);
        }
        this.loader.stop();
      });
    }
  }

  saveDelivered() {
    if (this.TransportName) {
      this.loader.start();
      this.apiService.saveTransport({name:this.TransportName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.transportList.push(data['data']);
          this.purchaseForm.controls.transporter_id.setValue(data['data'].id);
        }
        this.showDeliveredModal = false;
      });
    }
  }

  enableSave() {
    let items = this.purchaseDetails.filter((row) => { return (row.is_purchased == 1) });
    return (items.length > 0) ? false: true;
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.purchaseDetails.length) {
      let returnAll = 0;
      this.purchaseDetails.forEach((item) => {
        if (this.isNotValid(item.group_id)) {
          this.invalidForm = true;
        }
        if (this.isNotValid(item.product_id)) {
          this.invalidForm = true;
        }
        if (this.isNotValid(item.qty)) {
          this.invalidForm = true;
        }
        if (item.is_purchased == 1) {
          returnAll++;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid product details.');
        return;
      }
      if (!this.skipConfirmReturn && returnAll != this.purchaseDetails.length) {
        this.showConfirmReturn = true;
        return;
      }
    } else {
      this.toastr.error('ERROR', 'Please enter product details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.products = JSON.parse(JSON.stringify(this.purchaseDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateReplaceReceipt(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace Receipt details update successfully.');
          this.closeForm();
          this.purchaseDetails = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveReplaceReceipt(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace Receipt details saved successfully.');
          this.closeForm();
          this.purchaseDetails = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Replace Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Replace Demand.');
    } else {
      this.loader.start();
      this.apiService.deleteReplaceReceipt({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Replace Demand deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    if (!this.isNotValid(this.demandId)) {
      this.loader.start();
      this.apiService.showReplaceReceipt({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.purchaseDetails = data['data']['details'];
          this.showEditModal = false;
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
            item.product_code = item.product.product_code;
            item.hsn_code = item.product.hsn_code;
          })
          if (data['data']['dispatch_date']) {
            $("#dispatch_date").datepicker("setDate", new Date(data['data']['dispatch_date']));
          }
          if (data['data']['m_received_date']) {
            $("#m_received_date").datepicker("setDate", new Date(data['data']['m_received_date']));
          }
          if (data['data']['challan_date']) {
            $("#challan_date").datepicker("setDate", new Date(data['data']['challan_date']));
          }
          if (data['data']['dispatch_date']) {
            $("#dispatch_date").datepicker("setDate", new Date(data['data']['dispatch_date']));
          }
        }
        this.loader.stop();
        this.demandId = null;
        this.clientId = null;
        this.getReplaceDemand();
        this.getReplaceReturn();
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
