import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-spare-service-return-receipt',
  templateUrl: './spare-service-return-receipt.component.html',
  styleUrls: ['./spare-service-return-receipt.component.css']
})
export class SpareServiceReturnReceiptComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showItemBox = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  isFocus = false;
  isFocus2 = false;
  productCodedDispatched = false;
  productNonCodedDispatched = false;
  productGroups : any[] = [];
  products : any[] = [];
  suppliers : any[] = [];
  dispatchedDemands : any[] = [];
  productDetails : any[] = [];
  delivered_products : any[] = [];
  deliver_items : any[] = [];
  receiptDemands : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  coded_item: any = 'Coded';
  clientId: any = null;
  ReceiptId: any = null;
  group_id: any = null;
  product_id: any = null;
  qr_code: any;
  qty: any;
  selectedProductId: any;
  selectedModal: any;
  selectedProductIndex: any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      spare_receipt_no: new FormControl(null, [Validators.required]),
      project_id: new FormControl(null),
      spare_dispatch_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      store_in_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      return_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      noticed_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      spare_receipt_date: new FormControl(null, [Validators.required]),
      spare_receipt_time: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
      t_spare_receipt_date: new FormControl(null),
      spare_dispatch_no: new FormControl(null),
      spare_dispatch_date: new FormControl(null),
      client: new FormControl(null),
      location: new FormControl(null),
      project: new FormControl(null)
    });
    this.getStaff();
    this.getProductGroup();
  }

  @HostListener('click', ['$event'])
  mouseClick(evt: any) {
    const flyoutElement = document.getElementsByClassName('adminActions');
      let targetElement = evt.target;
      let targetElement1 = evt.target;
      do {
          if (targetElement.classList && targetElement.classList.contains('adminActions')) {
            this.isFocus = true;
            return;
          }
          targetElement = targetElement['parentNode'];
      } while (targetElement);

      this.isFocus = false;
      this.setFalseData(-1);

      do {
          if (targetElement1 && targetElement1.classList && targetElement1.classList.contains('adminActionsDemannd')) {
            this.isFocus2 = true;
            return;
          }
          targetElement1 = targetElement1['parentNode'];
      } while (targetElement1);

      this.isFocus2 = false;
      this.setFalseDataD(-1);
  }

  setFalseData(k: number) {
    this.delivered_products.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  setFalseDataD(k: number) {
    this.productDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
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

  getDispatched() {
    this.loader.start();
    this.apiService.getSpareDispatch({is_return: 1}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.dispatchedDemands = data['data'];
        this.dispatchedDemands.forEach((item) => {
          item.delayed = false;
          let date1: any = new Date(item.spare_dispatch_date);
          let date2: any = new Date();
          let diffTime = Math.abs(date2 - date1);
          item.diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          if (item.spare) {
            date1.setDate(date1.getDate()+Number(item.spare.demo_days));
            let disDate: any = new Date();
            let diffTime2 = Math.abs(disDate - date1);
            let delayed = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24)); 
            item.delayedDays = delayed;
            item.delayed = (new Date() > date1);
          }
        });
      }
    });
  }

  getSpareReceiptNo() {
    if (this.purchaseForm.value.client_id && this.createMode) {
      this.loader.start();
      this.apiService.getSpareReceiptNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.spare_receipt_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }
  }

  setRow(item: any) {
    this.closeBox();
    this.delivered_products = [];
    this.productDetails = [];
    this.setInitDate();
    this.purchaseForm.controls.spare_dispatch_id.setValue(item.id);
    this.purchaseForm.controls.client_id.setValue(item.client_id);
    this.purchaseForm.controls.executive_id.setValue(item.demo?.executive_id);
    this.purchaseForm.controls.location_id.setValue(item.location_id);
    this.purchaseForm.controls.project_id.setValue(item.project_id);
    let project = (item.project) ? item.project.name: '';
    this.purchaseForm.controls.client.setValue(item.client.account_name);
    this.purchaseForm.controls.location.setValue(item.location.name);
    this.purchaseForm.controls.project.setValue(project);
    this.purchaseForm.controls.spare_dispatch_no.setValue(item.spare_dispatch_no);
    this.purchaseForm.controls.spare_dispatch_date.setValue(item.spare_dispatch_date);
    this.getSpareReceiptNo();
    this.showSpareDispatch();
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

  showSpareDispatch() {
    this.loader.start();
    this.apiService.showSpareDispatch({id: this.purchaseForm.value.spare_dispatch_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1 && data['data']) {
        this.productDetails = data['data']['details'];
        this.products = [];
        this.productCodedDispatched = false;
        this.productNonCodedDispatched = false;
        this.productDetails.forEach((item, key) => {
          item.pending_qty = item.qty;
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
          if (this.delivered_products.length) {
            this.delivered_products.forEach((im) => {
              if (im.product_id == item.product_id && im.group_id == item.group_id) {
                item.pending_qty = item.pending_qty - im.qty;
              }
            });
          }
          this.products.push(item.product)
          if (item.product.qr_code) {
            this.productCodedDispatched = true;    
          } else {
            this.productNonCodedDispatched = true;
          }
        });
        if (this.productCodedDispatched) {
          this.coded_item = 'Coded';
        }
        if (this.productNonCodedDispatched) {
          this.coded_item = 'Non-Coded';
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
    this.dispatchedDemands = [];
    this.showItemBox = false;
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getDispatched();
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.spare_receipt_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.spare_receipt_time.setValue(tims);
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getEditClients();
  }

  getEditClients() {
    this.apiService.editClients({page: 'ddr'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.delivered_products.length == 0) {
      this.toastr.error('ERROR', 'Please enter return receipt details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.products = this.delivered_products;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateSpareReceipt(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Spare Return Updated Successfully');
          this.closeForm();
          this.apiService.applyNotificationCount('Spare');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveSpareReceipt(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Spare Return Saved Successfully');
          this.closeForm();
          this.apiService.applyNotificationCount('Spare');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  viewProductDetailModal(prod: any) {
    this.selectedProductId = prod.product_id;
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

  closeBox() {
    this.showItemBox = false;
  }

  showBox() {
    this.showItemBox = true;
  }

  undoBox() {
    this.coded_item = 'Coded';
    this.qr_code = null;
    this.group_id = null;
    this.product_id = null;
    this.qty = null;
  }

  getQrCode() {
    if (this.coded_item == 'Coded') {
      if (this.qr_code && this.qr_code != '0') {
        this.loader.start();
        this.apiService.getProductQrCode({qr_code: this.qr_code}).subscribe(data => {
          if (data['status'] == 1 && data['data']) {
            this.products = [data['prmodel']];
            this.group_id = data['data']['item']['group_id'];
            this.product_id = data['data']['item']['product_id'];
            this.qty = 1;
            this.saveBox()
          } else {
            this.qr_code = null;
            this.toastr.error('ERROR', 'Invalid QR Code.');
          }
          this.loader.stop();
        })
      }
    } else {
      this.saveBox()
    }
  }

  setProducts() {
    this.products = [];
    this.productDetails.forEach((item, key) => {
      this.products.push(item.product)
    });
  }

  setGroupId() {
    this.group_id = null;
    if (!this.isNotValid(this.product_id)) {
      let val = this.products.filter((row) => { return (row.id == this.product_id) });
      if (val.length) {
        this.group_id = val[0].group_id;
      }
    }
  }

  saveBox() {
    if (this.isNotValid(this.coded_item)) {
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.coded_item == 'Coded' && this.isNotValid(this.qr_code)) {
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;  
    }

    if (this.coded_item == 'Non-Coded' && (this.isNotValid(this.group_id) || this.isNotValid(this.product_id) || this.isNotValid(this.qty))) {
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let qty = 0;
    let description = '';
    let remark = '';
    let rate = 0;
    let gst_percentage = 0;
    let found = false;
    this.productDetails.forEach((item) => {
      if (item.group_id == this.group_id && this.product_id == item.product_id) {
        qty += item.qty;
        description = item.description;
        rate = item.rate;
        gst_percentage = item.gst_percentage;
        remark = item.remark;
        found = true;
      }
    });

    if (!found) {
        let val = this.products.filter((row) => { return (row.id == this.product_id) });
        if (val.length) {
          this.toastr.error('Gentleman !', 'This is '+val[0].model_no+'. This is different item you are returning. Sorry, I can not allow to proceed with this item. Please check.');
        }
        return
    }

    if (this.deliver_items.length) {
      this.deliver_items.forEach((item) => {
        if (item.group_id == this.group_id && this.product_id == item.product_id) {
          qty = qty - item.qty;
        }
      });
    }

    if (this.delivered_products.length) {
      this.delivered_products.forEach((item) => {
        if (item.group_id == this.group_id && this.product_id == item.product_id) {
          qty = qty - item.qty;
        }
      });
    }

    if (this.qty > qty) {
      let val = this.products.filter((row) => { return (row.id == this.product_id) });
      if (val.length) {
        // this.toastr.error('Gentleman !', 'This is '+val[0].model_no+'. You are not allowed to deliver more qnty than in demand. Please check.');
        this.toastr.error('Gentleman !', 'Sorry, you are not allow to return more qnty than dispatched.');
      }
      if (this.coded_item == 'Coded') {
        this.group_id = null;
        this.product_id = null;
        this.qty = null;
      }
      return;
    }

    let group = this.productGroups.filter((item) => { return (item.id == this.group_id) });
    let product = this.products.filter((item) => { return (item.id == this.product_id) });

    let amount = (this.qty * rate);
    let gst_amount = (amount * gst_percentage) / 100;
    let total_amount = (amount + gst_amount);

    this.delivered_products.push({
      group: group[0],
      product: product[0],
      coded_item: this.coded_item,
      qr_code: this.qr_code,
      group_id: this.group_id,
      product_id: this.product_id,
      description: description,
      qty: this.qty,
      rate: rate,
      gst_percentage: gst_percentage,
      amount: amount,
      gst_amount: gst_amount,
      total_amount: total_amount,
      remarks: remark
    });

    this.productDetails.forEach((item: any) => {
      item.pending_qty = item.qty;
      if (this.delivered_products.length) {
        this.delivered_products.forEach((im) => {
          if (im.product_id == item.product_id && im.group_id == item.group_id) {
            item.pending_qty = item.pending_qty - im.qty;
          }
        });
      }
    });
    
    this.qr_code = null;
    this.group_id = null;
    this.product_id = null;
    this.qty = null;
    this.setProducts();
  }

  showData() {
    if (this.isNotValid(this.clientId) || this.isNotValid(this.ReceiptId)) {
      return
    }
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.id.setValue(this.ReceiptId);
    this.showEditModal = false;
    this.showSpareReceipt();
    this.clientId = null;
    this.ReceiptId = null;
  }

  showSpareReceipt() {
    this.loader.start();
    this.apiService.showSpareReceipt({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1 && data['data']) {
        this.purchaseForm.patchValue(data['data']);
        this.delivered_products = data['data']['details'];
        this.delivered_products.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
        });
        if (data['data']['client']) {
          this.purchaseForm.controls.client.setValue(data['data']['client']['account_name']);
        }
        if (data['data']['location']) {
          this.purchaseForm.controls.location.setValue(data['data']['location']['name']);
        }
        if (data['data']['project']) {
          this.purchaseForm.controls.project.setValue(data['data']['project']['name']);
        }
        // this.showSpareDemand()
      }
    });
  }

  getSpareReceipt() {
    if (this.isNotValid(this.clientId)) {
      return;
    }
    this.loader.start();
    this.apiService.getSpareReceipt({client_id: this.clientId}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.receiptDemands = data['data'];
      }
    });
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Spare Return.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Spare Return.');
    } else {
      this.loader.start();
      this.apiService.deleteService({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Spare Return deleted successfully.'); 
        }
      });
    }
  }
  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }
}
