import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
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
  isFocus = false;
  isFocuss = false;
  showOk = false;
  disableInvoiceCopy = false;
  disableEwayCopy = false;
  allDisabled = false;
  mainPaired = false;
  showChangeAlert = false;
  hideChangeAlert = false;
  showChangeAlertModal = false;
  suppliers : any[] = [];
  productGroups : any[] = [];
  productDetails : any[] = [];
  staffs : any[] = [];
  deliveredBy : any[] = [];
  purchaseOrders : any[] = [];
  productQrCodes : any[] = [];
  productModels : any[] = [];
  qr_code_table : any[] = [];
  invoices : any[] = [];
  purchaseNo:any;
  purchaseSrNo:any;
  selectedModal:any;
  selectedProductIndex:any;
  DeliveredName:any;
  InvoiceAmount: any;
  latestQrCode:any = {
    qr_code: null,
    code: 0,
    year: 0
  };
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
  ProductName:any = null;
  ProductQty:any = null;
  OldProductQty:any = null;
  isQrCode:any = null;
  isSerialNo:any = null;
  isMacAddress:any = null;
  isPaired:any = false;
  coded_item: any = 'Coded';
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_no: new FormControl(null, Validators.required),
      purchase_date: new FormControl(null, Validators.required),
      t_purchase_date: new FormControl(null),
      purchase_time: new FormControl(null, Validators.required),
      materials_received_date: new FormControl(null, Validators.required),
      received_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      // no_of_cartons: new FormControl(null, Validators.required),
      remarks: new FormControl(null),
      delivered_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      amount_paid: new FormControl(null),
      delivery_time: new FormControl(null,Validators.required),
      docket_no: new FormControl(null),
      total_weight: new FormControl(null),
      tansport_no_of_cartons: new FormControl(null,Validators.required),
      charged_weight: new FormControl(null),
      tansport_remarks: new FormControl(null),
      sr_no: new FormControl(null, Validators.required),
      invoice_copy: new FormControl(null, Validators.required),
      invoice_no: new FormControl({value: null, disabled: true}),
      invoice_amount: new FormControl({value: null, disabled: true}),
      invoice_date: new FormControl(null),
      challan_no: new FormControl(null),
      challan_date: new FormControl(null),
      e_way_bill_copy: new FormControl(null),
      e_way_bill_no: new FormControl({value: null, disabled: true}),
      e_way_date: new FormControl({value: null, disabled: true}),
      e_way_time: new FormControl(null),
      valid_from: new FormControl(null),
      valid_until: new FormControl(null),
      total_time: new FormControl(null),
      t_materials_received_date: new FormControl(null),
      t_invoice_date: new FormControl({value: null, disabled: true}),
      t_challan_date: new FormControl(null),
      t_e_way_date: new FormControl({value: null, disabled: true}),
      t_valid_from: new FormControl({value: null, disabled: true}),
      t_valid_until: new FormControl({value: null, disabled: true}),
      status: new FormControl(null)
    });

    this.getProductCodeGroup(true);
    this.getStaff();
    this.getDeliveredBy();
  }

  ngOnInit(): void {
    this.getLatestQrCode();
    this.apiService.me().subscribe((data:any) => {
      this.approvedUser = data;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#materials_received_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.materials_received_date.setValue(date);
          this.purchaseForm.controls.t_materials_received_date.setValue(e.format());
      });

      $( "#invoice_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.invoice_date.setValue(date);
          this.purchaseForm.controls.t_invoice_date.setValue(e.format());
      });

      $( "#challan_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.challan_date.setValue(date);
          this.purchaseForm.controls.t_challan_date.setValue(e.format());
      });

      $( "#e_way_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.e_way_date.setValue(date);
          this.purchaseForm.controls.t_e_way_date.setValue(e.format());
      });

      $( "#valid_from" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.valid_from.setValue(date);
          this.purchaseForm.controls.t_valid_from.setValue(e.format());
          this.getTotalTime();
      });

      $( "#valid_until" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.valid_until.setValue(date);
          this.purchaseForm.controls.t_valid_until.setValue(e.format());
          this.getTotalTime();
      });

      // $( "#purchase_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
      //     const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
      //     this.purchaseForm.controls.purchase_date.setValue(date);
      // });

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

      // $('#purchase_time').timepicker({
      //   timeFormat: 'h:mm p',
      //   interval: 30,
      //   minTime: '8',
      //   maxTime: '8:00pm',
      //   startTime: '8:00',
      //   dynamic: false,
      //   dropdown: true,
      //   scrollbar: true,
      //   change: (time: any) => {
      //     this.purchaseForm.controls.purchase_time.setValue(this.getTimes(time));
      //   }
      // });

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

  @HostListener('click', ['$event'])
  mouseClick(evt: any) {
    const flyoutElement = document.getElementById('name-of-initiative');
      let targetElement = evt.target;
      let targetElement1 = evt.target;
      do {
          if (targetElement === flyoutElement) {
            this.isFocus = (this.purchaseForm.value.invoice_copy == 'Yes');
            return;
          }
          targetElement = targetElement['parentNode'];
      } while (targetElement);

      this.isFocus = false;

      do {
          if (targetElement1 && targetElement1.classList && targetElement1.classList.contains('adminActions')) {
            this.isFocuss = true;
            return;
          }
          targetElement1 = targetElement1['parentNode'];
      } while (targetElement1);

      this.isFocuss = false;
      this.setFalseData(-1);
  }

  setFalseData(k: number) {
    this.productDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
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

  changedData() {
    this.showChangeAlert = true;
  }

  correctAmount() {
    this.showChangeAlertModal = false;
    this.hideChangeAlert = true;
    if (this.InvoiceAmount) {
      let amount = this.InvoiceAmount.toFixed(2);
      this.purchaseForm.controls.invoice_amount.setValue(amount);
      // $("#invoice_amount").focus();
    }
  }

  changeCopy(isTrue: boolean) {
    if (this.purchaseForm.value.invoice_copy == 'Yes') {
      this.purchaseForm.controls.invoice_no.enable();
      this.purchaseForm.controls.invoice_amount.enable();
      this.purchaseForm.controls.t_invoice_date.enable();

      if (this.createMode && isTrue) {
        this.purchaseForm.controls.invoice_no.setValue(null);
      }

      this.purchaseForm.controls.invoice_no.setValidators([Validators.required]);
      this.purchaseForm.controls.invoice_amount.setValidators([Validators.required]);
      this.purchaseForm.controls.invoice_date.setValidators([Validators.required]);
      this.purchaseForm.controls.t_invoice_date.setValidators([Validators.required]);
    } else {
      if (this.createMode && isTrue) {
        this.productDetails = [];
      }
      this.purchaseForm.controls.invoice_no.disable();
      this.purchaseForm.controls.invoice_amount.disable();
      this.purchaseForm.controls.t_invoice_date.disable();

      this.purchaseForm.controls.invoice_no.setValue(this.purchaseForm.value.sr_no);
      this.purchaseForm.controls.invoice_amount.setValue(null);
      this.purchaseForm.controls.invoice_date.setValue(null);
      this.purchaseForm.controls.t_invoice_date.setValue(null);

      this.purchaseForm.controls.invoice_no.clearValidators();
      this.purchaseForm.controls.invoice_amount.clearValidators();
      this.purchaseForm.controls.invoice_date.clearValidators();
      this.purchaseForm.controls.t_invoice_date.clearValidators();
    }

    this.purchaseForm.controls.invoice_no.updateValueAndValidity();
    this.purchaseForm.controls.invoice_date.updateValueAndValidity();
    this.purchaseForm.controls.invoice_amount.updateValueAndValidity();
    this.purchaseForm.controls.t_invoice_date.updateValueAndValidity();

    if (this.purchaseForm.value.e_way_bill_copy == 'Yes') {
      this.purchaseForm.controls.e_way_bill_no.enable();
      this.purchaseForm.controls.t_e_way_date.enable();
      this.purchaseForm.controls.t_valid_from.enable();
      this.purchaseForm.controls.t_valid_until.enable();
      $("#e_way_time").removeAttr("disabled", "disabled"); 
    } else {
      this.purchaseForm.controls.e_way_bill_no.disable();
      this.purchaseForm.controls.t_e_way_date.disable();
      this.purchaseForm.controls.t_valid_from.disable();
      this.purchaseForm.controls.t_valid_until.disable();
      $("#e_way_time").attr("disabled", "disabled"); 

      this.purchaseForm.controls.e_way_bill_no.setValue(null);
      this.purchaseForm.controls.t_e_way_date.setValue(null);
      this.purchaseForm.controls.e_way_time.setValue(null);
      this.purchaseForm.controls.t_valid_from.setValue(null);
      this.purchaseForm.controls.t_valid_until.setValue(null);
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
    });
    // this.apiService.getDeliveredBy({name:this.DeliveredName}).subscribe(data => {
    //     this.loader.stop();
    //     this.deliveredBy = data['data'];
    // });
  }

  getSupplier() {
    this.apiService.getSupplier({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'purc'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getPurchaseNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.supplier_id)) {
      this.apiService.getPurchaseNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseNo = data['data'];
          this.purchaseSrNo = data['sr_no'];
          this.purchaseForm.controls.purchase_no.setValue(this.purchaseNo);
          this.purchaseForm.controls.sr_no.setValue(this.purchaseSrNo);
          this.invoices = data['invoices'];
          if (this.createMode && this.purchaseForm.value.invoice_copy == 'No') {
            this.purchaseForm.controls.invoice_no.setValue(this.purchaseForm.value.sr_no);
          }
        }
      });
    } else {
      this.purchaseNo = null;
      this.purchaseSrNo = null;
      this.purchaseForm.controls.purchase_no.setValue(this.purchaseNo);
      this.purchaseForm.controls.sr_no.setValue(this.purchaseSrNo);
    }
  }

  getInvoices() {
    this.apiService.getPurchaseNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.invoices = data['invoices'];
      }
    });
  }

  showInvoice() {
    this.isFocus = (this.purchaseForm.value.invoice_copy == 'Yes');
  }

  setInvoice(val: any) {
    this.purchaseForm.controls.invoice_no.setValue(val);
    setTimeout(() => {
      this.isFocus = false;
    },100)
    this.getDispatchByInvoice();
  }

  getDispatchByInvoice() {
    this.loader.start();
    this.apiService.getDispatchByInvoice({invoice_no: this.purchaseForm.value.invoice_no}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        if (data['data'] && data['data']['invoice_amount']) {
          let invoice_amount = null;
          if (data['data']['invoice_amount']) {
            invoice_amount = data['data']['invoice_amount'].toFixed(2);
          }
          this.purchaseForm.controls.invoice_amount.setValue(invoice_amount);
          this.purchaseForm.controls.t_invoice_date.setValue(new Date(data['data']['invoice_date']));
          $("#invoice_date").datepicker('setDate', new Date(data['data']['invoice_date']));
          this.purchaseForm.controls.invoice_date.setValue(data['data']['invoice_date']);
          this.purchaseForm.controls.e_way_bill_no.setValue(data['data']['e_way_bill_no']);
          this.purchaseForm.controls.e_way_time.setValue(data['data']['e_way_time']);
          this.purchaseForm.controls.delivered_by.setValue(data['data']['transporter_id']);
          this.purchaseForm.controls.docket_no.setValue(data['data']['track_consignment']);
          this.purchaseForm.controls.tansport_no_of_cartons.setValue(data['data']['no_of_cartons']);
          if (data['data']['e_way_date']) {
            this.purchaseForm.controls.e_way_date.setValue(data['data']['e_way_date']);
            $("#e_way_date").datepicker('setDate', new Date(data['data']['e_way_date']));
          }
          if (data['data']['valid_from']) {
            this.purchaseForm.controls.valid_from.setValue(data['data']['valid_from']);
            $("#valid_from").datepicker('setDate', new Date(data['data']['valid_from']));
          }
          if (data['data']['valid_until']) {
            this.purchaseForm.controls.valid_until.setValue(data['data']['valid_until']);
            $("#valid_until").datepicker('setDate', new Date(data['data']['valid_until']));
            this.getTotalTime();
          }
          if (data['data']['e_way_bill_no']) {
            this.purchaseForm.controls.e_way_bill_copy.setValue('Yes');
            this.changeCopy(false);
          }

          if (data['data']['details'] && data['data']['details'].length) {
            data['data']['details'].forEach((item:any, key:any) => {
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
                item.weight_kg = item.prmodel.weight_kg;
                item.hsn_code = item.prmodel.hsn_code;
                item.hsn_code_changed = null;
                item.qty = 0;
                item.remark = null;
                item.show = false;
                item.qrcodes = [];
              }
            });
            this.productDetails = data['data']['details'];
            this.setWeight();
            setTimeout(() => {
              $('td[data-toggle="tooltip"]').tooltip({html: true,trigger: 'click'})
            }, 1000);
          }
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

  // getProductGroup() {
  //   this.apiService.getProductGroup({}).subscribe(data => {
  //     if (data && data['status'] == 1) {
  //       this.productGroups = data['data'];
  //     }
  //   });
  // }

  getProductCodeGroup(isClear: boolean) {
    if (isClear) {
      this.ProductGroupId = null;
      this.ProductModelId = null;
      this.ProductHsnCode = null;
      this.ProductQty = null;
      this.qr_code_table = [];
    }
    this.apiService.getProductGroup({coded_item: this.coded_item}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getSingleModel() {
    if (!this.isNotValid(this.ProductGroupId)) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.ProductGroupId, coded_item: this.coded_item}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.productModels = data['data'];
          if (!this.editMode) {
            this.OldProductQty = 0;
          }
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
          this.ProductName = this.productModels[r].model_no;
          this.ProductHsnCode = this.productModels[r].hsn_code;
          this.isQrCode = this.productModels[r].qr_code;
          this.isSerialNo = this.productModels[r].serial_no;
          this.isMacAddress = this.productModels[r].mac_address;
          if (this.productModels[r].hsn_code_alert && this.productModels[r].hsn_code_allow) {
            this.hsnCodeAlert = true;
          }
        }
      }
      if (!this.ProductHsnCode) {
        this.changeHsn = true;
      } else {
        this.changeHsn = false;
      }
    } else {
      this.ProductHsnCode = null;
      this.isQrCode = null;
      this.isSerialNo = null;
      this.isMacAddress = null;
    }
    if (!this.editProduct) {
      this.qr_code_table = [];
    }
  }

  getLatestQrCode() {
    this.apiService.getLatestQrCode({}).subscribe(data => {
      if (data && data['data']) {
        this.latestQrCode = data['data'];
      } else {
        let cYeat = new Date().getFullYear().toString().substr(-2);
        this.latestQrCode.year = cYeat;
      }
    });
  }

  generateQrCode() {
    if (!this.isNotValid(this.ProductQty)) {

      let qty = Number(this.ProductQty);
      if (!this.isNotValid(this.OldProductQty)) {
        if (Number(this.ProductQty) < Number(this.OldProductQty)) {
          this.toastr.error('ERROR', 'You can not reduce purchased quantity!');
          return;
        } 
        qty = Number(this.ProductQty) - Number(this.OldProductQty);
      }

      let qrCode = parseInt(this.latestQrCode.code);
      this.productDetails.forEach((item) => {
        if (item.qrcodes.length) {
          item.qrcodes.forEach((itm: any) => {
            let codespl = itm.qr_code.substring(0, 5);
            if (qrCode < codespl) {
              qrCode = parseInt(codespl);
            }
          });
        }
      });

      if (this.qr_code_table.length) {
        this.qr_code_table.forEach((itm: any) => {
          let codespl = itm.qr_code.substring(0, 5);
          if (qrCode < codespl) {
            qrCode = parseInt(codespl);
          }
        });
      }

      for (var i = 1;i <= qty; i++) {
        qrCode = qrCode + 1;
        let text = "0000" + qrCode;
        let result = text.substr(text.length - 5);
        this.qr_code_table.push({
          srno: 0,
          qr_code: result + '' + this.datePipe.transform(new Date(), 'yyMMdd'),
          mac_address: null,
          serial_no: null,
          product_id: this.ProductGroupId,
          group_id: this.ProductModelId
        });
      }
      this.OldProductQty = Number(this.ProductQty);
    }
  }

  editProductModal(prod: any, i: any) {
    this.editProduct = true;
    this.mainPaired = false;
    this.selectedProductIndex = i;
    this.qr_code_table = (prod.qrcodes) ? JSON.parse(JSON.stringify(prod.qrcodes)) : [];
    this.ProductGroupId = prod.group_id;
    this.ProductModelId = prod.product_id;
    let exists = this.productDetails.filter((row) => { return (row.paired_id == prod.product_id) });
    if (exists.length) {
      this.mainPaired = true;
    }
    this.getProductCodeGroup(false);
    this.getSingleModel();
    this.loader.start();
    this.apiService.viewProduct({id: prod.product_id}).subscribe(data => {
      if (data['status'] == 1) {
        this.ProductHsnCode = data['data'].hsn_code;
        if (prod.hsn_code_changed) {
          this.ProductHsnCode = prod.hsn_code;
        }
        this.ProductQty = Number(prod.qty);
        this.OldProductQty = Number(prod.qty);
        this.isQrCode = data['data'].qr_code;
        this.isSerialNo = data['data'].serial_no;
        this.isMacAddress = data['data'].mac_address;
        this.isPaired = prod['is_paired'];
        if (this.isQrCode) {
          this.coded_item = 'Coded';
        } else {
          this.coded_item = 'Non-Coded';
        }
        this.showAddItemModal = true; 
      }
      this.loader.stop();
    });
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
    this.setWeight();
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  resetForm() {
    if (this.createMode) {
      this.productDetails = [];
      this.invalidForm = false;
      this.purchaseForm.reset();
      // this.purchaseForm.controls.received_by.setValue(this.approvedUser.id);
      $('#e_way_time').val(null);
      $('#delivery_time').val(null); 
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.purchaseForm.controls.purchase_date.setValue(date);
      this.purchaseForm.controls.t_purchase_date.setValue(new Date());
      $("#purchase_date").datepicker('setDate', new Date())
      let tims = this.getTimes(new Date());
      this.purchaseForm.controls.purchase_time.setValue(tims); 
    } else {
      $('#e_way_time').val(null);
      $('#delivery_time').val(null);
      this.purchaseId = this.purchaseForm.value.id;
      this.showData();
    }
  }

  closeForm() {
    this.productDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.invalidForm = false;
    this.disableInvoiceCopy = false;
    this.allDisabled = false;
    this.disableEwayCopy = false;
    this.showChangeAlert = false;
    this.hideChangeAlert = false;
    this.showChangeAlertModal = false;
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
    if (this.createMode) {
      return
    }
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getSupplier();
  }

  setInitDate() {
    let tims = this.getTimes(new Date);
    this.purchaseForm.controls.delivery_time.setValue(tims);
    // this.purchaseForm.controls.received_by.setValue(this.approvedUser.id);
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.purchase_date.setValue(date);
    this.purchaseForm.controls.t_purchase_date.setValue(new Date());
    $("#purchase_date").datepicker('setDate', new Date())
    let timss = this.getTimes(new Date());
    this.purchaseForm.controls.purchase_time.setValue(timss); 
  }
  
  viewEditMode() {
    if (this.editMode) {
      return
    }
    // this.createMode = false;
    // this.editMode = true;
    this.purchaseForm.reset();
    // this.purchaseForm.controls.received_by.setValue(this.approvedUser.id);
    this.showEditModal = true;
    this.getEditSuppliers();
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

    for(var r in this.productDetails) {
      let item = this.productDetails[r];
      if (this.isNotValid(item.qty)) {
        this.toastr.error('ERROR', 'Please enter qnty for ' + item.product_name);
        this.invalidForm = true;
        break;
        return;
      }
    }

    if (this.invalidForm) {
      return;
    }

    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      if (this.showChangeAlert && !this.hideChangeAlert) {
        this.InvoiceAmount = this.purchaseForm.value.invoice_amount;
        this.showChangeAlertModal = true;
      } else {
        this.saveAndUpdate(false);
      }
    } else {
      this.saveAndUpdate(true);
      // this.finalPrompt = true;
    }
  }

  saveAndUpdate(status: any) {
    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    if (params.invoice_copy == 'No') {
      params.invoice_no = params.sr_no;
    }
    params.product_details = JSON.parse(JSON.stringify(this.productDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updatePurchase(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase update successfully.');
          this.closeForm();
          this.getLatestQrCode();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      params.status = (status) ? 'Pending': 'Approved';
      this.loader.start();
      this.apiService.savePurchase(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase saved successfully.');
          this.closeForm();
          this.getLatestQrCode();
          this.apiService.applyNotificationCount('GRNApproval');
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
      if (this.purchaseForm.value.status == 'Purchased') {
        this.toastr.error('ERROR', 'You can not delete this Purchase.');
        return;
      }
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

  changeHsnCode() {
    this.hsnCodeAlert = false;
    this.changeHsn = true;
    this.showOk = true;
    setTimeout(() => {
      $("#ProductHsnCode").focus();
    },100)
  }

  viewAddItemModal() {
    this.editProduct = false;
    this.isPaired = false;
    this.mainPaired = false;
    this.isQrCode = null;
    this.isMacAddress = null;
    this.isSerialNo = null;
    this.selectedProductIndex = null;
    this.ProductHsnCode = null;
    this.ProductModelId = null;
    this.ProductGroupId = null;
    this.ProductQty = null;
    this.OldProductQty = null;
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

  closeAddItem() {
    this.showAddItemModal = false;
  }

  addItem() {
    this.isFormError = false;
    if (this.isNotValid(this.ProductGroupId) || this.isNotValid(this.ProductModelId) || this.isNotValid(this.ProductQty)) {
      this.isFormError = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (!this.isPaired && this.isNotValid(this.ProductHsnCode)) {
      this.isFormError = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let qty = Number(this.ProductQty);
    if (!this.isNotValid(this.OldProductQty) && this.isQrCode) {
      if (Number(this.ProductQty) < Number(this.OldProductQty)) {
        this.toastr.error('ERROR', 'You can not reduce purchased quantity!');
        return;
      }
    }

    if (this.isQrCode && (this.isMacAddress || this.isSerialNo) && this.qr_code_table.length) {
      let isEmpty = false;
      this.qr_code_table.forEach((itm) => {
        if((this.isMacAddress && this.isNotValid(itm.mac_address)) || (this.isSerialNo && this.isNotValid(itm.serial_no))) {
          isEmpty = true;
        }
      });
      if (isEmpty) {
        for(var r in this.productModels) {
          if (this.productModels[r].id == this.ProductModelId) {
            this.ProductName = this.productModels[r].model_no;
          }
        }
        this.showEmptyModal = true;
      } else {
        this.saveUpdateProduct();  
      }
    } else {
      this.saveUpdateProduct();
    }
  }

  saveUpdateProduct() {
    this.changedData();
    let description = null;
    let tdescription = null;
    let product_name = null;
    let group_name = null;
    let hsnCodeChanged = null;
    let weight_kg = 0;
    for(var r in this.productModels) {
      if (this.productModels[r].id == this.ProductModelId) {
        product_name = this.productModels[r].model_no;
        if (this.ProductHsnCode != this.productModels[r].hsn_code) {
          hsnCodeChanged = 1;
        }
        weight_kg = (this.productModels[r].weight_kg) ? this.productModels[r].weight_kg: 0;
        let sw = 'Not Applicable';
        let hsn = '';
        let product_code = '';
        if (!this.isNotValid(this.productModels[r].supplier_warranty)) {
          sw = this.productModels[r].supplier_warranty + ' Months';
        }
        if (this.productModels[r].hsn_code) {
          hsn = this.productModels[r].hsn_code;
        }
        if (this.productModels[r].product_code) {
          product_code = this.productModels[r].product_code;
        }
        description = this.productModels[r].description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
        tdescription = this.productModels[r].description +'<br>Warranty: '+ sw +'<br>Product Code: '+ product_code +'<br>HSN Code: '+ hsn;
      }
    }

    for(var r in this.productGroups) {
      if (this.productGroups[r].id == this.ProductGroupId) {
        group_name = this.productGroups[r].name;
      }
    }

    if (this.editProduct) {
      this.showAddItemModal = false;
      this.productDetails[this.selectedProductIndex].qty = this.ProductQty;
      this.productDetails[this.selectedProductIndex].qrcodes = JSON.parse(JSON.stringify(this.qr_code_table));
      this.productDetails[this.selectedProductIndex].group_id = this.ProductGroupId;
      this.productDetails[this.selectedProductIndex].product_id = this.ProductModelId;
      this.productDetails[this.selectedProductIndex].group_name = group_name;
      this.productDetails[this.selectedProductIndex].product_name = product_name;
      this.productDetails[this.selectedProductIndex].hsn_code = this.ProductHsnCode;
      this.productDetails[this.selectedProductIndex].hsn_code_changed = hsnCodeChanged;
      this.productDetails[this.selectedProductIndex].weight_kg = weight_kg;
      this.productDetails[this.selectedProductIndex].description = description;
      this.productDetails[this.selectedProductIndex].tdescription = tdescription;
      this.setWeight();
      return;
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
      weight_kg: weight_kg,
      description: description,
      tdescription: tdescription,
      qty: this.ProductQty,
      remark: null,
      show: false,
      qrcodes: JSON.parse(JSON.stringify(this.qr_code_table))
    });

    this.loader.start();
    this.apiService.showProduct({id: this.ProductModelId}).subscribe(data => {
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
            let tdesc = item.prmodel.description +'<br>Warranty: '+ sw +'<br>Product Code: '+ product_code +'<br>HSN Code: '+ hsn;
            let found = false;
            this.productDetails.filter((prditem) => {
               if (prditem.product_id == item.model_id && prditem.paired_id == this.ProductModelId) {
                prditem.group_name = item.group.name;
                prditem.product_name = item.prmodel.model_no;
                prditem.weight_kg = (item.prmodel.weight_kg) ? item.prmodel.weight_kg: 0;
                prditem.description = desc;
                prditem.tdescription = tdesc;
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
                weight_kg: (item.prmodel.weight_kg) ? item.prmodel.weight_kg: 0,
                is_paired: true,
                paired_id: this.ProductModelId,
                description: desc,
                tdescription: tdesc,
                hsn_code: this.ProductHsnCode,
                hsn_code_changed: null,
                qty: null,
                remark: null,
                show: false,
                qrcodes: JSON.parse(JSON.stringify(this.qr_code_table))
              });
            }
          });
        }
      }
      setTimeout(() => {
        $('td[data-toggle="tooltip"]').tooltip({html: true,trigger: 'click'})
      }, 1000);
      this.setWeight();
      this.showAddItemModal = false;
      this.loader.stop();
    });
  }

  setWeight() {
    let total_weight = 0;
    this.productDetails.forEach((itm) => {
      let qty = 0;
      if (!itm.weight_kg) {
        itm.weight_kg = 0;
      }
      if (itm.qty) {
        qty = parseInt(itm.qty);
      }
      total_weight += parseFloat(itm.weight_kg) * qty;
    });
    this.purchaseForm.controls.total_weight.setValue(total_weight);
  }

  yesContinue() {
    this.saveUpdateProduct();
    this.showEmptyModal = false;
    this.showAddItemModal = false;
  }

  getPurchaseOrder() {
    if (this.supplierId) {
      this.loader.start();
      this.apiService.getPurchase({supplier_id: this.supplierId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseOrders = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  showData() {
    if (this.purchaseId) {
      this.disableInvoiceCopy = false;
      this.disableEwayCopy = false;
      this.allDisabled = false;
      this.loader.start();
      this.apiService.showPurchase({id: this.purchaseId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          if (data['data']['invoice_amount']) {
            data['data']['invoice_amount'] = parseFloat(data['data']['invoice_amount']).toFixed(2);
          }
          if (data['data']['status'] == 'Approved' || data['data']['status'] == 'Purchased') {
            this.allDisabled = true;
          }
          this.purchaseForm.patchValue(data['data']);
          if (this.purchaseForm.value.invoice_copy == 'Yes') {
            this.disableInvoiceCopy = true;
          }
          if (this.purchaseForm.value.e_way_bill_copy == 'Yes') {
            this.disableEwayCopy = true;
          }
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
          if (data['data']['purchase_date']) {
            $("#purchase_date").datepicker("setDate", new Date(data['data']['purchase_date']));
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
              item.tdescription = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
              
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
              item.weight_kg = item.prmodel.weight_kg;
            // }
          });
          if (this.purchaseForm.value.invoice_copy == 'Yes') {
            this.changeCopy(false);
          }
          this.getInvoices();
          setTimeout(() => {
            $('td[data-toggle="tooltip"]').tooltip({html: true,trigger: 'click'})
          }, 1000);
        }
        this.loader.stop();
      });
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