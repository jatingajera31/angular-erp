import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-scrap-item',
  templateUrl: './scrap-item.component.html',
  styleUrls: ['./scrap-item.component.css']
})
export class ScrapItemComponent implements OnInit {

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
  isFocus = false;
  suppliers : any[] = [];
  staffs : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  clients : any[] = [];
  scrapItems : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  challans : any[] = [];
  scraps : any[] = [];
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
      client_id: new FormControl(null),
      scrap_transaction_no: new FormControl(null, Validators.required),
      scrap_challan_id: new FormControl(null, Validators.required),
      challan_date: new FormControl(null),
      challan_time: new FormControl(null),
      scrap_challan_approved_by: new FormControl(null),
      scrap_date: new FormControl(null, Validators.required),
      t_scrap_date: new FormControl(null),
      scrap_time: new FormControl(null, Validators.required),
      scrapped_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      scrap_challan_approved_remark: new FormControl(null),
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
      invoice_date: new FormControl(null)
    });
    this.getStaff();
    this.getProductGroup();
    this.getItemScrapChallan();
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

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
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

  getItemScrapChallan() {
    this.apiService.getItemScrapChallan({status: 'Approved'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.challans = data['data'];
      }
    });
  }

  getItemScrap() {
    this.apiService.getItemScrap({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.scraps = data['data'];
      }
    });
  }

  getItemScrapNo() {
    if (this.createMode) {
      this.loader.start();
      this.apiService.getItemScrapNo({}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.scrap_transaction_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }
  }

  changeChallan() {
    if (!this.isNotValid(this.purchaseForm.value.scrap_challan_id)) {
      let recod = this.challans.filter((itm) => { return (itm.id == this.purchaseForm.value.scrap_challan_id) });
      if (recod.length) {
        let dt = this.datePipe.transform(new Date(recod[0].scrap_date), 'dd/MM/y');
        this.purchaseForm.controls.challan_date.setValue(dt);
        this.purchaseForm.controls.challan_time.setValue(recod[0].scrap_time);
        this.purchaseForm.controls.scrap_challan_approved_by.setValue(recod[0].status_by);
        this.purchaseForm.controls.scrap_challan_approved_remark.setValue(recod[0].approved_remarks);
        this.showItemScrapChallan();
      }
    } else {
      this.purchaseForm.controls.challan_date.setValue(null);
      this.purchaseForm.controls.challan_time.setValue(null);
      this.purchaseForm.controls.scrap_challan_approved_by.setValue(null);
      this.purchaseForm.controls.scrap_challan_approved_remark.setValue(null);
      this.scrapItems = [];
    }
  }

  showItemScrapChallan() {
    this.loader.start();
    this.apiService.showItemScrapChallan({id: this.purchaseForm.value.scrap_challan_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.scrapItems = data['data']['details'];
        this.scrapItems.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
          item.category_name = item.product.category.name;
          item.product_name = item.product.model_no;
        })
      }
    });
  }

  showItemScrap() {
    this.loader.start();
    this.apiService.showItemScrap({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1 && data['data']) {
        this.purchaseForm.patchValue(data['data']);
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item, key) => {
          item.category_name = item.product.category.name;
          item.product_name = item.product.model_no;
        })
        if (data['data']['scrap_date']) {
          $("#scrap_date").datepicker("setDate", new Date(data['data']['scrap_date']));
        }
        this.changeChallan();
      }
    });
  }

  viewAddItemModal() {
    this.invalidForm = false;
    this.showAddItemModal = true;
  }

  closeItemModal() {
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
      this.apiService.deleteItemScrap({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Exchange Demand deleted successfully.'); 
        }
      });
    }
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
          let purchase_rate = this.products[r]['purchase_rate'];
          if (this.products[r]['gst_rate']) {
            gst_amount = (parseFloat(purchase_rate) * parseFloat(this.products[r]['gst_rate'])) / 100;
            gst_amount = gst_amount.toFixed(2);
          }
          this.prodForm.controls.purchase_rate.setValue(purchase_rate);
          this.prodForm.controls.gst_amount.setValue(gst_amount);
        }
      }
    }
  }

  getQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.prodForm.controls.group_id.clearValidators();
      this.prodForm.controls.product_id.clearValidators();
      this.prodForm.controls.group_id.updateValueAndValidity();
      this.prodForm.controls.product_id.updateValueAndValidity();
      this.prodForm.controls.match_serial_no.enable();
      this.prodForm.controls.match_mac_address.enable();
      this.prodForm.controls.qty.disable();
      this.loader.start();
      // this.apiService.getExchangeQrCode({qr_code: this.prodForm.value.qr_code, exchange_id: this.purchaseForm.value.exchange_id}).subscribe((data:any) => {
      this.apiService.getExchangeQrCode({qr_code: this.prodForm.value.qr_code, scrap_challan_id: this.purchaseForm.value.scrap_challan_id}).subscribe((data:any) => {
        if (data && data['data']) {
          let gst_amount = null;
          let purchase_rate = data['data']['prmodel']['purchase_rate'];
          let warranty_date = null;
          if (data['data']['prmodel']['gst_rate']) {
              gst_amount = (parseFloat(purchase_rate) * parseFloat(data['data']['prmodel']['gst_rate'])) / 100;
              gst_amount = gst_amount.toFixed(2);
          }
          let desc = data['data']['prmodel'].description +'&#13;&#10;Prod. Code: '+ data['data']['prmodel'].product_code +'&#13;&#10;Warranty: '+ data['data']['prmodel'].supplier_warranty +' Months&#13;&#10;HSN Code: '+ data['data']['prmodel'].hsn_code;
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
            mac_address: data['data']['mac_address'],
            invoice_no: (data['data']['prcode']) ? data['data']['prcode']['purchase']['invoice_no']: null,
            invoice_date: (data['data']['prcode']) ? data['data']['prcode']['purchase']['invoice_date']: null,
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
      this.prodForm.reset();
      this.prodForm.controls.qr_code.setValue(0);
      this.prodForm.controls.qty.enable();
      this.prodForm.controls.group_id.setValidators([Validators.required]);
      this.prodForm.controls.product_id.setValidators([Validators.required]);
      this.prodForm.controls.group_id.updateValueAndValidity();
      this.prodForm.controls.product_id.updateValueAndValidity();
    }
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
      this.apiService.updateItemScrap(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item Scrapped Successfully.');
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
      this.apiService.saveItemScrap(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item Scrapped Successfully.');
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

  resetForm() {
    if (this.isNotValid(this.purchaseForm.value.id)) {
      this.purchaseForm.reset();
      this.productDetails = [];
      this.scrapItems = [];
    } else {
      this.showItemScrap();
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.scrapItems = [];
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
    this.getItemScrapNo()
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    this.getItemScrap()
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
