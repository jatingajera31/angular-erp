import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  viewMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  editProduct = false;
  showProductDetailModal = false;
  showEmptyModal = false;
  showEditModal = false;
  showRemoveModal = false;
  isFormError = false;
  showDeliveredModal = false;
  hsnCodeAlert = false;
  changeHsn = false;
  finalPrompt = false;
  showPrintModal = false;
  confirmLabelModal = false;
  showBarCodes = false;
  showQrCodeModal = false;
  isFocus = false;
  isChecked = false;
  suppliers : any[] = [];
  productGroups : any[] = [];
  productDetails : any[] = [];
  staffs : any[] = [];
  deliveredBy : any[] = [];
  purchaseOrders : any[] = [];
  productQrCodes : any[] = [];
  productModels : any[] = [];
  qr_code_table : any[] = [];
  BarCodes : any[] = [];
  purchaseNo:any;
  purchaseSrNo:any;
  selectedModal:any;
  selectedProductIndex:any;
  DeliveredName:any;
  purchaseData:any;
  SupplierName:any;
  approvedUser:any = {
    id: null,
    first_name: null,
    father_name: null
  };
  supplierId:any = null;
  purchaseId:any = null;
  ProductGroupId:any = null;
  ProductModelId:any = null;
  ProductHsnCode:any = null;
  ProductQty:any = null;
  isQrCode:any = null;
  isSerialNo:any = null;
  isMacAddress:any = null;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_no: new FormControl(null, Validators.required),
      materials_received_date: new FormControl(null),
      received_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      no_of_cartons: new FormControl(null),
      remarks: new FormControl(null),
      delivered_by: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      amount_paid: new FormControl(null),
      delivery_time: new FormControl(null),
      docket_no: new FormControl(null),
      total_weight: new FormControl(null),
      tansport_no_of_cartons: new FormControl(null),
      charged_weight: new FormControl(null),
      tansport_remarks: new FormControl(null),
      sr_no: new FormControl(null, Validators.required),
      invoice_copy: new FormControl(null, Validators.required),
      invoice_no: new FormControl(null),
      invoice_amount: new FormControl(null),
      invoice_date: new FormControl(null),
      challan_no: new FormControl(null),
      challan_date: new FormControl(null),
      e_way_bill_copy: new FormControl(null),
      e_way_bill_no: new FormControl(null),
      e_way_date: new FormControl(null),
      e_way_time: new FormControl(null),
      valid_from: new FormControl(null),
      valid_until: new FormControl(null),
      total_time: new FormControl(null),
      t_materials_received_date: new FormControl(null),
      t_invoice_date: new FormControl(null),
      t_challan_date: new FormControl(null),
      t_e_way_date: new FormControl(null),
      t_valid_from: new FormControl(null),
      t_valid_until: new FormControl(null),
      status: new FormControl(null)
    });

    this.getProductGroup();
    this.getStaff();
    this.getDeliveredBy();
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
    this.apiService.me().subscribe((data:any) => {
      this.approvedUser = data;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#materials_received_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.materials_received_date.setValue(date);
      });

      $( "#invoice_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.invoice_date.setValue(date);
      });

      $( "#challan_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.challan_date.setValue(date);
      });

      $( "#e_way_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.e_way_date.setValue(date);
      });

      $( "#valid_from" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.valid_from.setValue(date);
          this.getTotalTime();
      });

      $( "#valid_until" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.valid_until.setValue(date);
          this.getTotalTime();
      });

      $('#materials_received_date').mask('00/00/0000');
      $('#invoice_date').mask('00/00/0000');
      $('#challan_date').mask('00/00/0000');
      $('#e_way_date').mask('00/00/0000');
      $('#valid_from').mask('00/00/0000');
      $('#valid_until').mask('00/00/0000');

      $('#e_way_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.e_way_time.setValue(this.getTimes(time));
        }
      });

      $('#delivery_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.delivery_time.setValue(this.getTimes(time));
        }
      });

    }, 1000);
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

  changeCopy() {
    if (this.purchaseForm.value.invoice_copy == 'Yes') {
      this.purchaseForm.controls.invoice_no.enable();
      this.purchaseForm.controls.invoice_amount.enable();

      this.purchaseForm.controls.invoice_no.setValidators([Validators.required]);
      this.purchaseForm.controls.invoice_amount.setValidators([Validators.required]);
      this.purchaseForm.controls.invoice_date.setValidators([Validators.required]);
    } else {
      this.purchaseForm.controls.invoice_no.disable();
      this.purchaseForm.controls.invoice_amount.disable();

      this.purchaseForm.controls.invoice_no.setValue(null);
      this.purchaseForm.controls.invoice_amount.setValue(null);
      this.purchaseForm.controls.invoice_date.setValue(null);

      this.purchaseForm.controls.invoice_no.clearValidators();
      this.purchaseForm.controls.invoice_amount.clearValidators();
      this.purchaseForm.controls.invoice_date.clearValidators();
    }

    this.purchaseForm.controls.invoice_no.updateValueAndValidity();
    this.purchaseForm.controls.invoice_date.updateValueAndValidity();
    this.purchaseForm.controls.invoice_amount.updateValueAndValidity();

    if (this.purchaseForm.value.e_way_bill_copy == 'Yes') {
      this.purchaseForm.controls.e_way_bill_no.enable();
      this.purchaseForm.controls.t_e_way_date.enable();
      $("#e_way_time").removeAttr("disabled", "disabled"); 
    } else {
      this.purchaseForm.controls.e_way_bill_no.disable();
      this.purchaseForm.controls.t_e_way_date.disable();
      $("#e_way_time").attr("disabled", "disabled"); 

      this.purchaseForm.controls.e_way_bill_no.setValue(null);
      this.purchaseForm.controls.t_e_way_date.setValue(null);
      this.purchaseForm.controls.e_way_time.setValue(null);
      $("#e_way_time").val(null); 
    }
  }

  getTotalTime() {
    if (this.purchaseForm.value.valid_from && this.purchaseForm.value.valid_until) {
      const date1 = new Date(this.purchaseForm.value.valid_from);
      const date2 = new Date(this.purchaseForm.value.valid_until);
      var difference_In_Time = date2.getTime() - date1.getTime();
      var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
      this.purchaseForm.controls.total_time.setValue(difference_In_Days);
    }
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getDeliveredBy() {
    this.apiService.getTransport({}).subscribe(data => {
        this.deliveredBy = data['data'];
        this.loader.stop();
    });

    // this.apiService.getDeliveredBy({name:this.DeliveredName}).subscribe(data => {
    //     this.loader.stop();
    //     this.deliveredBy = data['data'];
    // });
  }

  getSupplier() {
    let approval = ["Approved"];
    if (this.viewMode) {
      approval = ["Purchased"];
    }
    this.apiService.editSuppliers({page: 'purc', approval: approval}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getDispatchByInvoice() {
    this.apiService.getDispatchByInvoice({invoice_no: this.purchaseForm.value.invoice_no}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (data['data'] && data['data']['invoice_amount']) {
          let invoice_amount = data['data']['invoice_amount'].toFixed(2);
          this.purchaseForm.controls.invoice_amount.setValue(invoice_amount);
          this.purchaseForm.controls.t_invoice_date.setValue(new Date(data['data']['invoice_date']));
          $("#invoice_date").datepicker('setDate', new Date(data['data']['invoice_date']));
          this.purchaseForm.controls.invoice_date.setValue(data['data']['invoice_date']);
        }
      }
    });
  }

  getDispatchEWay() {
    this.apiService.getDispatchEWay({e_way_bill_no: this.purchaseForm.value.e_way_bill_no}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (data['data'] && data['data']['e_way_date']) {
          this.purchaseForm.controls.t_e_way_date.setValue(new Date(data['data']['e_way_date']));
          $("#e_way_date").datepicker('setDate', new Date(data['data']['e_way_date']));
          this.purchaseForm.controls.e_way_date.setValue(data['data']['e_way_date']);
          this.purchaseForm.controls.e_way_time.setValue(data['data']['e_way_time']);
          $("#e_way_time").val(data['data']['e_way_time'])
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

  getSingleModel() {
    if (!this.isNotValid(this.ProductGroupId)) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.ProductGroupId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.productModels = data['data'];
        }
        this.loader.stop();
      });
    } else {
      this.productModels = [];
    }
  }

  changePopProd() {
    if (!this.isNotValid(this.ProductModelId)) {
      for(var r in this.productModels) {
        if (this.productModels[r].id == this.ProductModelId) {
          this.ProductHsnCode = this.productModels[r].hsn_code;
          this.isQrCode = this.productModels[r].qr_code;
          this.isSerialNo = this.productModels[r].serial_no;
          this.isMacAddress = this.productModels[r].mac_address;
          if (this.productModels[r].hsn_code_alert && this.productModels[r].hsn_code_allow) {
            this.hsnCodeAlert = true;
          }
        }
      }
      this.changeHsn = false;
    } else {
      this.ProductHsnCode = null;
      this.isQrCode = null;
      this.isSerialNo = null;
      this.isMacAddress = null;
    }
    this.qr_code_table = [];
  }

  closeLabel() {
    let checked = this.productDetails.filter((item) => { return (item.checked) });
    let isCoded = this.productDetails.filter((item) => { return (item.qrcodes.length > 0) });
    if (checked.length != isCoded.length) {
      this.confirmLabelModal = true;
    } else {
      this.showPrintModal = false
      this.closeForm();
    }
  }

  yesKnow() {
    this.showPrintModal = false;
    this.confirmLabelModal = false;
    this.closeForm();
  }

  printLabel(prod: any) {
    if (prod.checked && prod.qrcodes.length) {
      this.BarCodes = prod.qrcodes;
      this.showBarCodes = true;
    }
  }

  showCodes(prod: any) {
    if (prod.qrcodes.length) {
      this.BarCodes = prod.qrcodes;
      this.showBarCodes = true;
    } 
  }

  viewCodes() {
    let checked = this.BarCodes.filter((row) => { return (row.checked) })
    if (checked.length) {
      this.showQrCodeModal = true;
    } 
  }

  selectAll() {
    this.BarCodes.forEach((item) => {
      item.checked = this.isChecked;
    });
  }

  generateQrCode() {
    this.qr_code_table = [];
    if (!this.isNotValid(this.ProductQty)) {
      for (var i = 1;i <= this.ProductQty; i++) {
        this.qr_code_table.push({
          srno: i,
          qr_code: i +'-'+ this.ProductModelId,
          mac_address: null,
          serial_no: null,
        });
      }
    }
  }

  editProductModal(prod: any, i: any) {
    this.editProduct = true;
    this.selectedProductIndex = i;
    this.qr_code_table = (prod.qrcodes) ? prod.qrcodes : [];
    this.loader.start();
    this.apiService.viewProduct({id: prod.product_id}).subscribe(data => {
      if (data['status'] == 1) {
        this.productModels = [{
          id: prod.product_id,
          model_no: data['data'].model_no,
          hsn_code: data['data'].hsn_code
        }];
        this.ProductGroupId = prod.group_id;
        this.ProductModelId = prod.product_id;
        this.ProductHsnCode = data['data'].hsn_code;
        if (prod.hsn_code_changed) {
          this.ProductHsnCode = prod.hsn_code;
        }
        this.ProductQty = prod.qty;
        this.isQrCode = data['data'].qr_code;
        this.isSerialNo = data['data'].serial_no;
        this.isMacAddress = data['data'].mac_address;
        this.showAddItemModal = true; 
      }
      this.loader.stop();
    });
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  resetForm() {
    if (this.createMode) {
      this.purchaseOrders = [];
      this.productDetails = [];
      this.invalidForm = false;
      this.purchaseForm.reset();
      $('#e_way_time').val(null);
      $('#delivery_time').val(null);  
    } else {
      $('#e_way_time').val(null);
      $('#delivery_time').val(null);
      this.purchaseId = this.purchaseForm.value.id;
      this.showData();
    }
  }

  closeForm() {
    this.purchaseOrders = [];
    this.productDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.invalidForm = false;
    this.purchaseForm.reset();
    $('#e_way_time').val(null);
    $('#delivery_time').val(null);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  viewCreateMode() {
    // this.createMode = true;
    // this.editMode = false;
    // this.purchaseForm.reset();
    // let tims = this.getTimes(new Date);
    // this.purchaseForm.controls.delivery_time.setValue(tims);
    // this.purchaseForm.controls.received_by.setValue(this.approvedUser.id);
  }
  
  viewEditMode() {
    // this.createMode = false;
    // this.editMode = true;
    this.viewMode = false;
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.getSupplier();
  }

  previewMode() {
    // this.createMode = false;
    this.viewMode = true;
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.getSupplier();
  }

  saveDelivered() {
    if (this.DeliveredName) {
      this.loader.start();
      this.apiService.saveDeliveredBy({name:this.DeliveredName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.deliveredBy.push(data['data']);
          this.purchaseForm.controls.delivered_by.setValue(data['data'].id);
        }
        this.showDeliveredModal = false;
      });
    }
  }

  savePurchase() {
    for(var r in this.purchaseForm.controls) {
      console.log(r, this.purchaseForm.controls[r].invalid)
    }
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.productDetails.length == 0) {
      this.toastr.error('ERROR', 'Please select atleast one product.');
      return
    }

    this.productDetails.forEach((item) => {
      if (this.isNotValid(item.qty)) {
        this.invalidForm = true;
      }
    });

    if (this.invalidForm) {
      this.toastr.error('ERROR', 'Please enter quantity');
      return;
    }

    this.saveAndUpdate(true);
  }

  saveAndUpdate(status: any) {
    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.approvedPurchase({id: this.purchaseForm.value.id, status: 'Purchased'}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Items are added in Stock-Inventory & saved.');
          this.showPrintModal = true;
          // this.closeForm();
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
      this.toastr.error('ERROR', 'Please Select Purchase.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase.');
    } else {
      this.loader.start();
      this.apiService.deletePurchase({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase deleted successfully.'); 
        }
      });
    }
  }

  viewAddItemModal() {
    this.editProduct = false;
    this.isQrCode = null;
    this.isMacAddress = null;
    this.isSerialNo = null;
    this.selectedProductIndex = null;
    this.ProductHsnCode = null;
    this.ProductModelId = null;
    this.ProductGroupId = null;
    this.ProductQty = null;
    this.productModels = [];
    this.showAddItemModal = true;
  }

  viewProductDetailModal(product_id: any) {
    if (!this.isNotValid(product_id)) {
      this.loader.start();
      this.apiService.viewProduct({id: product_id}).subscribe(data => {
        if (data['status'] == 1) {
          this.selectedModal = data['data'];
          if (this.selectedModal.photo) {
            this.productImage = this.selectedModal.photo;
          }
          this.showProductDetailModal = true;
        }
        this.loader.stop();
      });
    }
  }

  addItem() {
    this.isFormError = false;
    if (this.isNotValid(this.ProductGroupId) || this.isNotValid(this.ProductModelId) || this.isNotValid(this.ProductHsnCode) || this.isNotValid(this.ProductQty)) {
      this.isFormError = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.isQrCode && (this.isMacAddress || this.isSerialNo) && this.qr_code_table.length) {
      let isEmpty = false;
      this.qr_code_table.forEach((itm) => {
        if(this.isNotValid(itm.mac_address) || this.isNotValid(itm.serial_no)) {
          isEmpty = true;
        }
      });
      if (isEmpty) {
        this.showEmptyModal = true;
      } else {
        this.saveUpdateProduct();  
      }
    } else {
      this.saveUpdateProduct();
    }
  }

  saveUpdateProduct() {
    if (this.editProduct) {
      this.showAddItemModal = false;
      this.productDetails[this.selectedProductIndex].qty = this.ProductQty;
      this.productDetails[this.selectedProductIndex].qrcodes = this.qr_code_table;
      return;
    }

    let description = null;
    let product_name = null;
    let group_name = null;
    let hsnCodeChanged = null;
    for(var r in this.productModels) {
      if (this.productModels[r].id == this.ProductModelId) {
        description = this.productModels[r].description +'&#13;&#10;Prod. Code: '+ this.productModels[r].product_code +'&#13;&#10;Warranty: '+ this.productModels[r].supplier_warranty +' Months&#13;&#10;HSN Code: '+ this.productModels[r].hsn_code;
        product_name = this.productModels[r].model_no;
        if (this.ProductHsnCode != this.productModels[r].hsn_code) {
          hsnCodeChanged = 1;
        }
      }
    }

    for(var r in this.productGroups) {
      if (this.productGroups[r].id == this.ProductGroupId) {
        group_name = this.productGroups[r].name;
      }
    }

    this.productDetails.push({
      id: null,
      type: 'Product',
      group_id: this.ProductGroupId,
      product_id: this.ProductModelId,
      group_name: group_name,
      product_name: product_name,
      hsn_code: this.ProductHsnCode,
      hsn_code_changed: hsnCodeChanged,
      is_paired: null,
      paired_id: null,
      description: description,
      qty: this.ProductQty,
      remark: null,
      show: false,
      qrcodes: this.qr_code_table
    });

    this.loader.start();
    this.apiService.showProduct({id: this.ProductModelId}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (data['paired'] && data['paired'].length) {
          data['paired'].forEach((item: any) => {
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            let found = false;
            this.productDetails.filter((prditem) => {
               if (prditem.product_id == item.model_id && prditem.paired_id == this.ProductModelId) {
                prditem.group_name = item.group.name;
                prditem.product_name = item.prmodel.model_no;
                prditem.description = desc;
                found = true;
               }
            });
            if (!found) {
              this.productDetails.push({
                id: null,
                type: 'Product',
                group_id: item.group_id,
                product_id: item.model_id,
                group_name: item.group.name,
                product_name: item.prmodel.model_no,
                is_paired: true,
                paired_id: this.ProductModelId,
                description: desc,
                hsn_code: this.ProductHsnCode,
                hsn_code_changed: null,
                qty: null,
                remark: null,
                show: false,
                qrcodes: this.qr_code_table
              });
            }
          });
        }
      }
      this.showAddItemModal = false;
      this.loader.stop();
    });
  }

  yesContinue() {
    this.saveUpdateProduct();
    this.showEmptyModal = false;
    this.showAddItemModal = false;
  }

  getPurchaseOrder() {
    if (this.supplierId) {
      let sts = 'Approved';
      if (this.viewMode) {
        sts = 'Purchased';
      }
      this.loader.start();
      this.apiService.getPurchase({supplier_id: this.supplierId, status: sts}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseOrders = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  showData() {
    if (this.purchaseId) {
      this.loader.start();
      this.apiService.showPurchase({id: this.purchaseId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseData = data['data'];
          this.purchaseForm.patchValue(data['data']);
          this.showEditModal = false;
          if (data['data']['materials_received_date']) {
            $("#materials_received_date").datepicker("setDate", new Date(data['data']['materials_received_date']));
          }
          if (data['data']['invoice_date']) {
            $("#invoice_date").datepicker("setDate", new Date(data['data']['invoice_date']));
          }
          if (data['data']['challan_date']) {
            $("#challan_date").datepicker("setDate", new Date(data['data']['challan_date']));
          }
          if (data['data']['e_way_date']) {
            $("#e_way_date").datepicker("setDate", new Date(data['data']['e_way_date']));
          }
          if (data['data']['valid_from']) {
            $("#valid_from").datepicker("setDate", new Date(data['data']['valid_from']));
          }
          if (data['data']['valid_until']) {
            $("#valid_until").datepicker("setDate", new Date(data['data']['valid_until']));
          }
          this.purchaseId = null;
          this.supplierId = null;
          this.productDetails = data['data']['details'];
          this.productDetails.forEach((item, key) => {
            // if (!item.is_paired) {
            //   if (item.type == 'Product') {
            //     this.getModels(item, key, item.product_id);
            //   } else {
            //     this.getServices(item, key, item.product_id);
            //   }
            // } else {
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
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
            // }
          });
          this.suppliers.forEach((itm) => {
            if (itm.id == data['data']['supplier_id']) {
              this.SupplierName = itm.name;
            }
          })
          this.changeCopy();
        }
        this.loader.stop();
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
