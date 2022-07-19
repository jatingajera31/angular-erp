import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-sales-return-received',
  templateUrl: './sales-return-received.component.html',
  styleUrls: ['./sales-return-received.component.css']
})
export class SalesReturnReceivedComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  showAddItemModal = false;
  isFocus = false;
  productEditMode = false;
  isZero = false;
  suppliers : any[] = [];
  services : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  salesReturnDemand : any[] = [];
  salesReturnReceived : any[] = [];
  productDetails : any[] = [];
  salesDemandDetails : any[] = [];
  selectedModal: any;
  selectedProductIndex:any;
  sales_return_id:any = null;
  client_id:any = null;
  prdObj: any = {
    group_id: null,
    group_name: null,
    product_id: null,
    product_name: null,
    qr_code: null,
    description: null,
    qty: null,
    rate: 0,
    amount: 0,
    gst_percentage: 0,
    gst_amount: 0,
    serial_no: null,
    match_serial_no: null,
    mac_address: null,
    match_mac_address: null,
    total_amount: null,
    challan_no: null,
    challan_date: null,
    reason: null
  }
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      project_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      sales_return_no: new FormControl(null, [Validators.required]),
      sales_return_demand_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      return_date: new FormControl(null, [Validators.required]),
      t_return_date: new FormControl(null),
      collected_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      return_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      sales_return_demand_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      sales_executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      remarks: new FormControl(null, [Validators.required]),
      total_qty: new FormControl(null),
      total_gst_amount: new FormControl(null),
      total_amount: new FormControl(null),
      action_detail: new FormControl(null),
      action_by: new FormControl(null),
      action_date: new FormControl(null),
      action_time: new FormControl(null),
    });

    this.getProductGroup();
    this.getClients();
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
    this.apiService.getProductGroup({coded_item: 'Non-Coded'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getModels() {
    if (this.prdObj.group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.prdObj.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  changeModel() {
    if (this.prdObj.product_id) {
      for(var r in this.products) {
        if (this.products[r].id == this.prdObj.product_id) {
          this.prdObj.product_name = this.products[r].model_no;
          this.prdObj.description = this.products[r].description;
          this.prdObj.rate = this.products[r].max_retail_price;
          this.prdObj.gst_percentage = this.products[r].gst_rate;
          this.prdObj.serial_no = this.products[r].serial_no;
          this.prdObj.mac_address = this.products[r].mac_address;
          this.changeRate();
        }
      }
    }
  }

  changeRate() {
    if (this.prdObj.gst_percentage) {
      this.prdObj.gst_amount = (parseFloat(this.prdObj.rate) * parseFloat(this.prdObj.gst_percentage)) / 100;
    }
  }

  addProdDetail() {
    this.productDetails.push({
      id: null,
      group_id: null,
      product_id: null,
      group_name: null,
      product_name: null,
      category: null,
      description: null,
      qty: null,
      reason: null,
      show: false,
      products: []
    });
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

  getDemandBy() {
    if (this.purchaseForm.value.sales_return_demand_by) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.sales_return_demand_by) });
      if (row.length) {
        return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
      }
      return ""
    } else {
      return ""
    }
  }

  getSalesReturnDemand() {
    this.loader.start();
    this.apiService.getSalesReturnDemand({status: 'Approved', client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.salesReturnDemand = data['data'];
      }
    });
  }

  getSalesReturnReceived() {
    this.loader.start();
    this.apiService.getSalesReturnReceived({client_id: this.client_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.salesReturnReceived = data['data'];
      }
    });
  }

  getSalesReturnReceivedNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getSalesReturnReceivedNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.sales_return_no.setValue(data['data']);
        }
      });
    } else {
      this.purchaseForm.controls.sales_return_no.setValue(null);
    }
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getClients() {
    this.apiService.editClients({page: 'srd', status: 'Approved'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getLocation() {
    this.apiService.getLocation({parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getProject() {
    this.apiService.getProject({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
  }

  showSalesReturnDemand() {
    this.loader.start();
    this.apiService.showSalesReturnDemand({id: this.purchaseForm.value.sales_return_demand_id, approval: 1}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.controls.sales_return_demand_by.setValue(data['data']['sales_return_demand_by'])
        this.purchaseForm.controls.sales_executive_id.setValue(data['data']['sales_executive_id'])
        this.salesDemandDetails = data['data']['details'];
        this.salesDemandDetails.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
          item.category = item.product.category.name
        })
      }
    });
  }

  getLocationName() {
    if (!this.isNotValid(this.purchaseForm.value.location_id) && this.locations.length) {
      let lc = this.locations.filter((row) => { return (row.id == this.purchaseForm.value.location_id) });
      return (lc.length) ? lc[0].name: '';
    }
    return "";
  }

  getProjectName() {
    if (!this.isNotValid(this.purchaseForm.value.project_id) && this.locations.length) {
      let lc = this.projects.filter((row) => { return (row.id == this.purchaseForm.value.project_id) });
      return (lc.length) ? lc[0].name: '';
    }
    return "";
  }

  showSalesReturnReceived() {
    this.loader.start();
    this.apiService.showSalesReturnReceived({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.patchValue(data['data']);
        this.getLocation();
        this.getSalesReturnDemand();
        this.getProject();
        this.showSalesReturnDemand();
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item) => {
          item.product_name = item.product.model_no;
          item.description = item.product.description;
          item.serial_no = item.product.serial_no;
          item.mac_address = item.product.mac_address;
        });
      }
    });
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.client_id = null;
    this.sales_return_id = null;
    this.salesDemandDetails = [];
  }

  viewCreateMode() {
    if (this.createMode) {
      return
    }
    this.createMode = true;
    this.editMode = false;
    this.productDetails = [];
    this.salesDemandDetails = [];
    this.purchaseForm.reset();
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.return_date.setValue(date);
  }
  
  viewEditMode() {
    if (this.editMode) {
      return
    }
    this.productDetails = [];
    this.salesDemandDetails = [];
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
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
    params.products = this.productDetails;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateSalesReturnReceived(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Sales Return Demand Updated Successfully.');
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
      this.apiService.saveSalesReturnReceived(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Sales Return Demand Saved Successfully.');
          this.closeForm();
          this.getClients()
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
      this.toastr.error('ERROR', 'Please Select Sales Return Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Sales Return Demand.');
    } else {
      this.loader.start();
      this.apiService.deleteSalesReturnReceived({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Sales Return Demand deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.id.setValue(this.sales_return_id);
    this.showEditModal = false;
    this.showSalesReturnReceived();
  }

  getQrCode() {
    if (this.prdObj.qr_code && this.prdObj.qr_code != '0') {
      this.isZero = false;
      this.loader.start();
      this.apiService.getDeliveryQrCode({qr_code: this.prdObj.qr_code}).subscribe(data => {
        if (data && data['data']) {
          this.products = [data['data']['product']];
          this.prdObj.group_id = data['data']['group_id'];
          this.prdObj.group_name = data['data']['group']['name'];
          this.prdObj.product_name = data['data']['product']['model_no'];
          this.prdObj.product_id = data['data']['product_id'];
          this.prdObj.description = data['data']['description'];
          this.prdObj.qty = parseInt(data['data']['qty']);
          this.prdObj.rate = data['data']['rate'];
          this.prdObj.mac_address = data['data']['mac_address'];
          this.prdObj.serial_no = data['data']['serial_no'];
          this.prdObj.challan_no = data['data']['challan']['delivery_challan_no'];
          this.prdObj.challan_date = data['data']['challan']['challan_date'];
          this.prdObj.gst_percentage = data['data']['product']['gst_rate'];
          this.changeRate();
        } else {
          this.prdObj.qr_code = null;
          this.toastr.error('ERROR', 'Invalid QR Code.');
        }
        this.loader.stop();
      })
    }
    if (this.prdObj.qr_code == '0') {
      this.isZero = true;
    }
  }

  viewAddItemModal() {
    this.showAddItemModal = true;
    this.loadMac();
  }

  loadMac() {
    // setTimeout(() => {
    //   $('#match_mac_address').mask('00:00:00:00:00:00');
    // },500)
  }

  addItem() {
    if (!this.prdObj.qr_code) {
      this.toastr.error('ERROR', 'Please enter QR Code.');
      return;
    }

    if (this.prdObj.qr_code && this.prdObj.qr_code == '0') {
      if (this.isNotValid(this.prdObj.group_id)) {
        this.toastr.error('ERROR', 'Please enter product group.');
        return;
      }

      if (this.isNotValid(this.prdObj.product_id)) {
        this.toastr.error('ERROR', 'Please enter model no.');
        return;
      }
    }

    if (this.isNotValid(this.prdObj.qty)) {
      this.toastr.error('ERROR', 'Please enter QR Code.');
      return;
    }

    this.productDetails.push(this.prdObj);
    this.undoItem();
    this.calculateRates();
  }

  calculateRates() {
    let total_qty = 0;
    let total_amount = 0;
    let total_gst_amount = 0;
    this.productDetails.forEach((item) => {
      if (!item.rate) {
        item.rate = 0;
      }
      item.amount = (item.rate * item.qty);
      item.gst_amount = (item.amount * item.gst_percentage) / 100;
      item.gst_amount = Math.round(item.gst_amount * 100) / 100;
      item.amount = Math.round(item.amount * 100) / 100;
      total_qty += item.qty;
      total_amount += item.amount;
      total_gst_amount += item.gst_amount;
    });
    this.purchaseForm.controls.total_qty.setValue(total_qty);
    this.purchaseForm.controls.total_amount.setValue(total_amount);
    this.purchaseForm.controls.total_gst_amount.setValue(total_gst_amount);
  }

  undoItem() {
    this.prdObj = {
      group_id: null,
      group_name: null,
      product_id: null,
      product_name: null,
      qr_code: null,
      description: null,
      qty: null,
      rate: 0,
      amount: 0,
      gst_percentage: 0,
      gst_amount: 0,
      serial_no: null,
      match_serial_no: null,
      mac_address: null,
      match_mac_address: null,
      total_amount: null,
      challan_no: null,
      challan_date: null,
      reason: null
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

  toFixed(value: any) {
    if (value) {
      value = parseFloat(value);
      return value.toFixed(2);
    } else {
      return value;
    }
  }

}