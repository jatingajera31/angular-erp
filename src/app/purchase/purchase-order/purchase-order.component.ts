import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showAddItemModal = false;
  showProductDetailModal = false;
  showRemarkModal = false;
  showRemoveModal = false;
  ShowPIInformation = false;
  ShowPoDispatch = false;
  showInfoBtn = false;
  goods_dispatched = false;
  showDispatchBtn = false;
  isFocus = false;
  suppliers : any[] = [];
  editSuppliers : any[] = [];
  productGroups : any[] = [];
  serviceGroups : any[] = [];
  productDetails : any[] = [];
  purchaseOrders : any[] = [];
  currencyData : any[] = [];
  purchaseOrderNo:any;
  productRemark:any;
  selectedModal:any;
  selectedProductIndex:any;
  piInfoData:any[] = [];
  piDispatchData:any[] = [];
  productImage = './assets/images/product.jpg';
  supplierId:any = null;
  purchaseId:any = null;
  msgs:any = {};
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      purchase_country: new FormControl('India', [Validators.required]),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      po_no: new FormControl(null, Validators.required),
      po_date: new FormControl(null, Validators.required),
      t_po_date: new FormControl(null, Validators.required),
      po_time: new FormControl(null, Validators.required),
      payment_currency: new FormControl(null),
      exchange_rate: new FormControl(null),
      purchase_type: new FormControl('General'),
      purchase_details: new FormControl(null),
      delivery_days: new FormControl(null),
      delivery_date: new FormControl(null),
      payment_terms: new FormControl(null),
      item_amount: new FormControl(0),
      freight: new FormControl(null),
      discount_percentage: new FormControl(null),
      discount_amount: new FormControl(0),
      delivery_schedule: new FormControl(),
      final_amount: new FormControl(0),
      dispatch_mode: new FormControl(null),
      transporter: new FormControl(null),
      agreed_warantee_term: new FormControl(null),
      remark: new FormControl(null),
      qty_rate_total: new FormControl(0),
      discount_total: new FormControl(0),
      sub_total: new FormControl(0),
      gst_total: new FormControl(0),
      total_amount: new FormControl(0)
    });
    this.getProductGroup();
    this.getServiceGroup();
    this.addProdDetail('Product');
    this.getSupplier();
    this.getCurrency();
    this.msgs['id'] = 'Id';
    this.msgs['purchase_country'] = 'Purchase From Country';
    this.msgs['po_no'] = 'Po No';
    this.msgs['po_date'] = 'Po Date';
    this.msgs['po_time'] = 'Po Time';
    this.msgs['supplier_id'] = 'Supplier';
    this.msgs['payment_currency'] = 'Payment Currency';
    this.msgs['exchange_rate'] = 'Exchange Rate';
    this.msgs['purchase_type'] = 'Purchase Type';
    this.msgs['purchase_details'] = 'Purchase Details';
    this.msgs['delivery_days'] = 'Delivery_days';
    this.msgs['delivery_date'] = 'Delivery_date';
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
      $( "#po_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.po_date.setValue(date);
        this.purchaseForm.controls.t_po_date.setValue(e.format());
        this.setDeliveryDate();
      });

      $('#po_date').mask('00/00/0000');

      $('#po_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.po_time.setValue(this.getTimes(time));
        }
      });

    }, 1000);
  }

  getCurrency() {
    this.apiService.getCurrency({}).subscribe(data => {
      this.currencyData = data['data'];
    });
  }

  showPurchaseInfo() {
    this.showInfoBtn = false;
    this.goods_dispatched = false;
    if (this.purchaseForm.value.id) {
      this.apiService.showPurchaseInfo({purchase_order_id: this.purchaseForm.value.id }).subscribe(data => {
        if (data && data['status'] == 1 && data['data'].length) {
          this.showInfoBtn = true;
          this.piInfoData = data['data'];
          let glen = this.piInfoData.filter((itn) => { return (itn.goods_dispatched == 'All') });
          this.goods_dispatched = (glen.length > 0) ? true: false;
        }
      });
    }
  }

  showPurchaseDispatch() {
    this.showDispatchBtn = false;
    if (this.purchaseForm.value.id) {
      this.apiService.showPurchaseDispatch({purchase_order_id: this.purchaseForm.value.id }).subscribe(data => {
        if (data && data['status'] == 1 && data['data'].length) {
          this.showDispatchBtn = true;
          this.piDispatchData = data['data'];
        }
      });
    }
  }

  viewPiInfo() {
    this.ShowPIInformation = true;
  }

  viewPiDispatch() {
    this.ShowPoDispatch = true;
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

  getSupplier() {
    this.apiService.getSupplier({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'pos'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.editSuppliers = data['data'];
      }
    });
  }

  getPurchaseOrder() {
    if (this.supplierId) {
      this.loader.start();
      this.apiService.getPurchaseOrder({supplier_id: this.supplierId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseOrders = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getPurchaseOrderNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.supplier_id)) {
      this.apiService.getPurchaseOrderNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseOrderNo = data['data'];
          this.purchaseForm.controls.po_no.setValue(this.purchaseOrderNo);
          if (data['item']) {
            this.purchaseForm.patchValue(data['item']);
          }
        }
      });
    } else {
      this.purchaseOrderNo = null;
      this.purchaseForm.controls.po_no.setValue(this.purchaseOrderNo);
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

  viewRemarkModal(prod: any, i: any) {
    this.productRemark = prod.remark;
    this.selectedProductIndex = i;
    this.showRemarkModal = true;
  }

  saveRemark() {
    this.productDetails[this.selectedProductIndex].remark = this.productRemark;
    this.showRemarkModal = false;
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  viewAddItemModal() {
    let errors = false;
    this.productDetails.forEach((item) => {
        item.error = false;
        if (this.isNotValid(item.group_id)) {
          this.toastr.error('ERROR', 'Please select product group');
          item.error = true;
          errors = true;
          return
        }
        if (this.isNotValid(item.product_id)) {
          this.toastr.error('ERROR', 'Please select model no');
          item.error = true;
          errors = true;
          return
        }
        if (this.isNotValid(item.qty)) {
          this.toastr.error('ERROR', 'Please enter quantity');
          item.error = true;
          errors = true;
          return
        }
        if (this.isNotValid(item.rate) && !item.is_paired) {
          this.toastr.error('ERROR', 'Please enter rate');
          item.error = true;
          errors = true;
          return
        }

        if (item.is_paired && this.checkValidQty(item)) {
          // this.toastr.error('ERROR', 'Please enter valid quantity');
          item.error = true;
          errors = true;
        }
      });

      if (errors) {
        return;
      }
      this.showAddItemModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
    this.calculate()
  }

  addRow(type: string) {
    this.loader.start();
    setTimeout(() => {
      this.addProdDetail(type);
      this.showAddItemModal = false;
      this.loader.stop();
    },300);
  }

  addProdDetail(type: string) {
    this.productDetails.push({
      id: null,
      type: type,
      group_id: null,
      product_id: null,
      group_name: null,
      product_name: null,
      is_paired: null,
      paired_id: null,
      paired_qty: null,
      description: null,
      qty: null,
      rate: null,
      discount_percentage: null,
      discount_amount: null,
      sub_total: 0,
      gst_percentage: 0,
      gst_amount: 0,
      total_amount: 0,
      remark: null,
      show: false,
      products: []
    });
  }

  setDeliveryDate() {
    if (this.purchaseForm.value.po_date && this.purchaseForm.value.delivery_days) {
      var date = new Date();
      var po_date = new Date(this.purchaseForm.value.po_date);
      date.setDate(po_date.getDate() + this.purchaseForm.value.delivery_days);
      const ddate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.purchaseForm.controls.delivery_date.setValue(ddate);
    } else {
      this.purchaseForm.controls.delivery_date.setValue(null);
    }
  }

  resetForm() {
    this.invalidForm = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    if (this.createMode) {
      this.purchaseForm.controls.purchase_type.setValue('General');
      this.purchaseForm.controls.purchase_country.setValue('India');
      this.purchaseForm.controls.qty_rate_total.setValue('0.00');
      this.purchaseForm.controls.discount_total.setValue('0.00');
      this.purchaseForm.controls.sub_total.setValue('0.00');
      this.purchaseForm.controls.gst_total.setValue('0.00');
      this.purchaseForm.controls.total_amount.setValue('0.00');
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.purchaseForm.controls.po_date.setValue(date);
      this.purchaseForm.controls.t_po_date.setValue(new Date());
      $("#po_date").datepicker('setDate', new Date())
      let tims = this.getTimes(new Date());
      this.purchaseForm.controls.po_time.setValue(tims);
      this.addProdDetail('Product');
    } else {
      this.showData();
    }
  }

  closeForm() {
    this.productDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.invalidForm = false;
    this.goods_dispatched = false;
    this.purchaseForm.reset();
    this.purchaseForm.controls.purchase_country.setValue('India');
    this.purchaseForm.controls.purchase_type.setValue('General');
    this.purchaseForm.controls.qty_rate_total.setValue('0.00');
    this.purchaseForm.controls.discount_total.setValue('0.00');
    this.purchaseForm.controls.sub_total.setValue('0.00');
    this.purchaseForm.controls.gst_total.setValue('0.00');
    this.purchaseForm.controls.total_amount.setValue('0.00');
    this.addProdDetail('Product');
    $('#po_time').val(null);
  }

  viewCreateMode() {
    if (this.createMode) {
      return
    }
    this.createMode = true;
    this.editMode = false;
    this.goods_dispatched = false;
    this.purchaseForm.reset();
    this.purchaseForm.controls.purchase_country.setValue('India');
    this.purchaseForm.controls.purchase_type.setValue('General');
    this.purchaseForm.controls.qty_rate_total.setValue('0.00');
    this.purchaseForm.controls.discount_total.setValue('0.00');
    this.purchaseForm.controls.sub_total.setValue('0.00');
    this.purchaseForm.controls.gst_total.setValue('0.00');
    this.purchaseForm.controls.total_amount.setValue('0.00');
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.po_date.setValue(date);
    this.purchaseForm.controls.t_po_date.setValue(new Date());
    $("#po_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.po_time.setValue(tims);

  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  viewEditMode() {
    if (this.editMode) {
      return
    }
    this.purchaseForm.reset();
    this.purchaseForm.controls.purchase_country.setValue('India');
    this.showEditModal = true;
    this.purchaseId = null;
    this.supplierId = null;
    this.getEditSuppliers();
  }

  changeCountry() {
    if (this.purchaseForm.value.purchase_country != 'India') {
      this.purchaseForm.controls['payment_currency'].setValidators([Validators.required]);
      this.purchaseForm.controls['payment_currency'].updateValueAndValidity();
      this.purchaseForm.controls['exchange_rate'].setValidators([Validators.required]);
      this.purchaseForm.controls['exchange_rate'].updateValueAndValidity();
      this.productDetails.forEach((item) => {
        item.gst_percentage = 0;
        item.gst_amount = 0;
      })
      this.calculate();
    } else {
      this.purchaseForm.controls['payment_currency'].setValue(null);
      this.purchaseForm.controls['exchange_rate'].setValue(null);
      this.purchaseForm.controls['payment_currency'].clearValidators();
      this.purchaseForm.controls['payment_currency'].updateValueAndValidity();
      this.purchaseForm.controls['exchange_rate'].clearValidators();
      this.purchaseForm.controls['exchange_rate'].updateValueAndValidity();
      this.calculate();
    } 
  }

  checkValidQty(prod: any) {
    if (prod.is_paired) {
      let q = 0;
      this.productDetails.forEach((item) => {
        if (item.product_id == prod.paired_id) {
          q = item.qty;
        }
      });
      let maxq = q * prod.paired_qty;
      if (prod.qty > maxq) {
        return true;
      }
    }
    return false;
  }

  checkValidQtyErr(prod: any) {
    if (prod.is_paired) {
      let q = 0;
      this.productDetails.forEach((item) => {
        if (item.product_id == prod.paired_id) {
          q = item.qty;
        }
      });
      let maxq = q * prod.paired_qty;
      if (prod.qty > maxq) {
        this.toastr.error('ERROR', 'Hey, '+maxq+' is the Max. quantity you can add. Model No.: ' + prod.product_name);
      }
      if (prod.qty < maxq) {
        this.toastr.warning('Warning', 'Hey, '+maxq+' is the max quantity.  you added ' + prod.qty +' quantity for Model No.: ' + prod.product_name);
      }
    }
  }

  saveOrder() {
    this.invalidForm = false;
    let msg = "Please enter valid details.";
    if (this.purchaseForm.invalid) {
      for(var r in this.purchaseForm.controls) {
        if (this.purchaseForm.controls[r].invalid) {
          msg = 'Please enter valid ' + this.msgs[r] + ' data';
          break;
        }
      }
      this.invalidForm = true;
      this.toastr.error('ERROR', msg);
      return;
    }

    if (this.productDetails.length) {
      this.productDetails.forEach((item) => {
        if (this.isNotValid(item.group_id)) {
          this.toastr.error('ERROR', 'Please Select Product Group In Last Row.');
          this.invalidForm = true;
          return
        }
        if (this.isNotValid(item.product_id)) {
          this.toastr.error('ERROR', 'Please Select Product In Last Row.');
          this.invalidForm = true;
          return
        }
        if (this.isNotValid(item.qty)) {
          this.toastr.error('ERROR', 'Please Enter Quantity In Last Row.');
          this.invalidForm = true;
          return
        }
        if (this.isNotValid(item.rate) && !item.is_paired) {
          this.toastr.error('ERROR', 'Please Enter Product Rate In Last Row.');
          this.invalidForm = true;
          return
        }

        if (item.is_paired && this.checkValidQty(item)) {
          this.toastr.error('ERROR', 'Hey, Please Enter Valid Quantity In Last Row.');
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        return;
      }

      let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
      params.product_details = JSON.parse(JSON.stringify(this.productDetails));
      if (params.id && params.id > 0) {
        this.loader.start();
        this.apiService.updatePurchaseOrder(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Purchase order update successfully.');
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
        this.apiService.savePurchaseOrder(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Purchase order saved successfully.');
            this.closeForm();
          }
          if (data['status'] == 0) {
            for(var r in data['data']) {
              this.toastr.error('Error', data['data'][r]);    
            }
          }
        });
      }
    } else {
      this.toastr.error('ERROR', 'Please enter product details.');
      return;
    }
  }

  deleteOrder() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Purchase Order.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Order.');
    } else {
      this.loader.start();
      this.apiService.deletePurchaseOrder({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        this.showDeleteModal = false
        if (data && data['status'] == 1) {
          this.closeForm()
          this.toastr.success('SUCCESS', 'Purchase Order deleted successfully.'); 
        } else {
          this.toastr.error('ERROR', data['data']);    
        }
      });
    }
  }
  
  showData() {
    if (this.purchaseId) {
      this.loader.start();
      this.apiService.showPurchaseOrder({id: this.purchaseId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.showEditModal = false;
          this.productDetails.forEach((item, key) => {
            if (!item.is_paired) {
              if (item.type == 'Product') {
                this.getModels(item, key, item.product_id);
              } else {
                this.getServices(item, key, item.product_id);
              }
            }

            if (item.type == 'Product') {
              let sw = 'Not Applicable';
              let hsn = '';
              let product_code = '';
              if (!this.isNotValid(item.prmodel.supplier_warranty)) {
                sw = item.prmodel.supplier_warranty + ' Months';
              }
              if (item.prmodel.hsn_code) {
                hsn = item.prmodel.hsn_code;
              }
              if (item.prmodel.product_code) {
                product_code = item.prmodel.product_code;
              }
              item.description = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
              item.tdescription = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
            }
          });
          if (data['data']['po_date']) {
            $("#po_date").datepicker("setDate", new Date(data['data']['po_date']));
          }
          setTimeout(() => {
            $('td[data-toggle="tooltip"]').tooltip({html: true,trigger: 'click'})
          }, 1500);
          this.showPurchaseInfo();
          this.showPurchaseDispatch();
        }
        this.loader.stop();
      });
    }
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getModels(prod: any, index: any, product_id: any) {
    if (prod.group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          prod.products = data['data'];
          if (product_id) {
            this.changeModel(product_id, prod, true)
          }
        }
        this.loader.stop();
      });
    }
  }

  getServiceGroup() {
    this.apiService.getServiceGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.serviceGroups = data['data'];
      }
    });
  }

  getServices(prod: any, index: any, product_id: any) {
    if (prod.group_id) {
      this.loader.start();
      this.apiService.getServiceGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          prod.products = data['data'];
          if (product_id) {
            this.changeModel(product_id, prod, true)
          }
        }
        this.loader.stop();
      });
    }
  }

  changeModel(product_id: any, prod: any, isEdited: any) {
    if (product_id) {
      for(var r in prod.products) {
        if (prod.products[r].id == product_id) {
          if (prod.type == 'Product') {
            let sw = 'Not Applicable';
            let hsn = '';
            let product_code = '';
            if (!this.isNotValid(prod.products[r].supplier_warranty)) {
              sw = prod.products[r].supplier_warranty + ' Months';
            }
            if (prod.products[r].hsn_code) {
              hsn = prod.products[r].hsn_code;
            }
            if (prod.products[r].product_code) {
              product_code = prod.products[r].product_code;
            }
            prod.description = prod.products[r].description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
            prod.tdescription = prod.products[r].description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
            if (!this.editMode) {
              prod.gst_percentage = (this.purchaseForm.value.purchase_country == 'India') ? prod.products[r].gst_rate : 0;
              prod.rate = (this.purchaseForm.value.purchase_country == 'India') ? prod.products[r].purchase_rate : 0;
            }
          } else {
            prod.description = prod.products[r].description;
            if (!this.editMode) {
              prod.gst_percentage = (this.purchaseForm.value.purchase_country == 'India') ? prod.products[r].gst_rate : 0;
              prod.rate = (this.purchaseForm.value.purchase_country == 'India') ? prod.products[r].purchase_rate : 0;
            }
          }
        }
      }

      if (!prod.is_paired && prod.type == 'Product' && !isEdited) {
        let keys: any = [];
        this.productDetails.map((item: any, key: any) => {
          if (item.paired_id == product_id && item.is_paired) {
            keys.push(key);
          }
        });

        if (keys.length) {
          keys.sort((a:any, b:any) => {
            return b - a;
          });
          for(var d in keys) {
            this.productDetails.splice(keys[d], 1);
          }
        }
        setTimeout(() => {
          this.getProductPaired(product_id, isEdited); 
        }, 200);
        setTimeout(() => {
          $('td[data-toggle="tooltip"]').tooltip({html: true,trigger: 'click'})
        }, 1500);
      }
    }
  }

  getProductPaired(product_id: any, isEdited: any) {
    this.loader.start();
    this.apiService.showProduct({id: product_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (data['paired'] && data['paired'].length) {
          data['paired'].forEach((item: any) => {
            let sw = 'Not Applicable';
            let hsn = '';
            let product_code = '';
            if (!this.isNotValid(item.prmodel.supplier_warranty)) {
              sw = item.prmodel.supplier_warranty + ' Months';
            }
            if (item.prmodel.hsn_code) {
              hsn = item.prmodel.hsn_code;
            }
            if (item.prmodel.product_code) {
              product_code = item.prmodel.product_code;
            }
            let desc = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
            let tdesc = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
            let found = false;
            this.productDetails.filter((prditem) => {
               if (prditem.product_id == item.model_id && prditem.paired_id == product_id) {
                prditem.group_name = item.group.name;
                prditem.product_name = item.prmodel.model_no;
                prditem.description = desc;
                prditem.tdescription = tdesc;
                prditem.gst_percentage = item.prmodel.gst_rate;
                found = true;
               }
            });
            if (!found && !isEdited) {
              this.productDetails.push({
                id: null,
                type: 'Product',
                group_id: item.group_id,
                product_id: item.model_id,
                group_name: item.group.name,
                product_name: item.prmodel.model_no,
                is_paired: true,
                paired_id: product_id,
                paired_qty: item.qty,
                description: desc,
                tdescription: tdesc,
                qty: 0,
                rate: 0,
                discount_percentage: 0,
                discount_amount: 0,
                sub_total: 0,
                gst_percentage: 0,
                gst_amount: 0,
                total_amount: 0,
                remark: null,
                show: false,
                products: []
              });
            }
          });
        }
      }
      this.loader.stop();
    });
  }

  calculate() {
    let qty_rate_total = 0;
    let discount_total = 0;
    let sub_total = 0;
    let gst_total = 0;
    let total_amount = 0;
    let item_amount = 0;
    this.productDetails.forEach((item, key) => {
      if (this.purchaseForm.value.purchase_country == 'Overseas') {
        item.gst_percentage = 0;
      }
      if (!item.is_paired) {
        item.discount_amount = 0;
        item.gst_amount = 0;
        item.sub_total = 0;
        if (item.qty && item.rate) {
          let itemRate = item.rate;
          let itemQty = Number(item.qty);
          // if (this.purchaseForm.value.purchase_country != 'India') {
          //   itemRate = (item.rate * this.purchaseForm.value.exchange_rate)
          // }
          item.sub_total = (itemQty * itemRate);
          qty_rate_total += (itemQty * itemRate);
        }
        if (item.discount_percentage) {
          item.discount_amount = (item.sub_total * item.discount_percentage) / 100;
          discount_total += item.discount_amount;
        }
        item.sub_total = (item.sub_total - item.discount_amount);
        sub_total += item.sub_total;
        if (item.gst_percentage && this.purchaseForm.value.purchase_country == 'India') {
          item.gst_amount = (item.sub_total * item.gst_percentage) / 100;
          gst_total += item.gst_amount;
        }
        item.total_amount = (item.sub_total + item.gst_amount);
        total_amount += item.total_amount;
      }
    });

    this.purchaseForm.controls.qty_rate_total.setValue(qty_rate_total);
    this.purchaseForm.controls.discount_total.setValue(discount_total);
    this.purchaseForm.controls.sub_total.setValue(sub_total);
    this.purchaseForm.controls.gst_total.setValue(gst_total);
    this.purchaseForm.controls.total_amount.setValue(total_amount);
    this.purchaseForm.controls.item_amount.setValue(total_amount);
    this.calculateTotal();
  }

  getDiscountAmount(prod: any) {
    if (prod.rate) {
      let prodRate = prod.rate;
      if (prod.discount_percentage) {
        let dic = (prod.rate * prod.discount_percentage) / 100;
        return  Math.round(dic * 100) / 100;
      }
    }
    return 0;
  }

  calculateTotal() {
    let item_amount = this.purchaseForm.value.item_amount;
    let discount_amount = 0;
    if (this.purchaseForm.value.discount_percentage) {
      discount_amount = (item_amount * this.purchaseForm.value.discount_percentage) / 100;
    }
    let final_amount = item_amount - discount_amount;
    this.purchaseForm.controls.discount_amount.setValue(discount_amount);
    final_amount = Math.round(final_amount * 100) / 100;
    this.purchaseForm.controls.final_amount.setValue(final_amount);
  }

  changeFinalAmount() {
    if (this.purchaseForm.value.final_amount) {
      let item_amount = this.purchaseForm.value.item_amount;
      let final_amount = this.purchaseForm.value.final_amount;
      let discount_amount = item_amount - final_amount;
      discount_amount = Math.round(discount_amount * 100) / 100;
      let discount_percentage = (100 * discount_amount) / item_amount;
      discount_percentage = Math.round(discount_percentage * 100) / 100;
      this.purchaseForm.controls.discount_amount.setValue(discount_amount);
      this.purchaseForm.controls.discount_percentage.setValue(discount_percentage);
    }
  }

  changeDiscountAmount() {
    // if (this.purchaseForm.value.discount_amount) {
      let discount_amount = this.purchaseForm.value.discount_amount;
      let item_amount = this.purchaseForm.value.item_amount;
      let final_amount = item_amount - discount_amount;
      this.purchaseForm.controls.final_amount.setValue(final_amount);
      let discount_percentage = (100 * discount_amount) / item_amount;
      discount_percentage = Math.round(discount_percentage * 100) / 100;
      this.purchaseForm.controls.discount_percentage.setValue(discount_percentage);
    // }
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
