import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-delivery-challan',
  templateUrl: './delivery-challan.component.html',
  styleUrls: ['./delivery-challan.component.css']
})
export class DeliveryChallanComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  showItemBox = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  isFocus = false;
  coded_item: any = 'Coded';
  group_id: any = null;
  product_id: any = null;
  qr_code: any;
  qty: any;
  suppliers : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  staffs : any[] = [];
  preSales : any[] = [];
  productItc : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  deliver_items : any[] = [];
  delivered_products : any[] = [];
  deliveryChallans : any[] = [];
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
      pre_sale_demand_date: new FormControl(null),
      Project: new FormControl(null),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      issued_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      remarks: new FormControl(null),
      collected_by: new FormControl('Delivered'),
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

  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#delivery_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.delivery_date.setValue(date);
        this.purchaseForm.controls.t_delivery_date.setValue(date);
      });
      $( "#challan_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.challan_date.setValue(date);
      });
      $( "#material_accepted_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.material_accepted_date.setValue(date);
        this.purchaseForm.controls.t_material_accepted_date.setValue(date);
      });
      $('#delivery_date').mask('00/00/0000');
      $('#challan_date').mask('00/00/0000');
      $('#material_accepted_date').mask('00/00/0000');
    },1000)
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

  getDeliveryChallanNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getDeliveryChallanNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.delivery_challan_no.setValue(data['data']);
        }
      });
      this.intiDate();
    } else {
      this.purchaseForm.controls.delivery_challan_no.setValue(null);
    }
    if (this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.getDeliveryChallan();
    }
  }

  getDeliveryChallan() {
    if (this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.loader.start();
      this.apiService.getDeliveryChallan({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.deliveryChallans = data['data'];
        }
      });
    }
  }

  getPreSalesDemand() {
    this.loader.start();
    this.apiService.getPreSalesDemand({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.preSales = data['data'];
      }
    });
  }

  showDeliveryChallan() {
    if (this.isNotValid(this.purchaseForm.value.id)) {
      return;
    }
    this.loader.start();
    this.apiService.showDeliveryChallan({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.patchValue(data['data']);
        if (data['data']['challan_date']) {
          $("#challan_date").datepicker('setDate', new Date(data['data']['challan_date']));
        }
        if (data['data']['delivery_date']) {
          $("#delivery_date").datepicker('setDate', new Date(data['data']['delivery_date']));
        }
        if (data['data']['material_accepted_date']) {
          $("#material_accepted_date").datepicker('setDate', new Date(data['data']['material_accepted_date']));
        }
        this.delivered_products = data['data']['details'];
        this.showQuotation();
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

  changeColl() {
    if (this.purchaseForm.value.collected_by == 'Collected') {
      this.purchaseForm.controls.collected_by_client.enable();
      this.purchaseForm.controls.collected_by_contact.enable();
      this.purchaseForm.controls.delivered_by.disable();
      this.purchaseForm.controls['delivered_by'].clearValidators();
      this.purchaseForm.controls['delivered_by'].updateValueAndValidity();
      this.purchaseForm.controls['delivered_by'].setValue(null);
      this.purchaseForm.controls['supporting_engineer'].setValue(null);
      this.purchaseForm.controls['collected_by_client'].setValidators([Validators.required]);
      this.purchaseForm.controls['collected_by_client'].updateValueAndValidity();
      this.purchaseForm.controls['collected_by_contact'].setValidators([Validators.required]);
      this.purchaseForm.controls['collected_by_contact'].updateValueAndValidity();
    } else {
      this.purchaseForm.controls.collected_by_client.disable();
      this.purchaseForm.controls.collected_by_contact.disable();
      this.purchaseForm.controls.delivered_by.enable();
      this.purchaseForm.controls['delivered_by'].setValidators([Validators.required]);
      this.purchaseForm.controls['delivered_by'].updateValueAndValidity();
      this.purchaseForm.controls['collected_by_client'].clearValidators();
      this.purchaseForm.controls['collected_by_client'].updateValueAndValidity();
      this.purchaseForm.controls['collected_by_client'].setValue(null);
      this.purchaseForm.controls['collected_by_contact'].setValue(null);
      this.purchaseForm.controls['collected_by_contact'].clearValidators();
      this.purchaseForm.controls['collected_by_contact'].updateValueAndValidity();
    }
  }

  intiDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.challan_date.setValue(date);
    this.purchaseForm.controls.t_challan_date.setValue(new Date());
    $("#challan_date").datepicker('setDate', new Date());
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
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
            item.pending_qty = item.qty;
            item.description = desc;
            let exist = this.productGroups.filter((row) => { return (row.id == item.group_id) });
            if (exist.length == 0) {
              this.productGroups.push({id:item.group_id, name: item.group.name});
            }
            if (this.delivered_products.length) {
              this.delivered_products.forEach((im) => {
                if (im.product_id == item.product_id && im.group_id == item.group_id) {
                  item.pending_qty = item.pending_qty - im.qty;
                }
              });
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
      this.loader.start();
      this.apiService.showPreSalesDemand({id: this.purchaseForm.value.pre_sale_demand_id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.controls.pre_sale_demand_date.setValue(data['data']['pre_sale_date']);
          this.purchaseForm.controls.Project.setValue(data['data']['Project']);
          this.purchaseForm.controls.location_id.setValue(data['data']['location_id']);
          this.purchaseForm.controls.quotation_id.setValue(data['data']['quotation_id']);
          this.purchaseForm.controls.sales_executive_id.setValue(data['data']['sales_executive_id']);
          this.purchaseForm.controls.po_no.setValue(data['data']['po_no']);
          this.purchaseForm.controls.po_date.setValue(data['data']['po_date']);
          this.showQuotation();
        }
        this.loader.stop();
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
      this.purchaseForm.controls.collected_by.setValue('Delivered');
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
    this.purchaseForm.controls.collected_by.setValue('Delivered');
    this.productDetails = [];
    this.productItc = [];
    this.deliver_items = [];
    this.delivered_products = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.purchaseForm.controls.collected_by.setValue('Delivered');
    this.getClients();
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.purchaseForm.reset();
    this.purchaseForm.controls.collected_by.setValue('Delivered');
    this.getEditClients();
  }

  formErrors(field: string) {
    return (this.invalidForm && this.purchaseForm.controls[field].invalid);
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.items = this.delivered_products;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateDeliveryChallan(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Delivery Challan Detail Changed Successfully');
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
      this.apiService.saveDeliveryChallan(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Delivery Challan Detail Changed Successfully');
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

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Delivery Challan.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Delivery Challan.');
    } else {
      this.loader.start();
      this.apiService.deleteDeliveryChallan({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Delivery Challan deleted successfully.'); 
        }
      });
    }
  }

  closeBox() {
    this.showItemBox = false;
  }

  showBox() {
    if (!this.isNotValid(this.purchaseForm.value.pre_sale_demand_id)) {
      this.showItemBox = true;
    }
  }

  undoBox() {
    this.coded_item = 'Coded';
    this.qr_code = null;
    this.group_id = null;
    this.product_id = null;
    this.qty = null;
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

    if (this.coded_item == 'Coded') {
      if (!this.isNotValid(this.qr_code)) {
        this.loader.start();
        this.apiService.getProductQrCode({qr_code: this.qr_code}).subscribe(data => {
          if (data['status'] && data['status'] == 1 && data['data']) {
            this.doAddAction(data['data']['item'].group_id, data['data']['item'].product_id, 1, data['products']);
          } else {
            this.toastr.error('ERROR', this.qr_code + ' QR-Code item did not PURCHASED.');
            this.qr_code = null;
          }
          this.loader.stop();
        })
      }
    } else {
      this.doAddAction(this.group_id, this.product_id, this.qty, this.products);
    }
  }

  doAddAction(group_id: any, product_id: any, sqty: any, products: any[]) {
    let qty = 0;
    let description = '';
    let remark = '';
    let rate = 0;
    let gst_percentage = 0;
    let notDemand = false;
    this.productDetails.forEach((item) => {
      if (item.group_id == group_id && product_id == item.product_id) {
        qty = item.qty;
        description = item.description;
        rate = item.rate;
        gst_percentage = item.gst_percentage;
        remark = item.remark;
        notDemand = true;
      }
    });

    if (!notDemand) {
      this.toastr.error('ERROR', this.qr_code + ' QR-Code item is in STOCK. But it is not in demand, so not allowed to deliver.');
      return;
    }

    if (this.deliver_items.length) {
      this.deliver_items.forEach((item) => {
        if (item.group_id == group_id && product_id == item.product_id) {
          qty = qty - item.qty;
        }
      });
    }

    if (this.delivered_products.length) {
      this.delivered_products.forEach((item) => {
        if (item.group_id == group_id && product_id == item.product_id) {
          qty = qty - item.qty;
        }
      });
    }

    if (sqty > qty) {
      this.toastr.error('ERROR', 'Sorry, you are not allow to deliver more qnty than in demand..');
      return;
    }

    let group = this.productGroups.filter((item) => { return (item.id == group_id) });
    let product = products.filter((item) => { return (item.id == product_id) });
    
    let amount = (sqty * rate);
    let gst_amount = (amount * gst_percentage) / 100;
    let total_amount = (amount + gst_amount);

    this.deliver_items.push({
      group: group[0],
      product: product[0],
      coded_item: this.coded_item,
      qr_code: this.qr_code,
      group_id: group_id,
      product_id: product_id,
      description: description,
      qty: sqty,
      rate: rate,
      gst_percentage: gst_percentage,
      amount: amount,
      gst_amount: gst_amount,
      total_amount: total_amount,
      remarks: remark
    });
    
    this.qr_code = null;
    this.group_id = null;
    this.product_id = null;
    this.qty = null;
  }

  undoItems() {
    this.deliver_items = [];
  }
  
  deliverItems() {
    this.deliver_items.forEach((item) => {
      this.delivered_products.push(item);
    });    
    this.deliver_items = [];
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
  }

  viewAddItemModal() {
    this.showAddItemModal = true;
  }

  addRow(type: string) {
    this.showAddItemModal = false;
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
