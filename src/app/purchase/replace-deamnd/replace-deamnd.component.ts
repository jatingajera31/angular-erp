import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-replace-deamnd',
  templateUrl: './replace-deamnd.component.html',
  styleUrls: ['./replace-deamnd.component.css']
})
export class ReplaceDeamndComponent implements OnInit {

  purchaseForm: FormGroup;
  prodForm: FormGroup;
  createMode = false;
  editMode = false;
  viewMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  selectedProductId:any;
  showRemoveModal = false;
  showAddItemModal = false;
  productEditMode = false;
  warrantyExpiredModal = false;
  invoiceCheckModal = false;
  isZero = false;
  isFocus = false;
  changeSourceModal = false;
  firstTime = true;
  staffs : any[] = [];
  suppliers : any[] = [];
  purchaseDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  ExchangeDemands : any[] = [];
  ReplaceDemands : any[] = [];
  contactPersons : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  source_demand:any;
  ProductName:any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      replace_no: new FormControl(null, Validators.required),
      sales_exchage_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      exchange_date: new FormControl(null, Validators.required),
      exchange_time: new FormControl(null, Validators.required),
      source_demand: new FormControl(null, Validators.required),
      ref_repair: new FormControl(null),
      remarks: new FormControl(null),
      connect_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      discuss_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      requested_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      confirmation_received: new FormControl(null, Validators.required),
      confirmation_date: new FormControl(null, Validators.required),
      t_confirmation_date: new FormControl(null),
      confirmation_cc: new FormControl({value: null, disabled: true}),
      advised_as: new FormControl(null, Validators.required),
      contact_no: new FormControl(null, Validators.required),
      email_id: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required),
      ex_date: new FormControl(null),
      ex_time: new FormControl(null),
    });
    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      product_code: new FormControl(null),
      description: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      warranty: new FormControl(null),
      warranty_date: new FormControl(null),
      serial_no: new FormControl(null),
      mac_address: new FormControl(null),
      invoice_no: new FormControl(null),
      invoice_date: new FormControl(null),
      inv_invoice_date: new FormControl(null),
      problem: new FormControl(null, Validators.required)
      // problem: new FormControl(null, [Validators.required, Validators.minLength(25)])
    });
    this.getStaff();
    this.getProductGroup();
  }

  @HostListener('click', ['$event'])
  mouseClick(evt: any) {
    const flyoutElement = document.getElementsByClassName('adminActions');
      let targetElement = evt.target;
      do {
          if (targetElement.classList && targetElement.classList.contains('adminActions')) {
            this.isFocus = true;
            return;
          }
          targetElement = targetElement['parentNode'];
      } while (targetElement);

      this.isFocus = false;
      this.setFalseData(-1);
  }

  setFalseData(k: number) {
    this.purchaseDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
     $( "#confirmation_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.confirmation_date.setValue(date);
        this.purchaseForm.controls.t_confirmation_date.setValue(e.format());
      });
      $( "#exchange_return_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.exchange_return_date.setValue(date);
      });
      $("#confirmation_date").mask('00/00/0000');
      $("#exchange_return_date").mask('00/00/0000');


    }, 1000);
  }

  loadDate() {
    setTimeout(() => {
      $( "#inv_invoice_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.prodForm.controls.invoice_date.setValue(date);
        this.prodForm.controls.inv_invoice_date.setValue(e.format());
      });

      $('#inv_invoice_date').mask('00/00/0000');
    },500)
  }

  changeConfirmation() {
    if (this.purchaseForm.value.confirmation_received == 'e-Mail') {
      this.purchaseForm.controls.confirmation_cc.setValidators([Validators.required]);
      this.purchaseForm.controls.confirmation_cc.enable();
    } else {
      this.purchaseForm.controls.confirmation_cc.clearValidators();
      this.purchaseForm.controls.confirmation_cc.disable();
    }
    this.purchaseForm.controls.confirmation_cc.updateValueAndValidity();
  }

  changeSource() {
    if (this.purchaseForm.value.source_demand == 'Stock') {
      this.purchaseForm.controls.ref_repair.disable();
      this.purchaseForm.controls.sales_exchage_id.disable();
      this.purchaseForm.controls.sales_exchage_id.clearValidators();
    } else {
      this.purchaseForm.controls.ref_repair.enable();
      this.purchaseForm.controls.sales_exchage_id.enable();
      this.purchaseForm.controls.sales_exchage_id.setValidators([Validators.required]);
    }
    this.purchaseForm.controls.sales_exchage_id.updateValueAndValidity();
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getExchangeDemand() {
    if (this.purchaseForm.value.source_demand == 'Serivce') {
      this.apiService.getExchangeDemand({status: 'Approved'}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ExchangeDemands = data['data'];
          if (this.purchaseForm.value.sales_exchage_id && this.editMode) {
            this.ExchangeDemands.forEach((item) => {
              if (this.purchaseForm.value.sales_exchage_id == item.id) {
                if (item['exchange_date']) {
                  this.purchaseForm.controls.ex_date.setValue(item['exchange_date'])
                  this.purchaseForm.controls.ex_time.setValue(item['exchange_time'])
                }
              }
            });
          }
        }
      });
    } else {
      this.ExchangeDemands = [];
    }
  }

  showSourceAlert() {
    if (this.editMode) {
      this.changeSourceModal = true;
      this.purchaseForm.controls.source_demand.setValue(this.source_demand);
      // this.changeSource();
      // this.getExchangeDemand();
    } else {
      if (!this.firstTime) {
        this.changeSourceModal = true;
        this.purchaseForm.controls.source_demand.setValue(this.source_demand);
      } else {
        this.source_demand = this.purchaseForm.value.source_demand;
        this.firstTime = false;
      }
    }
  }

  showExchangeDemand() {
    if (!this.isNotValid(this.purchaseForm.value.sales_exchage_id)) {
      this.loader.start();
      this.apiService.showExchangeDemand({id: this.purchaseForm.value.sales_exchage_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseDetails = data['data']['details'];
          this.showEditModal = false;
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.category_name = item.product.category.name;
            item.product_name = item.product.model_no;
            if (item.warranty_date) {
              item.warranty = 1;
            }
            if (item.reason) {
              item.problem = item.reason;
            }
          })
          if (data['data']['exchange_date']) {
            this.purchaseForm.controls.ex_date.setValue(data['data']['exchange_date'])
            this.purchaseForm.controls.ex_time.setValue(data['data']['exchange_time'])
            this.purchaseForm.controls.ref_repair.setValue(data['data']['ref_repair'])
          }
        }
        this.loader.stop();
      });
    }
  }

  getReplaceDemand() {
    if (this.clientId) {
      let status = (this.viewMode) ? 'Approved': 'Pending';
      this.apiService.getReplaceDemand({supplier_id: this.clientId, status: status}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceDemands = data['data'];
        }
      });
    } else {
      this.ReplaceDemands = [];
    }
  }

  // getExchangeDemandProducts() {
  //   this.apiService.getExchangeDemandProducts({status: 'Pending', supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
  //     if (data && data['status'] == 1) {
  //       this.products = data['data'];
  //     }
  //   });
  // }

  getProductQrCode(qr_code: string, index: number) {
    this.loader.start();
    this.apiService.getProductQrCode({qr_code: qr_code}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        if (data['data']) {
          this.purchaseDetails[index].mac_address = data['data'].mac_address;
          this.purchaseDetails[index].serial_no = data['data'].serial_no;
          this.purchaseDetails[index].qr_code = data['data'].qr_code;
        }
      }
    });
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

  changeSubDate(field: any, iField: any) {
    if (this.prodForm.value[field]) {
      let d = this.makeDate(this.prodForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.prodForm.controls[iField].setValue(date);
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
    this.apiService.getSupplier({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers(status: string) {
    this.apiService.editSuppliers({page: 'rpd', replace_approval: 1, status: status}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getAccountPerson(supplier_id: any) {
    if (!this.isNotValid(supplier_id)) {
      this.apiService.getAccountPerson({account_id: supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.contactPersons = data['data'];
        }
      });
    }
  }

  changePerson() {
    if (this.isNotValid(this.purchaseForm.value.requested_id)) {
      this.purchaseForm.controls.contact_no.setValue(null);
      this.purchaseForm.controls.email_id.setValue(null);
    } else {
      let rows = this.staffs.filter((itm: any) => { return (itm.id == this.purchaseForm.value.requested_id) });
      if (rows.length) {
        if (rows[0].personal_phone_number) {
          this.purchaseForm.controls.contact_no.setValue(rows[0].personal_phone_code +'' + rows[0].personal_phone_number);
        } else {
          this.purchaseForm.controls.contact_no.setValue(null);
        }
        this.purchaseForm.controls.email_id.setValue(rows[0].email);
      }
    }
  }

  getReplaceDemandNo() {
    if (this.purchaseForm.value.supplier_id && this.createMode) {
      this.loader.start();
      this.apiService.getReplaceDemandNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.replace_no.setValue(this.demandNo);
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
    this.createMode = false;
    this.editMode = false;
    this.viewMode = false;
    this.purchaseDetails = [];
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.viewMode = false;
    this.source_demand = null;
    this.firstTime = true;
    this.purchaseDetails = [];
    this.purchaseForm.reset();
    this.getSupplier();
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.exchange_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.exchange_time.setValue(tims);
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.viewMode = false;
    this.getEditSuppliers('Pending');
  }

  viewDemandMode() {
    this.createMode = false;
    this.editMode = false;
    this.viewMode = true;
    this.showEditModal = true;
    this.getEditSuppliers('Approved');
  }

  viewProductDetailModal(prod: any, i: any) {
    this.selectedProductId = prod.product_id;
  }

  editProductModal(prod: any, i: any) {
    let iObj = {
      qr_code: prod.qr_code,
      group_id: prod.group_id,
      group_name: prod.group_name,
      product_id: prod.product_id,
      product_name: prod.product_name,
      product_code: prod.product_code,
      description: prod.description,
      qty: prod.qty,
      serial_no: prod.serial_no,
      mac_address: prod.mac_address,
      invoice_no: prod.invoice_no,
      invoice_date: prod.invoice_date,
      warranty: prod.warranty,
      warranty_date: prod.warranty_date,
      reason: prod.reason,
      problem: prod.problem
    }
    if (prod.qr_code && prod.qr_code != '0') {
      this.isZero = false;
    } else {
      this.isZero = true;
    }
    this.productEditMode = true;
    this.prodForm.patchValue(iObj);
    this.getModels();
    this.loadDate();
    setTimeout(() => {
      if (iObj.invoice_date) {
        $("#inv_invoice_date").datepicker('setDate', new Date(iObj.invoice_date))
      }
    }, 800)
    this.showAddItemModal = true;
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

  saveInfo() {
    console.log(this.purchaseForm.controls);
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.purchaseDetails.length) {
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
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid product details.');
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
      this.apiService.updateReplaceDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace Demand details update successfully.');
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
      this.apiService.saveReplaceDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace Demand details saved successfully.');
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
      this.apiService.deleteReplaceDemand({id: this.purchaseForm.value.id}).subscribe(data => {
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
      this.apiService.showReplaceDemand({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.source_demand = data['data']['source_demand'];
          this.purchaseDetails = data['data']['details'];
          this.showEditModal = false;
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.group_name = item.group.name;
            item.product_name = item.product.model_no;
            item.product_code = item.product.product_code;
            item.qr_code = item.qr_code || 0;
          })
          if (data['data']['exchange_date']) {
            $("#exchange_date").datepicker("setDate", new Date(data['data']['exchange_date']));
          }
          if (data['data']['confirmation_date']) {
            $("#confirmation_date").datepicker("setDate", new Date(data['data']['confirmation_date']));
          }
          this.getExchangeDemand();
          this.changeConfirmation();
          this.changeSource();
        }
        this.loader.stop();
        this.demandId = null;
        this.clientId = null;
      });
    }
  }

  checkWar(wDate: any) {
    if (new Date(wDate) < new Date()) {
      return "Expired";
    } else {
      return "Yes";
    }
  }

  getInvDate() {
    this.apiService.getInvoiceDetail({invoice_no: this.prodForm.value.invoice_no, supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
      if (data['data']) {
        setTimeout(() => {
          if (data['data'].invoice_date) {
            this.prodForm.controls.invoice_date.setValue(data['data'].invoice_date);
            $("#inv_invoice_date").datepicker('setDate', new Date(data['data'].invoice_date))
          }
        }, 200)
      }
    });
  }

  getQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.isZero = false;
      this.loader.start();
      this.apiService.getProductQrCode({qr_code: this.prodForm.value.qr_code}).subscribe((data:any) => {
        if (data && data['status'] == 1 && data['data']) {
          let warranty_date = null;
          let warranty = 0;
          let desc = data['prmodel'].description +'&#13;&#10;Prod. Code: '+ data['prmodel'].product_code +'&#13;&#10;Warranty: '+ data['prmodel'].supplier_warranty +' Months&#13;&#10;HSN Code: '+ data['prmodel'].hsn_code;
          if (!this.isNotValid(data['prmodel']['supplier_warranty'])) {
            // let extended_month = data['prmodel'].extended_month;
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
            product_code: data['prmodel']['product_code'],
            description: data['prmodel']['category_name'],
            qty: 1,
            serial_no: data['data']['serial_no'],
            mac_address: data['data']['mac_address'],
            invoice_no: (data['data']['purchase']) ? data['data']['purchase']['invoice_no']: null,
            invoice_date: (data['data']['purchase']) ? data['data']['purchase']['invoice_date']: null,
            warranty: warranty,
            warranty_date: warranty_date,
            reason: null,
            problem: null,
          }
          this.prodForm.patchValue(iObj);
          setTimeout(() => {
            if (iObj.invoice_date) {
              $("#inv_invoice_date").datepicker('setDate', new Date(iObj.invoice_date))
            }
          }, 800)
        } else {
          this.prodForm.reset();
          if (data['data']) {
            this.toastr.error('Sorry Gentleman !', data['data']);
          } else {
            this.toastr.error('Sorry Gentleman !', 'QR Code does not match please check or enter correct info.');
          }
        }
        this.loader.stop();
      });
    }
    if (this.prodForm.value.qr_code == '0') {
      this.isZero = true;
      this.prodForm.reset();
      this.prodForm.controls.qr_code.setValue(0);
    }
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
          this.prodForm.controls.product_code.setValue(this.products[r].product_code);
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

  viewAddItemModal() {
    this.invalidForm = false;
    this.showAddItemModal = true;
    this.loadDate();
  }

  closeItemModal() {
    this.prodForm.reset();
    this.showAddItemModal = false;
    this.productEditMode = false;
    $('#inv_return_date').datepicker('destroy');
  }

  checkPurchaseQty() {
    if (this.isNotValid(this.prodForm.value.product_id)) {
      this.prodForm.controls.qty.setValue(0);
      return;
    }
    this.apiService.checkPurchaseQty({qty: this.prodForm.value.qty, product_id: this.prodForm.value.product_id, supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
      if (data['status'] == 1) {
        if (Number(this.prodForm.value.qty) > Number(data['data'])) {
          let spName = this.suppliers.filter((row) => { return (row.id == this.purchaseForm.value.supplier_id) });
          if (spName.length) {
            this.prodForm.controls.qty.setValue(0);
            this.toastr.error('Gentleman !', 'Repalce Demand qnty is more than the qnty you purchased from <strong>'+spName[0].name+'</strong>, please check qnty.')    
          }
        }
      }
    });
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

    if (this.prodForm.value.warranty_date && new Date(this.prodForm.value.warranty_date) < new Date()) {
      this.warrantyExpiredModal = true;
      return;
    }

    if (this.isZero && (this.isNotValid(this.prodForm.value.invoice_no) || this.isNotValid(this.prodForm.value.inv_invoice_date))) {
      let row  = this.products.filter((item) => { return (item.id == this.prodForm.value.product_id) });
      if (row.length) {
        this.ProductName = row[0].model_no;
        this.invoiceCheckModal = true;
      }
      return;
    }

    this.addToList();
    
  }

  yesConfirmWarr() {
    if (this.isZero && (this.isNotValid(this.prodForm.value.invoice_no) || this.isNotValid(this.prodForm.value.inv_invoice_date))) {
      let row  = this.products.filter((item) => { return (item.id == this.prodForm.value.product_id) });
      if (row.length) {
        this.ProductName = row[0].model_no;
        this.invoiceCheckModal = true;
      }
      return;
    }
    this.addToList();
  }

  addToList() {
    let isFound = -1;
    this.purchaseDetails.forEach((item, key) => {
      if (item.qr_code == this.prodForm.value.qr_code && item.group_id == this.prodForm.value.group_id && item.product_id == this.prodForm.value.product_id) {
        isFound = key;
      }
    });
    if (isFound == -1) {
      this.purchaseDetails.push(this.prodForm.value);
    } else {
      this.showAddItemModal = false;
      this.purchaseDetails[isFound] = this.prodForm.value;
    }
    this.productEditMode = false;
    this.isZero = false;
    this.prodForm.reset();
    this.products = [];
    // this.calc();
  }

  clearItem() {
    this.prodForm.reset();
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}