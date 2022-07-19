import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-sales-exchange-demand',
  templateUrl: './sales-exchange-demand.component.html',
  styleUrls: ['./sales-exchange-demand.component.css']
})
export class SalesExchangeDemandComponent implements OnInit {

  purchaseForm: FormGroup;
  prodForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  isFocus = false;
  showAddItemModal = false;
  productEditMode = false;
  warrantyExpiredModal = false;
  isZero = false;
  sourceChanged = false;
  suppliers : any[] = [];
  staffs : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  clients : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  exchangeProducts : any[] = [];
  products : any[] = [];
  ExchangeDemands : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  locationId: any = null;
  loginId:any = null;
  selectedProductIndex:any;
  selectedModal:any;
  productImage = './assets/images/product.jpg';
  MessageText: string = '';
  MessageTitle: string = '';
  ActionType: string = '';
  SaveBtn: string = '';
  CancelBtn: string = '';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      exchange_no: new FormControl(null, Validators.required),
      project_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      exchange_date: new FormControl(null, Validators.required),
      t_exchange_date: new FormControl(null),
      exchange_time: new FormControl(null, Validators.required),
      source_demand: new FormControl(null, Validators.required),
      ref_repair: new FormControl(null),
      remarks: new FormControl(null),
      connect_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      demand_by_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      contact_no: new FormControl(null, Validators.required),
      email_id: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required),
    });
    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      product_code: new FormControl(null),
      engineer_id: new FormControl(null),
      description: new FormControl(null),
      category_name: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      warranty: new FormControl(null),
      warranty_date: new FormControl(null),
      serial_no: new FormControl(null),
      match_serial_no: new FormControl({value: null, disabled: true}),
      mac_address: new FormControl(null),
      match_mac_address: new FormControl({value: null, disabled: true}),
      invoice_no: new FormControl(null),
      invoice_date: new FormControl(null),
      inv_invoice_date: new FormControl(null),
      reason: new FormControl(null, Validators.required)
    });
    this.loginId = localStorage.getItem('token_id');
    this.getStaff();
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
    this.productDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#exchange_return_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.exchange_return_date.setValue(date);
      });
      $("#exchange_return_date").mask('00/00/0000');

    }, 1000);
  }

  changeSource() {
    if (this.sourceChanged) {
      this.MessageText = 'Do you want to change source of demand ? All data will be permanently lost. Do you want to proceed?';
      this.MessageTitle = 'Source selection Alert !';
      this.ActionType = 'Source';
      this.SaveBtn = 'Yes';
      this.CancelBtn = 'No';
    }

    if (!this.sourceChanged) {
      this.sourceChanged = true
    }

    if (this.purchaseForm.value.source_demand == 'Sales') {
      this.purchaseForm.controls.ref_repair.disable();
    } else {
      this.purchaseForm.controls.ref_repair.enable();
    }
  }

  confirmedAction(result: any) {
    this.MessageText = '';
    this.MessageTitle = '';
    if (result.status && result.type == 'Source') {
      this.createMode = false;
      this.viewCreateMode(this.purchaseForm.value.source_demand);
    } else {
        let d = (this.purchaseForm.value.source_demand == 'Serivce') ? 'Sales': 'Serivce';
        this.purchaseForm.controls.source_demand.setValue(d);
    }
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getExchangeDemand() {
    if (this.clientId) {
      this.apiService.getExchangeDemand({client_id: this.clientId, location_id: this.locationId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ExchangeDemands = data['data'];
        }
      });
    }
  }

  getProject(client_id: any, location_id: any) {
    this.apiService.getProject({client_id: client_id, location_id: location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
  }

  getExchangeDemandProducts() {
    this.apiService.getExchangeDemandProducts({status: 'Pending', client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.exchangeProducts = data['data'];
        this.productGroups = [];
         // supporting_engineer
        this.exchangeProducts.forEach((item) => {
          let exist = false;
          this.productGroups.forEach((grp) => {
            if (grp.id == item.group_id) {
              exist = true;
            }
          });
          if (!exist) {
            this.productGroups.push(item.group);
          }
        });
      }
    });
  }

  getProductQrCode(qr_code: string, index: number) {
    this.loader.start();
    this.apiService.getProductQrCode({qr_code: qr_code}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        if (data['data']) {
          this.productDetails[index].mac_address = data['data'].mac_address;
          this.productDetails[index].serial_no = data['data'].serial_no;
          this.productDetails[index].qr_code = data['data'].qr_code;
        }
      }
    });
  }

  // getProductGroup() {
  //   this.apiService.getProductGroup({}).subscribe(data => {
  //     if (data && data['status'] == 1) {
  //       this.productGroups = data['data'];
  //     }
  //   });
  // }

  getQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.isZero = false;
      this.prodForm.controls.match_mac_address.enable();
      this.prodForm.controls.match_serial_no.enable();
      this.loader.start();
      this.apiService.getDeliveryQrCode({qr_code: this.prodForm.value.qr_code}).subscribe((data:any) => {
        if (data && data['status'] == 1 && data['data']) {
          let warranty_date = null;
          let warranty = 0;
          let desc = data['data']['product'].description +'&#13;&#10;Prod. Code: '+ data['data']['product'].product_code +'&#13;&#10;Warranty: '+ data['data']['product'].client_warranty +' Months&#13;&#10;HSN Code: '+ data['data']['product'].hsn_code;
          if (!this.isNotValid(data['data']['product']['client_warranty'])) {
            // let extended_month = data['data']['product'].extended_month;
            let extended_month = data['data']['product'].client_warranty;
            let challan_date = new Date();
            if (data['data']['purchase_date']) {
              challan_date = new Date(data['data']['purchase_date']);
            }
            let date = new Date(challan_date.setMonth(Number(extended_month)));
            warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
            if (date > new Date()) {
              warranty = 1;
            }
          }
          let iObj = {
            qr_code: data['data']['qr_code'],
            group_id: data['data']['group_id'],
            group_name: data['data']['group']['name'],
            product_id: data['data']['product_id'],
            product_name: data['data']['product']['model_no'],
            product_code: data['data']['product']['product_code'],
            description: data['data']['product']['category_name'],
            category_name: data['data']['product']['category_name'],
            qty: 1,
            serial_no: data['data']['serial_no'],
            match_serial_no: null,
            mac_address: data['data']['mac_address'],
            match_mac_address: null,
            invoice_no: (data['data']['invoice_no']) ? data['data']['invoice_no']: null,
            invoice_date: (data['data']['invoice_date']) ? data['data']['invoice_date']: null,
            inv_invoice_date: (data['data']['invoice_date']) ? data['data']['invoice_date']: null,
            warranty: warranty,
            warranty_date: warranty_date,
            reason: null,
          }
          this.prodForm.patchValue(iObj);
          if (data['data']['serial_no']) {
            this.prodForm.controls.match_serial_no.enable();
          } else {
            this.prodForm.controls.match_serial_no.disable();
          }
          if (data['data']['mac_address']) {
            this.prodForm.controls.match_mac_address.enable();
          } else {
            this.prodForm.controls.match_mac_address.disable();
          }
          if (iObj.invoice_date) {
            $("#inv_invoice_date").datepicker('setDate', new Date(iObj.invoice_date))
          }
        } else {
          this.prodForm.reset();
          if (data['data']) {
            this.toastr.error('Sorry Gentleman !', data['data']);
          } else {
            if (data['found'] && data['found']['item'] && data['found']['item']['prmodel']) {
              let clientName = this.clients.filter((r) => { return (r.id == this.purchaseForm.value.client_id) });
              if (clientName.length) {
                this.toastr.error('Gentleman !', 'This is '+data['found']['item']['prmodel']['model_no']+'. It is not sold to '+clientName[0].account_name+'. Please check.');
              } else {
                this.toastr.error('Sorry Gentleman !', 'QR Code does not match please check or enter correct info.');  
              }
            } else {
              this.toastr.error('Sorry Gentleman !', 'QR Code does not match please check or enter correct info.');
            }
          }
          this.prodForm.controls.match_mac_address.disable();
          this.prodForm.controls.match_serial_no.disable();
        }
        this.loader.stop();
      });
    }
    if (this.prodForm.value.qr_code == '0') {
      this.isZero = true;
      this.prodForm.reset();
      this.prodForm.controls.qr_code.setValue(0);
      this.prodForm.controls.match_mac_address.disable();
      this.prodForm.controls.match_serial_no.disable();
    }
  }

  getModels() {
    this.products = [];
    if (this.prodForm.value.group_id) {
      this.exchangeProducts.forEach((item) => {
        if (item.group_id == this.prodForm.value.group_id) {
          this.products.push(item.product);
        }
      });

      // this.loader.start();
      // this.apiService.getProductGroupCode({group_id: this.prodForm.value.group_id}).subscribe(data => {
      //   if (data && data['status'] == 1) {
      //     this.products = data['data'];
      //   }
      //   this.loader.stop();
      // });
    }
  }

  changeModel() {
    if (this.prodForm.value.product_id) {
      for(var r in this.products) {
        if (this.products[r].id == this.prodForm.value.product_id) {
          this.prodForm.controls.product_name.setValue(this.products[r].model_no);
          this.prodForm.controls.description.setValue(this.products[r].category_name);
          this.prodForm.controls.category_name.setValue(this.products[r].category_name);
          this.prodForm.controls.product_code.setValue(this.products[r].product_code);
          this.prodForm.controls.warranty_date.setValue(null);
          // if (this.isNotValid(this.products[r]['client_warranty'])) {
          //    this.prodForm.controls.warranty_date.setValue(null);
          // }
        }
      }
    }
  }

  // changeModel(challan_item_id: any, index: any) {
  //   if (challan_item_id) {
  //     for(var r in this.products) {
  //       if (this.products[r].id == challan_item_id) {
  //         this.productDetails[index].challan_item_id = challan_item_id;
  //         this.productDetails[index].group_id = this.products[r].group_id;
  //         this.productDetails[index].product_id = this.products[r].product_id;
  //         this.productDetails[index].description = this.products[r].description;
  //         this.productDetails[index].category_name = this.products[r].product.category.name;
  //         this.productDetails[index].engineer_id = this.products[r].challan.supporting_engineer;
  //         this.productDetails[index].extended_warranty = this.products[r].product.extended_warranty;
  //         if (this.products[r].product.extended_warranty == '1') {
  //           this.productDetails[index].extended_month = this.products[r].product.extended_month;
  //           if (this.products[r].challan.quotation.extended_warranty && this.products[r].challan.quotation.extended_warranty_month) {
  //             this.productDetails[index].extended_month = Number(this.productDetails[index].extended_month) + Number(this.products[r].challan.quotation.extended_warranty_month);
  //           }
  //           let challan_date = new Date(this.products[r].challan.challan_date);
  //           let date = new Date(challan_date.setMonth(challan_date.getMonth() + Number(this.productDetails[index].extended_month)));
  //           this.productDetails[index].warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
  //         }
  //         if (this.products[r].qr_code) {
  //           this.getProductQrCode(this.products[r].qr_code, index);
  //         }
  //       }
  //     }
  //   }
  // }

  changeConnect() {
    let stf = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.connect_id) });
    if (stf.length) {
      let ph = stf[0].personal_phone_code + stf[0].personal_phone_number;
      this.purchaseForm.controls.contact_no.setValue(ph)
      this.purchaseForm.controls.email_id.setValue(stf[0].email)
    } else {
      this.purchaseForm.controls.contact_no.setValue(null)
      this.purchaseForm.controls.email_id.setValue(null)
    }
  }

  getExecutiveName() {
    if (this.purchaseForm.value.executive_id) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.executive_id) });
      if (row.length) {
        return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
      }
      return ""
    } else {
      return ""
    }
  }

  addProdDetail() {
    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      return;
    }
    this.productDetails.push({
      id: null,
      challan_item_id: null,
      group_id: null,
      product_id: null,
      description: null,
      category_name: null,
      qty: null,
      reason: null,
      warranty_date: null,
      extended_warranty: null,
      extended_month: null,
      qr_code: null,
      engineer_id: null,
      mac_address: null,
      match_mac_address: null,
      serial_no: null,
      match_serial_no: null,
      products: []
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

  getLocation(client_id: any) {
    if (this.isNotValid(client_id)) {
      this.locations = [];
      this.projects = [];
      this.ExchangeDemands = [];
      return;
    }
    this.apiService.getLocation({parent_id: client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getClients() {
    this.apiService.getClients({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }
  getEditClients() {
    this.apiService.editClients({page: 'sed'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getExchangeDemandNo() {
    if (this.purchaseForm.value.client_id && this.createMode) {
      this.loader.start();
      this.apiService.getExchangeDemandNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.exchange_no.setValue(this.demandNo);
        }
        this.loader.stop();
      });
    }
  }

  closeForm() {
    this.productDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.sourceChanged = false;
    this.purchaseForm.reset();
  }

  viewCreateMode(status: string) {
    if (this.createMode) {
      return;
    }
    this.createMode = true;
    this.editMode = false;
    this.productDetails = [];
    this.purchaseForm.reset();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.executive_id.setValue(this.loginId);
    this.purchaseForm.controls.exchange_date.setValue(date);
    if (status) {
      this.purchaseForm.controls.source_demand.setValue(status);
    }
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.exchange_time.setValue(tims);
    this.getClients();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getEditClients();
  }

  viewProductDetailModal(prod: any, i: any) {
    this.loader.start();
    this.apiService.viewProduct({id: prod.product_id}).subscribe(data => {
      this.selectedModal = data['data'];
      if (this.selectedModal.photo) {
        this.productImage = this.selectedModal.photo;
      }
      this.selectedProductIndex = i;
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
    this.productDetails.splice(this.selectedProductIndex, 1);
  }

  editProductModal(prod: any, i: any) {
    let iObj = {
      qr_code: prod.qr_code|| 0,
      group_id: prod.group_id,
      group_name: prod.group_name,
      product_id: prod.product_id,
      product_name: prod.product_name,
      product_code: prod.product_code,
      description: prod.category_name,
      category_name: prod.category_name,
      qty: prod.qty,
      serial_no: prod.serial_no,
      mac_address: prod.mac_address,
      match_mac_address: prod.match_mac_address,
      match_serial_no: prod.match_serial_no,
      invoice_no: prod.invoice_no,
      invoice_date: prod.invoice_date,
      warranty: prod.warranty,
      warranty_date: prod.warranty_date,
      reason: prod.reason,
      problem: prod.problem
    }
    this.productEditMode = true;
    this.prodForm.patchValue(iObj);
    this.getModels();
    this.loadDate();
    this.showAddItemModal = true;
    if (prod.qr_code && prod.qr_code > 0) {
      this.prodForm.controls.match_mac_address.enable();
      this.prodForm.controls.match_serial_no.enable();
    }
    setTimeout(() => {
      if (prod.invoice_date) {
        $("#inv_invoice_date").datepicker('setDate', new Date(prod.invoice_date))
      }
    }, 800)
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

  changeSubDate(field: any, iField: any) {
    if (this.prodForm.value[field]) {
      let d = this.makeDate(this.prodForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.prodForm.controls[iField].setValue(date);
    }
  }

  changeMatchSr() {
    if (this.prodForm.value.serial_no != this.prodForm.value.match_serial_no) {
      this.toastr.warning('Serial No. matching Alert !', 'Model No.: '+this.prodForm.value.product_name+' <br>This Serial No. did not matched with '+this.prodForm.value.serial_no+' !');
    }
  }

  changeMatchMac() {
    if (this.prodForm.value.mac_address != this.prodForm.value.match_mac_address) {
      this.toastr.warning('MAC Address matching Alert !', 'Model No.: '+this.prodForm.value.product_name+' <br>This MAC Address did not matched with ' + this.prodForm.value.mac_address + ' !');
    }
  }

  checkWar(wDate: any) {
    if (new Date(wDate) < new Date()) {
      return "Expired";
    } else {
      return "Yes";
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

  addItem() {
    this.invalidForm = false;
    if (this.prodForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.prodForm.value.reason.length < 25) {
      this.toastr.warning('Message Alert !', 'Reason must be minumum 25 characters longer.')
      return;
    }

    if (this.prodForm.value.warranty_date && new Date(this.prodForm.value.warranty_date) < new Date()) {
      this.warrantyExpiredModal = true;
      return;
    }

    this.addToList();
    
  }

  addToList() {
    let isFound = -1;
    this.productDetails.forEach((item, key) => {
      if (item.qr_code == this.prodForm.value.qr_code && item.group_id == this.prodForm.value.group_id && item.product_id == this.prodForm.value.product_id) {
        isFound = key;
      }
    });
    if (isFound == -1) {
      this.productDetails.push(this.prodForm.value);
    } else {
      this.showAddItemModal = false;
      this.productDetails[isFound] = this.prodForm.value;
    }
    this.productEditMode = false;
    this.prodForm.reset();
    // this.calc();
  }

  clearItem() {
    this.prodForm.reset();
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.productDetails.length) {
      this.productDetails.forEach((item) => {
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
    params.products = JSON.parse(JSON.stringify(this.productDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateExchangeDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account details update successfully.');
          this.closeForm();
          this.productDetails = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveExchangeDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account details saved successfully.');
          this.closeForm();
          this.productDetails = [];
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

  showData() {
    if (!this.isNotValid(this.demandId)) {
      this.loader.start();
      this.apiService.showExchangeDemand({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.sourceChanged = true;
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.showEditModal = false;
          this.productDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.client_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = desc;
            item.product_name = item.product.model_no;
            item.group_name = item.group.name;
            item.category_name = item.product.category.name;
            item.qr_code = (item.qr_code) ? item.qr_code : 0;
          })
          this.getExchangeDemandProducts();
          if (this.purchaseForm.value.source_demand == 'Sales') {
            this.purchaseForm.controls.ref_repair.disable();
          } else {
            this.purchaseForm.controls.ref_repair.enable();
          }
        }
        this.loader.stop();
        this.demandId = null;
        this.clientId = null;
        this.locationId = null;
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}