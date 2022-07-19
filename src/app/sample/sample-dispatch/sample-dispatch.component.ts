import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-sample-dispatch',
  templateUrl: './sample-dispatch.component.html',
  styleUrls: ['./sample-dispatch.component.css']
})
export class SampleDispatchComponent implements OnInit {

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
  productDetails : any[] = [];
  staffs : any[] = [];
  sampleDemands : any[] = [];
  clients : any[] = [];
  dispatchedDemands : any[] = [];
  deliver_items : any[] = [];
  delivered_products : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  coded_item: any = 'Coded';
  clientId: any = null;
  dispatchId: any = null;
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
      sample_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      store_out_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      delivered_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      sample_dispatch_date: new FormControl(null, [Validators.required]),
      sample_dispatch_time: new FormControl(null, [Validators.required]),
      sample_dispatch_no: new FormControl(null, [Validators.required]),
      t_sample_dispatch_date: new FormControl(null),
      project_id: new FormControl(null),
      client: new FormControl(null),
      location: new FormControl(null),
      project: new FormControl(null),
      sample_no: new FormControl(null),
      sample_date: new FormControl(null),
      sample_time: new FormControl(null),
      approved_by: new FormControl(null),
      status_date: new FormControl(null),
      status_time: new FormControl(null)
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
    this.apiService.editClients({page: 'samddd'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getSampleDemand(status: string) {
    this.loader.start();
    this.apiService.getSampleDemand({status: status, dispatch: 1}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.sampleDemands = data['data'];
      }
    });
  }

