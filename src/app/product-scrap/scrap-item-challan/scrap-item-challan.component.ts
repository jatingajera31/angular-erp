import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-scrap-item-challan',
  templateUrl: './scrap-item-challan.component.html',
  styleUrls: ['./scrap-item-challan.component.css']
})
export class ScrapItemChallanComponent implements OnInit {

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
  isZero = false;
  isFocus = false;
  suppliers : any[] = [];
  staffs : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  clients : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  ExchangeDemands : any[] = [];
  challans : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  locationId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      scrap_item_no: new FormControl(null, Validators.required),
      // exchange_id: new FormControl(null, Validators.required),
      project_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      scrap_date: new FormControl(null, Validators.required),
      t_scrap_date: new FormControl(null),
      scrap_time: new FormControl(null, Validators.required),
      source_item: new FormControl(null, Validators.required),
      request_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      checked_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      connect_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      ref_repair: new FormControl(null),
      repair_date_time: new FormControl(null),
      // exchange_date_time: new FormControl(null),
      remarks: new FormControl(null),
    });
    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      category_name: new FormControl(null),
      description: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      purchase_rate: new FormControl(null),
      gst_amount: new FormControl(null),
      serial_no: new FormControl(null),
      match_serial_no: new FormControl(null),
      mac_address: new FormControl(null),
      match_mac_address: new FormControl(null),
      invoice_no: new FormControl(null),
      invoice_date: new FormControl(null),
      warranty: new FormControl(null),
      warranty_date: new FormControl(null),
      problem: new FormControl(null),
      reason: new FormControl(null, [Validators.required, Validators.minLength(15)])
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
      $( "#scrap_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.scrap_date.setValue(date);
        this.purchaseForm.controls.t_scrap_date.setValue(e.format());
      });
      $("#scrap_date").mask('00/00/0000');

      $('#scrap_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.scrap_time.setValue(this.getTimes(time));
        }
      });

    }, 1000);
  }

  changeSource() {
    if (this.purchaseForm.value.source_item == 'Sales') {
      this.purchaseForm.controls.ref_repair.disable();
    } else {
      this.purchaseForm.controls.ref_repair.enable();
    }
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  // changeExchange() {
  //   if (!this.isNotValid(this.purchaseForm.value.exchange_id)) {
  //     let recod = this.ExchangeDemands.filter((itm) => { return (itm.id == this.purchaseForm.value.exchange_id) });
  //     console.log(recod);
  //     if (recod.length) {
  //       let dt = this.datePipe.transform(new Date(recod[0].exchange_date), 'dd/MM/y') + ' ' + recod[0].exchange_time;
  //       this.purchaseForm.controls.exchange_date_time.setValue(dt);
  //     }
  //   } else {
  //     this.purchaseForm.controls.exchange_date_time.setValue(null);
  //   }
  // }

  // getExchangeDemand(status: boolean) {
  //   if (this.purchaseForm.value.client_id && this.purchaseForm.value.location_id) {
  //     this.loader.start();
  //     this.apiService.getExchangeDemand({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
  //       this.loader.stop();
  //       if (data && data['status'] == 1) {
  //         this.ExchangeDemands = data['data'];
  //         if (status) {
  //           this.changeExchange();
  //         }
  //       }
  //     });
  //   }
  // }

  getItemScrapChallan() {
    if (this.clientId) {
      this.loader.start();
      this.apiService.getItemScrapChallan({client_id: this.clientId}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.challans = data['data'];
        }
      });
    }
  }

  getProject() {
    this.apiService.getProject({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
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

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  checkWar(wDate: any) {
    if (new Date(wDate) < new Date()) {
      return "Expired";
    } else {
      return "Yes";
    }
  }

  loadDate() {
    // setTimeout(() => {
    //   $('#match_mac_address').mask('00:00:00:00:00:00');
    // },500)
  }

  getQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.isZero = false;
      this.prodForm.controls.match_serial_no.enable();
      this.prodForm.controls.match_mac_address.enable();
      this.prodForm.controls.qty.disable();
      this.loader.start();
      this.apiService.getExchangeQrCode({qr_code: this.prodForm.value.qr_code, exchange_id: this.purchaseForm.value.exchange_id}).subscribe((data:any) => {
        if (data && data['data']) {

          let gst_amount = null;
          let purchase_rate = (this.purchaseForm.value.source_item == 'Stock') ? data['data']['prmodel']['purchase_rate'] : data['data']['prmodel']['max_retail_price'];
          let warranty_date = null;
          if (data['data']['prmodel']['gst_rate']) {
              gst_amount = (parseFloat(purchase_rate) * parseFloat(data['data']['prmodel']['gst_rate'])) / 100;
              gst_amount = gst_amount.toFixed(2);
          }

          let desc = data['data']['prmodel'].description +'&#13;&#10;Prod. Code: '+ data['data']['prmodel'].product_code +'&#13;&#10;Warranty: '+ data['data']['prmodel'].supplier_warranty +' Months&#13;&#10;HSN Code: '+ data['data']['prmodel'].hsn_code;
          if (data['data']['prmodel']['extended_warranty'] == '1') {
            let extended_month = data['data']['prmodel'].extended_month;
            // let challan_date = new Date(this.purchaseForm.value.exchange_date_time);
            let challan_date = new Date();
            let date = new Date(challan_date.setMonth(challan_date.getMonth() + Number(extended_month)));
            warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
          }
          let iObj = {
            qr_code: data['data']['qr_code'],
            group_id: data['data']['group_id'],
            group_name: data['data']['group']['name'],
            product_id: data['data']['product_id'],
            product_name: data['data']['prmodel']['model_no'],
            category_name: (data['data']['prmodel']['category']) ? data['data']['prmodel']['category']['name']: null,
            description: desc,
            qty: 1,
            purchase_rate: purchase_rate,
            gst_amount: gst_amount,
            serial_no: data['data']['serial_no'],
            match_serial_no: null,
            mac_address: data['data']['mac_address'],
            match_mac_address: null,
            invoice_no: (data['data']['prcode']) ? data['data']['prcode']['purchase']['invoice_no']: null,
            invoice_date: (data['data']['prcode']) ? data['data']['prcode']['purchase']['invoice_date']: null,
            warranty: data['data']['prmodel']['extended_warranty'],
            warranty_date: warranty_date,
            reason: null,
            problem: null,
          }

          
          this.prodForm.patchValue(iObj);
        } else {
          this.prodForm.reset();
          this.toastr.error('Sorry Gentleman !', 'QR Code does not match please check or enter correct info.');
        }
        this.loader.stop();
      });
    }
    if (this.prodForm.value.qr_code == '0') {
      this.isZero = true;
      this.prodForm.reset();
      this.prodForm.controls.qr_code.setValue(0);
      this.prodForm.controls.qty.enable();
      this.prodForm.controls.match_serial_no.disable();
      this.prodForm.controls.match_mac_address.disable();
    }
  }

  viewAddItemModal() {
    if (this.isNotValid(this.purchaseForm.value.source_item) || this.isNotValid(this.purchaseForm.value.client_id) || this.isNotValid(this.purchaseForm.value.location_id)) {
      return;
    }
    this.invalidForm = false;
    this.showAddItemModal = true;
    this.loadDate();
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
    this.showAddItemModal = false;
    this.productDetails.push(this.prodForm.value);
    this.calc();
  }

  calc() {
    let basic_amount = 0;
    let gst_amount = 0;
    let final_amount = 0;
    this.productDetails.forEach((item) => {
      basic_amount += parseFloat(item.purchase_rate);
      gst_amount += parseFloat(item.gst_amount);
      final_amount += parseFloat(item.purchase_rate) + parseFloat(item.gst_amount);
    });
    // this.purchaseForm.controls.basic_amount.setValue(basic_amount);
    // this.purchaseForm.controls.gst_amount.setValue(gst_amount);
    // this.purchaseForm.controls.final_amount.setValue(final_amount);
  }

  clearItem() {
    this.prodForm.reset();
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
          this.prodForm.controls.category_name.setValue(this.products[r].category.name);
          this.prodForm.controls.description.setValue(this.products[r].description);
          let gst_amount = null;
          let purchase_rate = (this.purchaseForm.value.source_item == 'Stock') ? this.products[r]['purchase_rate'] : this.products[r]['max_retail_price'];
          if (this.products[r]['gst_rate']) {
            gst_amount = (parseFloat(purchase_rate) * parseFloat(this.products[r]['gst_rate'])) / 100;
            gst_amount = gst_amount.toFixed(2);
          }
          this.prodForm.controls.purchase_rate.setValue(purchase_rate);
          this.prodForm.controls.gst_amount.setValue(gst_amount);
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

  getItemScrapChallanNo() {
    if (this.purchaseForm.value.client_id && this.createMode) {
      this.loader.start();
      this.apiService.getItemScrapChallanNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.scrap_item_no.setValue(this.demandNo);
        }
        this.loader.stop();
      });
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.scrap_date.setValue(date);
    this.purchaseForm.controls.t_scrap_date.setValue(new Date());
    $("#scrap_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.scrap_time.setValue(tims);
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
      this.apiService.updateItemScrapChallan(params).subscribe(data => {
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
      this.apiService.saveItemScrapChallan(params).subscribe(data => {
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
      this.apiService.deleteItemScrapChallan({id: this.purchaseForm.value.id}).subscribe(data => {
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
      this.apiService.showItemScrapChallan({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.showEditModal = false;
          this.productDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = desc;
            item.category_name = item.product.category.name;
            item.product_name = item.product.model_no;
          })
          if (data['data']['scrap_date']) {
            $("#scrap_date").datepicker("setDate", new Date(data['data']['scrap_date']));
          }
          this.getProject();
          // this.getExchangeDemand(true);
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