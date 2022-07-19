import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-delivery-challan-undelivered',
  templateUrl: './delivery-challan-undelivered.component.html',
  styleUrls: ['./delivery-challan-undelivered.component.css']
})
export class DeliveryChallanUndeliveredComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  showItemBox = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  showAlertModal = false;
  viewMode = false;
  isFocus = false;
  coded_item: any = 'Coded';
  group_id: any = null;
  product_id: any = null;
  qr_code: any;
  qty: any;
  suppliers : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  staffs : any[] = [];
  preSales : any[] = [];
  productItc : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  deliver_items : any[] = [];
  delivered_products : any[] = [];
  challans : any[] = [];
  challanType: any;
  challan_id: any = null;
  client_id: any = null;
  location_id: any = null;
  project_id: any = null;
  quots: any;
  selectedModal: any;
  selectedProductIndex: any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      delivery_challan_no: new FormControl(null, [Validators.required]),
      challan_date: new FormControl(null, [Validators.required]),
      t_challan_date: new FormControl(null),
      quotation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      sales_executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      pre_sale_demand_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      pre_sale_demand_no: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      pre_sale_demand_date: new FormControl(null),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      issued_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      remarks: new FormControl(null),
      collected_by: new FormControl({value: null, disabled: true}),
      collected_by_client: new FormControl({value: null, disabled: true}),
      collected_by_contact: new FormControl({value: null, disabled: true}),
      delivered_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      supporting_engineer: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      po_no: new FormControl(null),
      po_date: new FormControl(null),
      document_attached: new FormControl(null),
      other_document: new FormControl(null),
      delivery_docket_no: new FormControl(null),
      delivery_date: new FormControl(null),
      t_delivery_date: new FormControl(null),
      material_sent_by: new FormControl(null),
      material_accepted_by: new FormControl(null),
      acceptance_remarks: new FormControl(null),
      contact_no: new FormControl(null),
      material_accepted_date: new FormControl(null),
      t_material_accepted_date: new FormControl(null),
      material_accepted_no: new FormControl(null),
    });
    this.getStaff();
    this.getClients();
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
    this.delivered_products.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.showAlertModal = true;
  }

  ngAfterViewInit() {
    
  }

  getDeliveryChallan() {
    if (!this.isNotValid(this.client_id) && !this.isNotValid(this.location_id)) {
      this.loader.start();
      this.apiService.getDeliveryChallan({client_id: this.client_id, location_id: this.location_id, status: 'Pending'}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.challans = data['data'];
        }
      });
    }
  }

  viewChallan(viewMode: boolean) {
    if (this.isNotValid(this.challan_id)) {
      return;
    }
    this.viewMode = viewMode;
    this.showDeliveryChallan();
    this.showAlertModal = false;
  }

  showDeliveryChallan() {
    if (this.isNotValid(this.challan_id)) {
      return;
    }
    this.loader.start();
    this.apiService.showDeliveryChallan({id: this.challan_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.patchValue(data['data']);
        this.delivered_products = data['data']['details'];
        this.showQuotation();
        this.showPreSalesDemand();
        this.createMode = true;
      }
    });
  }

  getLocation() {
    this.loader.start();
    this.apiService.getLocation({parent_id: this.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
      this.loader.stop();
    });
  }

  getProject() {
    this.apiService.getProject({client_id: this.client_id, location_id: this.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
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
    this.apiService.getClients({delivery_challan: 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getEditClients() {
    this.apiService.editClients({page: 'dc'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  showQuotation() {
    this.loader.start();
    this.apiService.showQuotation({id: this.purchaseForm.value.quotation_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.quots = data['data'];
        this.productGroups = [];
        this.productDetails = data['data']['details'];
        this.productItc = data['data']['itc'];
        this.productDetails.forEach((item: any) => {
          if (item.prmodel) {
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
            item.pending_qty = item.qty;
            item.description = desc;
            if (this.delivered_products.length) {
              this.delivered_products.forEach((im) => {
                if (im.product_id == item.product_id && im.group_id == item.group_id) {
                  item.pending_qty = item.pending_qty - im.qty;
                }
              });
            }
          }
        });
        this.productItc.forEach((item, key) => {
          item.itc_rate = item.rate;
          item.itc_hsncode = item.itc_hsncode;
          item.itc_gst_rate = item.gst_percentage;
          let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
          item.group_name = item.group.name;
          item.product_name = item.prmodel.model_no;
          item.description = desc;
        });
      }
      this.loader.stop();
    });
  }

  showPreSalesDemand() {
    if (!this.isNotValid(this.purchaseForm.value.pre_sale_demand_id)) {
      this.apiService.showPreSalesDemand({id: this.purchaseForm.value.pre_sale_demand_id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.controls.pre_sale_demand_date.setValue(data['data']['pre_sale_date']);
          this.purchaseForm.controls.po_no.setValue(data['data']['po_no']);
          this.purchaseForm.controls.po_date.setValue(data['data']['po_date']);
        }
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

  resetForm() {
    if (this.isNotValid(this.purchaseForm.value.id) || this.createMode) {
      this.purchaseForm.reset();
      this.productDetails = [];
      this.productItc = [];
      this.deliver_items = [];
      this.delivered_products = [];
    } else {
      this.showDeliveryChallan();
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.showItemBox = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.productItc = [];
    this.deliver_items = [];
    this.delivered_products = [];
    this.challanType = null;
    this.client_id = null;
    this.location_id = null;
    this.project_id = null;
    this.challan_id = null;
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.showAlertModal = true;
    this.productDetails = [];
    this.productItc = [];
    this.deliver_items = [];
    this.delivered_products = [];
    this.challanType = null;
    this.client_id = null;
    this.location_id = null;
    this.project_id = null;
    this.challan_id = null;
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.purchaseForm.reset();
    this.getEditClients();
  }

  formErrors(field: string) {
    return (this.invalidForm && this.purchaseForm.controls[field].invalid);
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.isNotValid(this.purchaseForm.value.id)) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.challanType == '1') {

    } else {

    }

    let params = {
      id: this.purchaseForm.value.id,
      items: this.delivered_products,
      challan_type: this.challanType
    }
    this.loader.start();
    this.apiService.undeliveredDeliveryChallan(params).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'Delivery Challan Undelivered Successfully');
        this.closeForm();
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
    });
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