  getDispatched() {
    if (this.isNotValid(this.clientId)) {
      return;
    }
    this.loader.start();
    this.apiService.getSampleDispatch({client_id: this.clientId}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.dispatchedDemands = data['data'];
      }
    });
  }

  getSampleDispatchNo() {
    if (this.purchaseForm.value.client_id && this.createMode) {
      this.loader.start();
      this.apiService.getSampleDispatchNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.sample_dispatch_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }
  }

  setRow(item: any) {
    this.setInitDate();
    this.purchaseForm.controls.sample_id.setValue(item.id);
    this.purchaseForm.controls.client_id.setValue(item.client_id);
    this.purchaseForm.controls.executive_id.setValue(item.executive_id);
    this.purchaseForm.controls.location_id.setValue(item.location_id);
    this.purchaseForm.controls.project_id.setValue(item.project_id);
    let project = (item.project) ? item.project.name: '';
    this.purchaseForm.controls.client.setValue(item.client.account_name);
    this.purchaseForm.controls.location.setValue(item.location.name);
    this.purchaseForm.controls.project.setValue(project);
    this.purchaseForm.controls.sample_no.setValue(item.sample_no);
    this.purchaseForm.controls.sample_date.setValue(item.sample_date);
    this.purchaseForm.controls.sample_time.setValue(item.sample_time);
    if (item.store_out_id) {
      this.purchaseForm.controls.store_out_id.setValue(item.store_out_id);
    }
    if (item.delivered_id) {
      this.purchaseForm.controls.delivered_id.setValue(item.delivered_id);
    }
    if (item.statusby) {
      let n = item.statusby.first_name +' '+item.statusby.father_name +' '+item.statusby.last_name;
      this.purchaseForm.controls.approved_by.setValue(n);
      this.purchaseForm.controls.status_date.setValue(item.status_date);
      this.purchaseForm.controls.status_time.setValue(item.status_time);
    }
    this.getSampleDispatchNo();
    this.purchaseForm.controls.executive_id.setValue(item.executive_id);
    this.productDetails = item['details'];
    this.products = [];
    this.productCodedDispatched = false;
    this.productNonCodedDispatched = false;
    this.productDetails.forEach((item, key) => {
      item.dis_qty = (item.qty - item.pending_qty);
      item.old_qty = item.qty;
      let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
      item.description = desc;
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

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  showSampleDemand() {
    this.loader.start();
    this.apiService.showSampleDemand({id: this.purchaseForm.value.sample_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.controls.executive_id.setValue(data['data'].executive_id);
        this.productDetails = data['data']['details'];
        this.products = [];
        this.productCodedDispatched = false;
        this.productNonCodedDispatched = false;
        this.productDetails.forEach((item, key) => {
          item.dis_qty = item.qty - item.pending_qty;
          item.old_qty = item.qty;
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
          this.products.push(item.product);
          if (item.product.qr_code) {
            this.productCodedDispatched = true;    
          } else {
            this.productNonCodedDispatched = true;
          }
        })
        if (this.productCodedDispatched) {
          this.coded_item = 'Coded';
        }
        if (this.productNonCodedDispatched) {
          this.coded_item = 'Non-Coded';
        }
      }
    });
  }

  showSampleDispatch() {
    this.loader.start();
    this.apiService.showSampleDispatch({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1 && data['data']) {
        this.purchaseForm.patchValue(data['data']);
        this.delivered_products = data['data']['details'];
        this.delivered_products.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
        });
        if (data['sample']) {
          let project = (data['sample'].project) ? data['sample'].project.name: '';
          this.purchaseForm.controls.client.setValue(data['sample'].client.account_name);
          this.purchaseForm.controls.location.setValue(data['sample'].location.name);
          this.purchaseForm.controls.project.setValue(project);
          this.purchaseForm.controls.sample_no.setValue(data['sample'].sample_no);
          this.purchaseForm.controls.sample_date.setValue(data['sample'].sample_date);
          this.purchaseForm.controls.sample_time.setValue(data['sample'].sample_time);
          if (data['sample'].statusby) {
            let n = data['sample'].statusby.first_name +' '+data['sample'].statusby.father_name +' '+data['sample'].statusby.last_name;
            this.purchaseForm.controls.approved_by.setValue(n);
            this.purchaseForm.controls.status_date.setValue(data['sample'].status_date);
            this.purchaseForm.controls.status_time.setValue(data['sample'].status_time);
          }
        }
        this.showSampleDemand()
      }
    });
  }

  changeQty(qty: any, index: any) {
    if (!this.isNotValid(this.productDetails[index].product_id)) {
      if (this.productDetails[index].qty < this.productDetails[index].dis_qty) {
        this.productDetails[index].qty = this.productDetails[index].dis_qty;
        this.productDetails[index].pending_qty = 0;
        return
      }
      this.loader.start();
      this.apiService.showProduct({id: this.productDetails[index].product_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          if (qty > data['stock']) {
            this.toastr.warning('Warning',  data['data'].model_no + " " + data['stock'] + " Nos available in STOCK. You can not create it's Demo Demand. Please confirm about availibility with Purchase  Authority.");
            this.productDetails[index].qty = this.productDetails[index].old_qty;
          }
          this.productDetails[index].pending_qty = this.productDetails[index].qty - this.productDetails[index].dis_qty;
        }
      });
    }
  }

  countQty() {
    let countOld = 0;
    this.productDetails.forEach((item) => { countOld += Number(item.pending_qty) });
    return (countOld == 0);
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

  closeForm() {
    this.invalidForm = false;
    this.createMode = false;
    this.editMode = false;
    this.qr_code = null;
    this.group_id = null;
    this.product_id = null;
    this.qty = null;
    this.purchaseForm.reset();
    this.delivered_products = [];
    this.productDetails = [];
    this.sampleDemands = [];
    this.showItemBox = false;
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getSampleDemand('Approved');
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.sample_dispatch_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.sample_dispatch_time.setValue(tims);
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
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
    let pqty = 0;
    let description = '';
    let remark = '';
    let rate = 0;
    let gst_percentage = 0;
    let found = false;
    this.productDetails.forEach((item) => {
      if (item.group_id == this.group_id && this.product_id == item.product_id) {
        qty = item.qty;
        pqty = item.pending_qty;
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
        this.toastr.error('Gentleman !', 'This is '+val[0].model_no+'. There is no demand for this item. Sorry, I can not allow to dispatch. Please check.');
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

    if (this.createMode) {
      qty = pqty;
    }

    if (this.qty > qty) {
      let val = this.products.filter((row) => { return (row.id == this.product_id) });
      if (val.length) {
        this.toastr.error('Gentleman !', 'This is '+val[0].model_no+'. You are not allowed to deliver more qnty than in demand. Please check.');
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

    this.deliver_items.push({
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

    this.productDetails.forEach((item) => {
      if (item.group_id == this.group_id && this.product_id == item.product_id) {
        item.pending_qty = item.pending_qty - this.qty;
        item.dis_qty = item.dis_qty + this.qty;
      }
    });
    
    this.qr_code = null;
    this.group_id = null;
    this.product_id = null;
    this.qty = null;
    this.deliverItems();
    this.setProducts();
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

  undoItems() {
    this.deliver_items = [];
  }
  
  deliverItems() {
    this.deliver_items.forEach((item) => {
      this.delivered_products.push(item);
    });    
    this.deliver_items = [];
    // this.productDetails.forEach((item: any) => {
    //   item.pending_qty = item.qty;
    //   if (this.delivered_products.length) {
    //     this.delivered_products.forEach((im) => {
    //       if (im.product_id == item.product_id && im.group_id == item.group_id) {
    //         item.pending_qty = item.pending_qty - im.qty;
    //       }
    //     });
    //   }
    // });
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
        item.dis_qty = item.dis_qty - row.qty;
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
    
    if (this.delivered_products.length == 0) {
      this.toastr.error('ERROR', 'Please enter dispatch details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.products = this.delivered_products;
    params.items = this.productDetails;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateSampleDispatch(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Dispatch Detail Changed Successfully');
          this.closeForm();
          this.apiService.applyNotificationCount('Sample');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveSampleDispatch(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Dispatch Detail Changed Successfully');
          this.closeForm();
          this.apiService.applyNotificationCount('Sample');
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
    if (this.isNotValid(this.clientId) || this.isNotValid(this.dispatchId)) {
      return
    }
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.id.setValue(this.dispatchId);
    this.showEditModal = false;
    this.showSampleDispatch();
    this.clientId = null;
    this.dispatchId = null;
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }
}