import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-replace-return',
  templateUrl: './replace-return.component.html',
  styleUrls: ['./replace-return.component.css']
})
export class ReplaceReturnComponent implements OnInit {

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
  isZero = false;
  staffs : any[] = [];
  suppliers : any[] = [];
  purchaseDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  ExchangeDemands : any[] = [];
  ReplaceDemands : any[] = [];
  ReplaceReceipts : any[] = [];
  ReplaceReturns : any[] = [];
  transportList : any[] = [];
  contactPersons : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  TransportName:any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      replace_return_no: new FormControl(null, Validators.required),
      replace_demand_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      replace_receipt_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      return_date: new FormControl(null, Validators.required),
      t_return_date: new FormControl(null),
      return_time: new FormControl(null, Validators.required),
      return_priority: new FormControl(null, Validators.required),
      no_of_cartons: new FormControl(null, Validators.required),
      transporter_id: new FormControl(null, Validators.required),
      docket_no: new FormControl(null, Validators.required),
      dispatch_date: new FormControl(null, Validators.required),
      t_dispatch_date: new FormControl(null),
      your_contact_person: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      contact_no: new FormControl(null, Validators.required),
      email_id: new FormControl(null, Validators.required),
      exchange_date: new FormControl(null),
      exchange_time: new FormControl(null)
    });
    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      description: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      warranty: new FormControl(null),
      warranty_date: new FormControl(null),
      serial_no: new FormControl(null),
      mac_address: new FormControl(null),
      invoice_no: new FormControl(null),
      return_date: new FormControl(null),
      problem: new FormControl(null, Validators.required)
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
      $("#dispatch_date").mask('00/00/0000');

    }, 1000);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getTransport() {
    this.apiService.getTransport({}).subscribe(data => {
        this.transportList = data['data'];
    });
  }

  getAccountPerson(account_id: any) {
    if (!this.isNotValid(account_id)) {
      this.apiService.getAccountPerson({account_id: account_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.contactPersons = data['data'];
        }
      });
    }
  }

  changePriority() {
    this.getSupplier();
    this.purchaseDetails = [];
    if (this.purchaseForm.value.return_priority == 'After Replacement Received') {
      // this.purchaseForm.controls.replace_demand_id.disable();
      // this.purchaseForm.controls.replace_demand_id.clearValidators();
      this.purchaseForm.controls.replace_receipt_id.enable();
      this.purchaseForm.controls.replace_receipt_id.setValidators([Validators.required]);
    } else {
      // this.purchaseForm.controls.replace_demand_id.enable();
      // this.purchaseForm.controls.replace_demand_id.setValidators([Validators.required]);
      this.purchaseForm.controls.replace_receipt_id.clearValidators();
      this.purchaseForm.controls.replace_receipt_id.disable();
    }
    // this.purchaseForm.controls.replace_demand_id.updateValueAndValidity();
    this.purchaseForm.controls.replace_receipt_id.updateValueAndValidity();
  }

  showReplaceReceipt() {
    if (this.purchaseForm.value.return_priority != 'After Replacement Received') {
      return;
    }
    this.loader.start();
    this.apiService.showReplaceReceipt({id: this.purchaseForm.value.replace_receipt_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (this.editMode) {
          this.ReplaceReceipts = [{
            id: data['data']['id'],
            replace_receipt_no: data['data']['replace_receipt_no'],
            return_date: data['data']['return_date']
          }];
        }
        this.purchaseDetails = data['data']['details'];
        this.showEditModal = false;
        this.purchaseDetails.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = item.product.category_name;
          item.product_name = item.product.model_no;
        })
        if (data['data']['dispatch_date']) {
          $("#dispatch_date").datepicker("setDate", new Date(data['data']['dispatch_date']));
        }
        this.purchaseForm.controls.exchange_date.setValue(data['data']['return_date'])
        this.purchaseForm.controls.exchange_time.setValue(data['data']['return_time'])
        this.purchaseForm.controls.replace_demand_id.setValue(data['data']['replace_demand_id'])
        // this.purchaseForm.controls.no_of_cartons.setValue(data['data']['no_of_cartons'])
        // this.purchaseForm.controls.transporter_id.setValue(data['data']['transporter_id'])
        // this.purchaseForm.controls.docket_no.setValue(data['data']['docket_no'])
        // this.purchaseForm.controls.dispatch_date.setValue(data['data']['dispatch_date'])
      }
      this.loader.stop();
    });
  }
  
  showReplaceDemand() {
    if (this.purchaseForm.value.return_priority != 'Before Replacement Received') {
      return;
    }
    if (!this.isNotValid(this.purchaseForm.value.replace_demand_id)) {
      this.loader.start();
      this.apiService.showReplaceDemand({id: this.purchaseForm.value.replace_demand_id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          if (this.editMode) {
            this.ReplaceDemands = [{
              id: data['data']['id'],
              replace_no: data['data']['replace_no'],
              exchange_date: data['data']['exchange_date']
            }];
          }
          this.purchaseDetails = data['data']['details'];
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
          })
          if (data['data']['exchange_date']) {
            this.purchaseForm.controls.exchange_date.setValue(data['data']['exchange_date']);
            this.purchaseForm.controls.exchange_time.setValue(data['data']['exchange_time']);
          }
          // this.purchaseForm.controls.contact_no.setValue(data['data']['contact_no'])
          // this.purchaseForm.controls.email_id.setValue(data['data']['email_id'])
          // this.purchaseForm.controls.your_contact_person.setValue(data['data']['discuss_id'])

        }
        this.loader.stop();
      });
    }
  }

  changePerson() {
    let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.your_contact_person) });
    if (row.length) {
      if (row[0]['email']) {
        this.purchaseForm.controls.email_id.setValue(row[0]['email'])
      } else {
        this.purchaseForm.controls.email_id.setValue(null);
      }
      if (row[0]['personal_phone_number']) {
        this.purchaseForm.controls.contact_no.setValue(row[0]['personal_phone_code']+''+row[0]['personal_phone_number'])
      } else {
        this.purchaseForm.controls.contact_no.setValue(null)
      }
    }
  }

  getReplaceReceipt() {
    if (this.purchaseForm.value.supplier_id && this.purchaseForm.value.return_priority == 'After Replacement Received') {
      this.apiService.getReplaceReceipt({supplier_id: this.purchaseForm.value.supplier_id, priority: this.purchaseForm.value.return_priority}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceReceipts = data['data'];
        }
      });
    } else {
      this.ReplaceReceipts = [];
    }
  }

  getReplaceDemand() {
    if (this.purchaseForm.value.supplier_id && this.purchaseForm.value.return_priority == 'Before Replacement Received') {
      this.apiService.getReplaceDemand({supplier_id: this.purchaseForm.value.supplier_id, is_return: 1, priority: this.purchaseForm.value.return_priority}).subscribe(data => {
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
    if (this.clientId) {
      this.apiService.getReplaceReturn({supplier_id: this.clientId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceReturns = data['data'];
        }
      });
    } else {
      this.ReplaceReturns = [];
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
    this.apiService.editSuppliers({page: 'rprtn', replace_return: 1, priority: this.purchaseForm.value.return_priority}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'rprtn'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getReplaceReturnNo() {
    if (this.purchaseForm.value.supplier_id && this.createMode) {
      this.loader.start();
      this.apiService.getReplaceReturnNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.replace_return_no.setValue(this.demandNo);
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
    this.prodForm.reset();
    if (this.isNotValid(prod.qr_code)) {
      // this.prodForm.controls.qty.setValue(prod.qty);
      this.prodForm.controls.qr_code.setValue(0);
    } else {
      // this.prodForm.controls.qty.setValue(1);
      this.prodForm.controls.group_id.setValue(prod.group_id);
      if (prod.is_return != 1) {
        this.getModels();
      }
    }
    if (prod.is_return == 1) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
          setTimeout(() => {
            this.prodForm.patchValue(prod);
            this.prodForm.controls.product_id.setValue(prod.product_id);
            this.prodForm.controls.qr_code.setValue(prod.return_qr_code);
            this.prodForm.controls.mac_address.setValue(prod.return_mac_address);
            this.prodForm.controls.serial_no.setValue(prod.return_serial_no);
            if (prod.invoice_date) {
              this.prodForm.controls.return_date.setValue(prod.invoice_date);
            }
            for(var r in this.products) {
              if (this.products[r].id == this.prodForm.value.product_id) {
                this.prodForm.controls.description.setValue(this.products[r].category.name);
              }
            }
            this.isZero = false;
            if (this.isNotValid(prod.qr_code)) {
              this.isZero = true;
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

    if (this.prodForm.value.problem.length < 25) {
      this.toastr.warning('Message Alert !', 'Problem description must be minumum 25 characters longer.')
      return;
    }

    if (this.selectedModal.product_id == this.prodForm.value.product_id) {
      if (this.prodForm.value.qty != this.selectedModal.qty) {
        this.toastr.error('Sorry Gentleman !', 'Repalce Return Demand qnty is ' + this.selectedModal.qty + ' for ' + this.selectedModal['product_name']);
        return
      }
      this.showAddItemModal = false;
      this.purchaseDetails[this.selectedProductIndex].product_name = this.prodForm.value.product_name;  
      this.purchaseDetails[this.selectedProductIndex].description = this.prodForm.value.description;  
      this.purchaseDetails[this.selectedProductIndex].return_qr_code = this.prodForm.value.qr_code;  
      this.purchaseDetails[this.selectedProductIndex].return_serial_no = this.prodForm.value.serial_no;  
      this.purchaseDetails[this.selectedProductIndex].return_mac_address = this.prodForm.value.mac_address;  
      this.purchaseDetails[this.selectedProductIndex].return_qty = this.prodForm.value.qty;  
      this.purchaseDetails[this.selectedProductIndex].invoice_no = this.prodForm.value.invoice_no;  
      this.purchaseDetails[this.selectedProductIndex].invoice_date = this.prodForm.value.return_date;  
      this.purchaseDetails[this.selectedProductIndex].is_return = 1;  
      this.products = [];
      this.isZero = false;
    } else {
      this.toastr.error('Gentleman !', 'Please select item ' + this.selectedModal['product_name']);
    }
  }

  clearItem() {
    this.prodForm.reset();
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

  changeModel() {
    if (this.prodForm.value.product_id) {
      for(var r in this.products) {
        if (this.products[r].id == this.prodForm.value.product_id) {
          this.prodForm.controls.product_name.setValue(this.products[r].model_no);
          this.prodForm.controls.description.setValue(this.products[r].category_name);
          this.prodForm.controls.warranty.setValue(this.products[r].extended_warranty);
          if (this.products[r].extended_warranty == '1') {
            let extended_month = this.products[r].extended_month;
            // let challan_date = new Date(this.purchaseForm.value.exchange_date_time);
            let challan_date = new Date();
            let date = new Date(challan_date.setMonth(challan_date.getMonth() + Number(extended_month)));
            let warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
            this.prodForm.controls.warranty_date.setValue(warranty_date);
          }
        }
      }
    }
  }

  getProductQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.isZero = false;
      this.loader.start();
      this.apiService.getProductQrCode({qr_code: this.prodForm.value.qr_code}).subscribe(data => {
        if (data && data['data'] && data['status'] == 1) {
          // if (data['data']['item']['product_id'] != this.selectedModal.product_id) {
          if (this.prodForm.value.qr_code != this.selectedModal.qr_code) {
            let itesm = data['products'].filter((ite: any) => { return (ite.id == data['data']['item']['product_id']) });
            if (itesm.length) {
              this.toastr.error('Gentleman !', 'Please check QR Code of item you are returning against the item received ' + this.prodForm.value.qr_code);
            } else {
              this.toastr.error('Gentleman !', 'Please select item ' + this.selectedModal['product_name']);
            }
            this.prodForm.value.qr_code = null;
          } else {
            let row = this.suppliers.filter((sup) => { return (sup.id == this.purchaseForm.value.supplier_id) });
            this.prodForm.controls.qty.setValue(1);
            if (row.length) {
              this.toastr.info('Hello, Gentleman!', 'QR Code is for ' + this.selectedModal['product_name'] + ' only, you are returning right product to ' + row[0].name + '.');
            }
            let warranty_date = null;
            let warranty = 0;
            let desc = data['prmodel'].description +'&#13;&#10;Prod. Code: '+ data['prmodel'].product_code +'&#13;&#10;Warranty: '+ data['prmodel'].supplier_warranty +' Months&#13;&#10;HSN Code: '+ data['prmodel'].hsn_code;
            if (!this.isNotValid(data['prmodel']['supplier_warranty'])) {
              let extended_month = data['prmodel'].supplier_warranty;
              let challan_date = new Date();
              if (data['data']['purchase']['purchase_date']) {
                challan_date = new Date(data['data']['purchase']['purchase_date']);
              }
              let date = new Date(challan_date.setMonth(Number(extended_month)));
              warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
              if (date > new Date()) {
                warranty = 1;
              }
            }
            let iObj = {
              qr_code: data['data']['qr_code'],
              group_id: data['data']['item']['group_id'],
              group_name: data['prmodel']['group']['name'],
              product_id: data['data']['item']['product_id'],
              product_name: data['prmodel']['model_no'],
              description: data['prmodel']['category_name'],
              qty: 1,
              serial_no: data['data']['serial_no'],
              mac_address: data['data']['mac_address'],
              invoice_no: (data['data']['purchase']) ? data['data']['purchase']['invoice_no']: null,
              return_date: (data['data']['purchase']) ? data['data']['purchase']['invoice_date']: null,
              warranty: warranty,
              warranty_date: warranty_date,
              problem: this.selectedModal.problem,
            }
            this.prodForm.patchValue(iObj);
          }
        } else {
          this.toastr.error('Sorry Gentleman !', this.prodForm.value.qr_code + ' QR-Code of item did not matched.');
          this.prodForm.controls.qr_code.setValue(null);
        }
        this.loader.stop();
      });
    }
    if (this.prodForm.value.qr_code == '0') {
      this.isZero = true;
      this.prodForm.reset();
      this.prodForm.controls.qr_code.setValue(0);
      this.prodForm.controls.problem.setValue(this.selectedModal.problem);
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

  checkWar(wDate: any) {
    if (new Date(wDate) < new Date()) {
      return "No";
    } else {
      return "Yes";
    }
  }

  enableSave() {
    let items = this.purchaseDetails.filter((row) => { return (row.is_return == 1) });
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
        if (item.is_return == 1) {
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
      this.apiService.updateReplaceReturn(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace return details update successfully.');
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
      this.apiService.saveReplaceReturn(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace return details saved successfully.');
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
      this.apiService.deleteReplaceReturn({id: this.purchaseForm.value.id}).subscribe(data => {
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
      this.getAccountPerson(this.clientId);
      this.loader.start();
      this.apiService.showReplaceReturn({id: this.demandId}).subscribe(data => {
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
          })
          if (data['data']['dispatch_date']) {
            $("#dispatch_date").datepicker("setDate", new Date(data['data']['dispatch_date']));
          }
          // this.getReplaceDemand();
          // this.getReplaceReceipt();
          this.showReplaceReceipt();
          this.showReplaceDemand();
        }
        this.loader.stop();
        this.demandId = null;
        this.clientId = null;
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
