import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  purchaseForm: FormGroup;
  contactForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  showAlert = false;
  showAddLocationModal = false;
  showAddProjectModal = false;
  showAddAttentionModal = false;
  showProductDetailModal = false;
  showRemarkModal = false;
  showRemoveModal = false;
  showTermsModel = false;
  showItcRateTable = false;
  showCommissionModal = false;
  showApprovedConfirmed = false;
  isApprovedQ = false;
  showApplyBtn = false;
  doneDiscount = false;
  viewManagerDiscount = false;
  showManagerDiscountModal = false;
  showManagerDiscount = false;
  showCancelDiscountModal = false;
  attentionModal = false;
  showPairedProductQtyModal = false;
  pairedQtyAlertModal = false;
  isFocus = false;
  isFocuss = false;
  isFocusV = false;
  hasChanged = false;
  showReviseModal = false;
  disableButton = false;
  invalidContactForm = false;
  showContactForm = false;
  readonlyMode = false;
  accounts: any[] = [];
  months:any[]=[];
  staffs: any[] = [];
  attentions: any[] = [];
  locations: any[] = [];
  projects: any[] = [];
  suppliers : any[] = [];
  productDetails : any[] = [];
  serviceDetails : any[] = [];
  productItc : any[] = [];
  productGroups: any[] = [];
  serviceGroups : any[] = [];
  quotations : any[] = [];
  services : any[] = [];
  addressDropdowns : any[] = [];
  departments : any[] = [];
  designations : any[] = [];
  quotaionMode: string = '';
  locationName: any;
  projectName: any;
  attentionName: any;
  productRemark:any;
  selectedModal:any;
  quotation_date:any;
  selectedProductIndex:any;
  DiscountMangerObj:any;
  DiscountProjectObj:any;
  stock:any;
  stockProductRemark:any;
  ProductName:any;
  MainProductName:any;
  MainQty:any;
  MaxQty:any;
  PairedQty:any;
  pIndex:any;
  QuotationName:any;
  productImage = './assets/images/product.jpg';
  stringAddress: string = '';
  MessageText: string = '';
  MessageTitle: string = '';
  ActionType: string = '';
  SaveBtn: string = '';
  CancelBtn: string = '';
  loginId = localStorage.getItem('token_id');
  msgs:any = {};
  newProject = 0;
  pre_sale_demand_id = 0;
  totalQuote:any = {
    approved: 0,
    nonapproved: 0,
    archived: 0
  }
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, Validators.required),
      project_id: new FormControl(null, Validators.required),
      quotation_type: new FormControl(null),
      quotation_id: new FormControl(null),
      months:new FormControl(null),
      quotation_no: new FormControl(null),
      t_quotation_date: new FormControl(null),
      quotation_date: new FormControl(null, Validators.required),
      quotation_mode: new FormControl(null, Validators.required),
      away_from_me: new FormControl(null, Validators.required),
      sales_executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      attention_to_id: new FormControl(null),
      contact_code: new FormControl(null),
      contact_number: new FormControl(null),
      email: new FormControl(null),
      transaction_type: new FormControl(null, Validators.required),
      approved_pre_demand: new FormControl(null),
      qty_rate_total: new FormControl(null),
      discount_total: new FormControl(null),
      sub_total: new FormControl(null),
      gst_total: new FormControl(null),
      total_amount: new FormControl(null),
      service_qty_rate_total: new FormControl(null),
      service_discount_total: new FormControl(null),
      service_sub_total: new FormControl(null),
      service_gst_total: new FormControl(null),
      service_total_amount: new FormControl(null),
      itc_qty_rate_total: new FormControl(null),
      itc_sub_total: new FormControl(null),
      itc_gst_total: new FormControl(null),
      itc_total_amount: new FormControl(null),
      native_amount: new FormControl(null),
      re_worked_amount: new FormControl(null),
      closure_amount: new FormControl({ value: null, disabled: true }),
      goods_delivery: new FormControl(null),
      termed_liability: new FormControl(null),
      product_warranty: new FormControl(null),
      reason_to_get_order: new FormControl(null),
      remarks: new FormControl(null),
      incentives_to_pay: new FormControl(null),
      extended_warranty: new FormControl(null),
      extended_warranty_month: new FormControl(null),
      incentives_person_name: new FormControl(null),
      incentives_pan_no: new FormControl(null),
      incentives_address_line_one: new FormControl(null),
      incentives_address_line_two: new FormControl(null),
      incentives_pincode: new FormControl(null),
      incentives_area_id: new FormControl(null),
      incentives_gst: new FormControl(null),
      reasonToPay: new FormControl(null),
      incentives_payment_condition: new FormControl(null),
      reason_for_discount: new FormControl(null),
      discount_request_category: new FormControl(null),
      discount_request_amount: new FormControl(null),
      is_discount_category: new FormControl(null),
      is_applied_discount: new FormControl(null),
      is_discount_done: new FormControl(),
      main_discount: new FormControl(null),
      discount_manager_id: new FormControl(null),
      discount_project_id: new FormControl(null),
      status: new FormControl(null),
    });

    this.contactForm = this.fb.group({
      id: new FormControl(null),
      account_id: new FormControl(null, Validators.required),
      account_name: new FormControl(null),
      department_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      designation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      first_name: new FormControl(null, Validators.required),
      mobile_code: new FormControl('91', Validators.required),
      mobile_number: new FormControl(null, Validators.required),
      last_name: new FormControl(null),
      phone_code: new FormControl('91'),
      phone_number: new FormControl(null),
      email: new FormControl(null),
      birth_date: new FormControl(null),
      b_date: new FormControl(null),
      anniversary_date: new FormControl(null),
      a_date: new FormControl(null),
      department_name: new FormControl(null)
    });

    this.msgs['id'] = 'Id';
    this.msgs['client_id'] = 'client';
    this.msgs['location_id'] = 'location';
    this.msgs['quotation_date'] = 'quotation date';
    this.msgs['quotation_mode'] = 'quotation mode';
    this.msgs['away_from_me'] = 'away from me';
    this.msgs['sales_executive_id'] = 'sales executive';
    this.msgs['transaction_type'] = 'transaction type';
    this.msgs['attention_to_id'] = 'attention';

    this.getProductGroup();
    this.getServiceGroup();
    this.addProdDetail('Product');
    this.getStaff();
    this.getService();
    this.getDepartment();
    this.getDesignation();
  }

  @HostListener('click', ['$event'])
  mouseClick(evt: any) {
    const flyoutElement = document.getElementsByClassName('adminActions');
      let targetElement = evt.target;
      let targetElement1 = evt.target;
      let targetElement2 = evt.target;
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
          if (targetElement1 && targetElement1.classList && targetElement1.classList.contains('adminActionsIt')) {
            this.isFocuss = true;
            return;
          }
          targetElement1 = targetElement1['parentNode'];
      } while (targetElement1);

      this.isFocuss = false;
      this.setItFalseData(-1);

      do {
          if (targetElement2 && targetElement2.classList && targetElement2.classList.contains('adminActionsSv')) {
            this.isFocusV = true;
            return;
          }
          targetElement2 = targetElement2['parentNode'];
      } while (targetElement2);

      this.isFocusV = false;
      this.setSvFalseData(-1);
  }

  setFalseData(k: number) {
    this.productDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  setItFalseData(k: number) {
    this.productItc.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  setSvFalseData(k: number) {
    this.serviceDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.months= ['January','February','March','April','May','June','July','Auguest','September','Octomber','November','December']
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#quotation_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.quotation_date.setValue(date);
      });
      $('#quotation_date').mask('00/00/0000');
    },1000)
  }


  DeletePreSalesApproval(){
  this.showTermsModel = false
  this.purchaseForm.controls.approved_pre_demand.setValue(false);
  this.purchaseForm.reset();
  }



  setEnableDisable() {
    if (this.quotaionMode == 'R' && this.createMode && this.isNotValid(this.purchaseForm.value.quotation_id)) {
      this.purchaseForm.controls.away_from_me.disable();
      this.purchaseForm.controls.sales_executive_id.disable();
      this.purchaseForm.controls.attention_to_id.disable();
      this.purchaseForm.controls.contact_code.disable();
      this.purchaseForm.controls.contact_number.disable();
      this.purchaseForm.controls.email.disable();
      this.purchaseForm.controls.transaction_type.disable();
      this.purchaseForm.controls.approved_pre_demand.disable();
    } else {
      this.purchaseForm.controls.away_from_me.enable();
      this.purchaseForm.controls.sales_executive_id.enable();
      this.purchaseForm.controls.attention_to_id.enable();
      this.purchaseForm.controls.contact_code.enable();
      this.purchaseForm.controls.contact_number.enable();
      this.purchaseForm.controls.email.enable();
      this.purchaseForm.controls.transaction_type.enable();
      this.purchaseForm.controls.approved_pre_demand.enable();
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

  getService() {
    this.apiService.getService({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.services = data['data'];
      }
    });
  }

  getQuotations() {
    if (!this.isNotValid(this.purchaseForm.value.client_id) && !this.isNotValid(this.purchaseForm.value.location_id)) {
      this.loader.start();
      this.apiService.getQuotation({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id, project_id: this.purchaseForm.value.project_id, status: this.purchaseForm.value.quotation_type}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.quotations = data['data'];
        }
        this.loader.stop();
      });
    }
    if (this.quotaionMode != 'R') {
      this.getQuotationNo();
    }
    if ((this.quotaionMode == 'R' || this.editMode) && this.purchaseForm.value.quotation_type != 'Non-Approved') {
      this.readonlyMode = true;
    } else {
      this.readonlyMode = false;
    }

    if (this.quotaionMode == 'R' || this.editMode) {
      if (this.isNotValid(this.purchaseForm.value.project_id)) {
        this.totalQuote.approved = 0;
        this.totalQuote.nonapproved = 0;
        this.totalQuote.archived = 0;
      } else {
        this.countQuotation('approved', 'Approved');
        this.countQuotation('nonapproved', 'Non-Approved');
        this.countQuotation('archived', 'Archived');
      }
    }
  }

  getQuotationNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getQuotationNo({client_id: this.purchaseForm.value.client_id, quotation_mode: this.quotaionMode, quotation_id: this.purchaseForm.value.quotation_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.quotation_no.setValue(data['data']);
        }
      });
    } else {
      this.purchaseForm.controls.quotation_no.setValue(null);
    }
  }

  changeQuotation() {
    this.DiscountMangerObj = null;
    this.DiscountProjectObj = null;
    if (!this.isNotValid(this.purchaseForm.value.quotation_id)) {
      this.setEnableDisable();
      this.loader.start();
      this.apiService.showQuotation({id: this.purchaseForm.value.quotation_id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.quotation_date = data['data'].quotation_date;
          this.pre_sale_demand_id = data['data'].pre_sale_demand_id;
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.serviceDetails = data['data']['sdetails'];
          this.productItc = data['data']['itc'];
          this.productDetails.forEach((item, key) => {
            if (!item.is_paired) {
              if (item.type == 'Product') {
                this.getModels(item, key, item.product_id);
              } else {
                this.getServices(item, key, item.product_id);
              }
            } else {
              let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
              item.description = desc;
            }
          })
          this.serviceDetails.forEach((item, key) => {
              item.description = item.prmodel.description;
          });
          this.isApprovedQ = false;
          if (data['data']['approved_pre_demand']) {
            this.isApprovedQ = true;
          }
          this.productItc.forEach((item, key) => {
            item.itc_rate = item.rate;
            item.itc_hsncode = item.itc_hsncode;
            item.itc_gst_rate = item.gst_percentage;
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
            item.description = desc;
          });
          if (data['data']['discountmg']) {
            this.DiscountMangerObj = data['data']['discountmg'];
            this.purchaseForm.controls.closure_amount.enable();
          }
          if (data['data']['discountpg']) {
            this.DiscountProjectObj = data['data']['discountpg'];
          }

          if (this.DiscountMangerObj && this.DiscountProjectObj) {
            this.doneDiscount = true;
          }

          if (this.purchaseForm.value.is_discount_category && this.purchaseForm.value.discount_request_amount) {
            this.showManagerDiscount = true;
          }

          if (Number(this.purchaseForm.value.closure_amount) <= Number(this.purchaseForm.value.re_worked_amount)) {
            this.doneDiscount = true;
          }
          this.stringAddress = '';
          if (data['data'].incentives_to_pay && data['data']['incentives_area_id']) {
            let newAddress : any[] = [];
            if (data['data']['incentives_address_line_one']) {
              newAddress.push(data['data']['incentives_address_line_one']);
            }
            if (data['data']['incentives_address_line_two']) {
              newAddress.push(data['data']['incentives_address_line_two']);
            }
            if (data['data']['city_name']) {
              let ct = data['data']['city_name'];
              if (data['data']['incentives_pincode']) {
                ct += '-' + data['data']['incentives_pincode'];
              }
              newAddress.push(ct);
            }
            if (data['data']['state_name']) {
              newAddress.push(data['data']['state_name']);
            }
            if (data['data']['country_name']) {
              newAddress.push(data['data']['country_name']);
            }
            this.stringAddress = newAddress.join(', ');
          }
          if (this.quotaionMode == 'R') {
            this.getQuotationNo();
            this.purchaseForm.controls.id.setValue(null);
            this.purchaseForm.controls.quotation_mode.setValue(this.quotaionMode);
          }
        }
        this.loader.stop();
      });
    }
  }

  formValueChange() {
    this.hasChanged = true;
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getAllAddress() {
    this.apiService.getAllAddress({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.addressDropdowns = data['data'];
        this.showCommissionModal = true;
        // this.isLoadedAddress = true;
      }
    });
  }

  getAddress(address: any) {
    console.log(address);
    this.purchaseForm.controls.incentives_address_line_one.setValue(address.address_one);
    this.purchaseForm.controls.incentives_address_line_two.setValue(address.address_two);
    this.purchaseForm.controls.incentives_pincode.setValue(address.pincode);
    this.purchaseForm.controls.incentives_area_id.setValue(address.area_id);
  }

  getClients() {
    this.apiService.getClients({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.accounts = data['data'];
      }
    });
  }

  getEditClients() {
    this.apiService.editClients({page: 'ques'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.accounts = data['data'];
      }
    });
  }

  getLocation() {
    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      return
    }
    if (this.editMode) {
      this.purchaseForm.controls.sales_executive_id.setValue(this.loginId);
    }
    this.loader.start();
    this.apiService.getLocation({parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
      this.loader.stop();
    });
  }

  getAttentions() {
    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      return
    }
    this.apiService.getAccountPerson({account_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.attentions = data['data'];
      }
    });
  }

  changeAtt() {
    this.attentions.forEach((item) => {
      if (item.id == this.purchaseForm.value.attention_to_id) {
        this.purchaseForm.controls.contact_code.setValue(item.mobile_code)
        this.purchaseForm.controls.contact_number.setValue(item.mobile_number)
        this.purchaseForm.controls.email.setValue(item.email)
      }
    })    
  }

  countQuotation(field: string, status: string) {
    this.apiService.countQuotation({status: status, project_id: this.purchaseForm.value.project_id, location_id: this.purchaseForm.value.location_id, client_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.totalQuote[field] = data['data'];
      }
    });
  }

  getProject() {
    this.apiService.getProject({location_id: this.purchaseForm.value.location_id, client_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });

    if (this.quotaionMode == 'R' || this.editMode) {
      if (this.isNotValid(this.purchaseForm.value.location_id)) {
        this.totalQuote.approved = 0;
        this.totalQuote.nonapproved = 0;
        this.totalQuote.archived = 0;
      }
    }
  }

  changeApproved() {
    if (this.isApprovedQ && this.purchaseForm.value.status == 'Approved') {
      this.showApprovedConfirmed = true;  
      return;
    }
    if (this.purchaseForm.value.re_worked_amount && this.isNotValid(this.purchaseForm.value.is_applied_discount)) {
      if (this.purchaseForm.value.approved_pre_demand) {
        this.purchaseForm.controls.approved_pre_demand.setValue(false);
        this.toastr.error('ERROR', 'Please apply discount first.');
        return;
      }  
    }
    if (this.purchaseForm.value.approved_pre_demand) {
      this.purchaseForm.controls['goods_delivery'].setValidators([Validators.required]);
      this.purchaseForm.controls['termed_liability'].setValidators([Validators.required]);
      this.showTermsModel = true;
    } else {
      this.purchaseForm.controls['goods_delivery'].clearValidators();
      this.purchaseForm.controls['termed_liability'].clearValidators();
    }
    this.purchaseForm.controls['goods_delivery'].updateValueAndValidity();
    this.purchaseForm.controls['termed_liability'].updateValueAndValidity();
  }

  clearApprovedData(status: any) {
    if (!status) {
      this.purchaseForm.controls.approved_pre_demand.setValue(true);
    } else {
      this.isApprovedQ = false;
    }
    this.showApprovedConfirmed = false;
  }

  saveConditions() {
    if (this.purchaseForm.controls.goods_delivery.invalid) {
      this.toastr.error('ERROR', 'Please Enter Goods Delivery.');
      return;
    }

    if (this.purchaseForm.controls.termed_liability.invalid) {
      this.toastr.error('ERROR', 'Please Enter Termed Liability.');
      return;
    }

    this.showTermsModel = false;
  }

  changeIncentivesPay() {
    if (this.purchaseForm.value.approved_pre_demand) {
      this.purchaseForm.controls['incentives_person_name'].setValidators([Validators.required]);
      this.purchaseForm.controls['incentives_gst'].setValidators([Validators.required]);
      this.purchaseForm.controls['reasonToPay'].setValidators([Validators.required]);
      this.purchaseForm.controls['incentives_payment_condition'].setValidators([Validators.required]);
      this.purchaseForm.controls['incentives_address_line_one'].setValidators([Validators.required]);
      this.purchaseForm.controls['incentives_pincode'].setValidators([Validators.required]);
      this.purchaseForm.controls['incentives_area_id'].setValidators([Validators.required]);
      this.showTermsModel = true;
    } else {
      this.purchaseForm.controls['incentives_person_name'].clearValidators();
      this.purchaseForm.controls['incentives_gst'].clearValidators();
      this.purchaseForm.controls['reasonToPay'].clearValidators();
      this.purchaseForm.controls['incentives_payment_condition'].clearValidators();
      this.purchaseForm.controls['incentives_address_line_one'].clearValidators();
      this.purchaseForm.controls['incentives_pincode'].clearValidators();
      this.purchaseForm.controls['incentives_area_id'].clearValidators();
    }
    this.purchaseForm.controls['incentives_person_name'].updateValueAndValidity();
    this.purchaseForm.controls['incentives_gst'].updateValueAndValidity();
    this.purchaseForm.controls['reasonToPay'].updateValueAndValidity();
    this.purchaseForm.controls['incentives_payment_condition'].updateValueAndValidity();
    this.purchaseForm.controls['incentives_address_line_one'].updateValueAndValidity();
    this.purchaseForm.controls['incentives_pincode'].updateValueAndValidity();
    this.purchaseForm.controls['incentives_area_id'].updateValueAndValidity();
  }

  saveCommission() {
    if (this.purchaseForm.controls.incentives_person_name.invalid) {
      this.toastr.error('ERROR', 'Please Enter Goods Delivery.');
      return;
    }

    if (this.purchaseForm.controls.incentives_address_line_one.invalid || this.purchaseForm.controls.incentives_pincode.invalid || this.purchaseForm.controls.incentives_area_id.invalid) {
      this.toastr.error('ERROR', 'Please Enter address.');
      return;
    }

    if (this.purchaseForm.controls.incentives_payment_condition.invalid) {
      this.toastr.error('ERROR', 'Please Enter Payment Condition.');
      return;
    }

    if (this.purchaseForm.controls.incentives_gst.invalid) {
      this.toastr.error('ERROR', 'Please Enter Incentives GST.');
      return;
    }

    if (this.purchaseForm.controls.reasonToPay.invalid) {
      this.toastr.error('ERROR', 'Please Enter Reason to Pay.');
      return;
    }
    this.showCommissionModal = false;
  }

  resetForm() {
    this.invalidForm = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.serviceDetails = [];
    this.productItc = [];
    if (this.createMode) {
      this.addProdDetail('Product');
    } else {
      // this.showData();
    }
    this.purchaseForm.controls.closure_amount.disable();
  }

  closeForm() {
    this.productDetails = [];
    this.serviceDetails = [];
    this.quotations = [];
    this.productItc = [];
    this.locations = [];
    this.projects = [];
    this.createMode = false;
    this.editMode = false;
    this.hasChanged = false;
    this.showReviseModal = false;
    this.invalidForm = false;
    this.DiscountMangerObj = null;
    this.DiscountProjectObj = null;
    this.QuotationName = null;
    this.readonlyMode = false;
    this.pre_sale_demand_id = 0;
    this.purchaseForm.reset();
    this.changeApproved();
    this.addProdDetail('Product');
    this.purchaseForm.controls.closure_amount.disable();
    this.totalQuote.approved = 0;
    this.totalQuote.nonapproved = 0;
    this.totalQuote.archived = 0;
    $("#quotation_date").val();
  }

  viewCreateMode() {
    if (!this.createMode) {
      this.purchaseForm.reset();
      this.showAlert = true;
    }
  }
  
  viewEditMode() {
    if (this.editMode) {
      return;
    }
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    this.quotaionMode = '';
    this.purchaseForm.controls.quotation_type.setValue('Non-Approved');
    this.purchaseForm.controls.closure_amount.disable();
    this.getEditClients();
  }

  addLocation() {
    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      return;
    }
    if (this.purchaseForm.value.location_id && this.purchaseForm.value.location_id != 'null') {
      for(let i in this.locations) {
        if (this.locations[i].id == this.purchaseForm.value.location_id) {
          this.locationName = this.locations[i].name;
          this.showAddLocationModal = true;
        }
      }
    } else {
      this.locationName = '';
      this.showAddLocationModal = true;
    }
  }

  saveLocation() {
    if (!this.locationName) {
      this.toastr.error('ERROR', 'Please enter location.');
      return;
    }
    if (this.purchaseForm.value.location_id && this.purchaseForm.value.location_id != 'null') {
      this.loader.start();
      this.apiService.updateLocation({id:this.purchaseForm.value.location_id, name: this.locationName, parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.locations) {
            if (this.locations[i].id == this.purchaseForm.value.location_id) {
              this.locations[i].name = data['data'].name;
            }
          }
          this.showAddLocationModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      })
    } else {
      this.loader.start();
      this.apiService.saveLocation({name: this.locationName, parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.locations.push(data['data']);
          this.purchaseForm.controls.location_id.setValue(data['data'].id);
          this.showAddLocationModal = false;
          this.getQuotationNo()
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  addProject() {
    if (this.isNotValid(this.purchaseForm.value.client_id) || this.isNotValid(this.purchaseForm.value.location_id)) {
      return;
    }
    if (!this.isNotValid(this.purchaseForm.value.project_id)) {
      for(let i in this.projects) {
        if (this.projects[i].id == this.purchaseForm.value.project_id) {
          this.projectName = this.projects[i].name;
          this.showAddProjectModal = true;
        }
      }
    } else {
      this.projectName = '';
      this.showAddProjectModal = true;
    }
  }
  saveProject() {
    if (!this.projectName) {
      this.toastr.error('ERROR', 'Please enter project name.');
      return;
    }
    if (this.purchaseForm.value.project_id && this.purchaseForm.value.project_id != 'null') {
      this.loader.start();
      this.apiService.updateProject({id:this.purchaseForm.value.project_id, name: this.projectName, location_id:this.purchaseForm.value.location_id, client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.projects) {
            if (this.projects[i].id == this.purchaseForm.value.project_id) {
              this.projects[i].name = data['data'].name;
            }
          }
          this.showAddProjectModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      })
    } else {
      this.loader.start();
      this.apiService.saveProject({name: this.projectName, location_id:this.purchaseForm.value.location_id, client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.newProject = data['data'].id;
          this.purchaseForm.controls.transaction_type.setValue('New Lead');
          this.projects.push(data['data']);
          this.purchaseForm.controls.project_id.setValue(data['data'].id);
          this.showAddProjectModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  addAttention() {
    if (this.purchaseForm.value.attention_to_id && this.purchaseForm.value.attention_to_id != 'null') {
      for(let i in this.attentions) {
        if (this.attentions[i].id == this.purchaseForm.value.attention_to_id) {
          this.attentionName = this.attentions[i].name;
          this.showAddAttentionModal = true;
        }
      }
    } else {
      this.attentionName = '';
      this.showAddAttentionModal = true;
    }
  }

  saveAttention() {
    if (!this.attentionName) {
      this.toastr.error('ERROR', 'Please enter attention name.');
      return;
    }
    if (this.purchaseForm.value.attention_to_id && this.purchaseForm.value.attention_to_id != 'null') {
      this.loader.start();
      this.apiService.updateLookup({id:this.purchaseForm.value.attention_to_id, name: this.attentionName, lookup_type: 'Attention', parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.attentions) {
            if (this.attentions[i].id == this.purchaseForm.value.attention_to_id) {
              this.attentions[i].name = data['data'].name;
            }
          }
          this.showAddAttentionModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      })
    } else {
      this.loader.start();
      this.apiService.saveLookup({name: this.attentionName, lookup_type: 'Attention', parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.attentions.push(data['data']);
          this.purchaseForm.controls.attention_to_id.setValue(data['data'].id);
          this.showAddAttentionModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
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

  changeMainProductQty(prod: any) {
    this.productDetails.forEach((item) => {
      if (item.paired_id == prod.product_id && item.qty > 0) {
        this.checkValidQtyErr(item, true);
      }
    });
  }

  checkValidQtyErr(prod: any, main: boolean) {
    if (prod.is_paired) {
      let q = 0;
      let pName = '';
      this.productDetails.forEach((item) => {
        if (item.product_id == prod.paired_id) {
          q = item.qty;
          if (main) {
            let sProd = item['products'].filter((itm:any) => { return (itm.id == item.product_id) });
            if (sProd.length) {
              pName = sProd[0].model_no;
            }
          }
        }
      });
      let maxq = q * prod.paired_qty;
      if (prod.qty > maxq) {
        this.toastr.error('ERROR', 'Hey, '+maxq+' is the Max. quantity you can add. Model No.: ' + prod.product_name);
      }
      if (prod.qty < maxq) {
        if (main) {
          this.MessageText = 'Please change quantity of '+prod.product_name +' as you had changed the quantity of '+ pName +'. Do you want to Change it?'; 
          this.MessageTitle = 'Warning !'; 
          this.ActionType = 'ChangePairedQty'; 
          this.SaveBtn = 'Change'; 
          this.CancelBtn = 'OK';
        } else {
          this.MessageText = 'Hey, '+maxq+' is the max qnty to be added. You added ' + prod.qty +' qnty for ' + prod.product_name + '. it is OK?'; 
          this.MessageTitle = 'Warning !'; 
          this.ActionType = 'ChangePairedQty'; 
          this.SaveBtn = 'Change'; 
          this.CancelBtn = 'OK'; 
        }

        // this.toastr.warning('Warning', 'Hey, '+maxq+' is the max qnty to be added. You added ' + prod.qty +' qnty for ' + prod.product_name + '. it is OK?');
      }
    }
  }

  // checkValidQtyWarning(prod: any) {
  //   if (prod.is_paired) {
  //     let q = 0;
  //     this.productDetails.forEach((item) => {
  //       if (item.product_id == prod.paired_id) {
  //         q = item.qty;
  //       }
  //     });
  //     let maxq = q * prod.paired_qty;
  //     if (prod.qty < maxq) {
  //       this.toastr.warning('Warning', 'Hey, '+maxq+' is the max quantity.  you added ' + prod.qty +' quantity for Model No.: ' + prod.product_name);
  //     }
  //   }
  // }

  showPairedModal(prod: any, i: any) {
    if (prod.is_paired) {
      let row = this.productDetails.filter((itm) => { return (itm.product_id == prod.paired_id) });
      if (row.length && !this.isNotValid(row[0].qty)) {
        let sProd = row[0]['products'].filter((itm:any) => { return (itm.id == row[0].product_id) });
        if (sProd.length) {
          this.MaxQty = row[0].qty * prod.paired_qty;
          this.MainProductName = sProd[0].model_no;
        }
        this.ProductName = prod.product_name;
        this.MainQty = row[0].qty;
        this.PairedQty = prod.qty;
        this.pIndex = i;
        this.showPairedProductQtyModal = true;
        this.setItcTable();
      }
    }
  }

  changeQty() {
    this.pairedQtyAlertModal = (this.PairedQty != this.MaxQty);
    if (!this.pairedQtyAlertModal) {
      this.showPairedProductQtyModal = false;
      this.applyQnty();
    }
  }

  applyQnty() {
    this.productDetails[this.pIndex].qty = this.PairedQty;
    this.setItcTable();
  }

  getDepartment() {
    this.apiService.getDepartment({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.departments = data['data'];
      }
    });
  }

  getDesignation() {
    this.apiService.getDesignation({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.designations = data['data'];
      }
    });
  }

  saveContact(isCont: any) {
    this.invalidContactForm = false;
    if (this.contactForm.invalid) {
      this.invalidContactForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.contactForm.value.id && this.contactForm.value.id > 0) {
      this.loader.start();
      this.apiService.updateAccountPerson(this.contactForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account person details updated successfully.');
          this.contactForm.reset();
          this.contactForm.controls.account_id.setValue(this.purchaseForm.value.client_id);
          if (!isCont) {
            this.showContactForm = false;  
          }
          this.getAttentions();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveAccountPerson(this.contactForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account person details saved successfully.');
          this.contactForm.reset();
          this.contactForm.controls.account_id.setValue(this.purchaseForm.value.client_id);
          if (!isCont) {
            this.showContactForm = false;  
          }
          this.attentions.push(data['data']);
          this.purchaseForm.controls.attention_to_id.setValue(data['data']['id']);
          this.changeAtt();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  closeContactFormModal() {
    $('#contactBirthDate').datepicker('destroy');
    $('#contactAnniversaryDate').datepicker('destroy');
    this.contactForm.reset();
    this.showContactForm = false;  
  }

  showContactFormModal() {
    if (!this.isNotValid(this.purchaseForm.value.client_id)) {
      this.contactForm.reset();
      this.contactForm.controls.account_id.setValue(this.purchaseForm.value.client_id);
      this.showContactForm = true;  
      this.loadDatePicker();
    }
  }

  loadDatePicker() {
    setTimeout(() => {
      $( "#contactBirthDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.contactForm.controls.birth_date.setValue(date);
      });

      $( "#contactAnniversaryDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.contactForm.controls.anniversary_date.setValue(date);
      });

      $('#contactBirthDate').mask('00/00/0000');
      $('#contactAnniversaryDate').mask('00/00/0000');
    }, 1000);
  }

  saveInfo() {
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
      for (let i in this.productDetails) {
        let item = this.productDetails[i];
        item.error = false;
        if (this.isNotValid(item.group_id)) {
          this.toastr.error('ERROR', 'Please select product group in last row.');
          this.invalidForm = true;
          item.error = true;
          break;
          return;
        }
        if (this.isNotValid(item.product_id)) {
          this.toastr.error('ERROR', 'Please select product in last row.');
          this.invalidForm = true;
          item.error = true;
          break;
          return;
        }
        if (this.isNotValid(item.qty)) {
          let pName = item.product_name;
          if (item.products && item.products.length) {
            let sProd = item.products.filter((itm:any) => { return (itm.id == item.product_id) });
            if (sProd.length) {
              pName = sProd[0].model_no;
            }
          }
          this.toastr.error('Quantity Alert!', 'Please enter quantity of the item ' + pName + '.');
          this.invalidForm = true;
          item.error = true;
          break;
          return;
        }
        if (this.isNotValid(item.rate) && !item.is_paired) {
          let pName = item.product_name;
          if (item.products && item.products.length) {
            let sProd = item.products.filter((itm:any) => { return (itm.id == item.product_id) });
            if (sProd.length) {
              pName = sProd[0].model_no;
            }
          }
          this.toastr.error('ERROR', 'Please enter rate of the item ' + pName + '.');
          this.invalidForm = true;
          item.error = true;
          break;
          return;
        }

        if (item.is_paired && this.checkValidQty(item)) {
          this.checkValidQtyErr(item, false);
          this.invalidForm = true;
          item.error = true;
          break;
          return;
        }
      };

      if (this.showManagerDiscount) {
        if (this.isNotValid(this.purchaseForm.value.reason_for_discount)) {
          this.toastr.error('ERROR', 'Please Enter Specify Reason for Discount');
          this.invalidForm = true;
          return;
        }
        if (!this.purchaseForm.value.is_discount_category) {
          return;
        }
      }

      if (this.invalidForm) {
        return;
      }

      this.serviceDetails.forEach((item) => {
        if (this.isNotValid(item.group_id)) {
          this.toastr.error('ERROR', 'Please select service group');
          this.invalidForm = true;
          return
        }
        if (this.isNotValid(item.product_id)) {
          this.toastr.error('ERROR', 'Please select service');
          this.invalidForm = true;
          return
        }
        // Quantity Alert !
        // Please check quantity of item DF816BA-HT is Zero, do you want to proceed?

        if (this.isNotValid(item.qty)) {
          this.toastr.error('ERROR', 'Please enter quantity');
          this.invalidForm = true;
          return
        }
      });

      if (this.quotaionMode == 'R' && !this.hasChanged) {
        this.quotations.forEach((rd) => {
          if (rd.id == this.purchaseForm.value.quotation_id) {
            this.QuotationName = rd.quotation_no;
          }
        });
        this.showReviseModal = true;
        // this.toastr.error('ERROR', 'Nothing changed');
        // this.closeForm();
        return;
      }

      let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
      params.product_details = JSON.parse(JSON.stringify(this.productDetails));
      params.services = JSON.parse(JSON.stringify(this.serviceDetails));
      params.product_itc = JSON.parse(JSON.stringify(this.productItc));
      if (params.id && params.id > 0) {
        this.loader.start();
        this.apiService.updateQuotation(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Quotation update successfully.');
            this.newProject = 0;
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
        this.apiService.saveQuotation(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Quotation saved successfully.');
            this.newProject = 0;
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

  viewTerms() {
    this.showTermsModel = true;
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      if (this.purchaseForm.value.status == 'Approved') {
        this.toastr.error('ERROR', 'You can not delete Approved Quotation.');
      } else {
        this.MessageText = 'Are you sure to delete this Quotation?'; 
        this.MessageTitle = 'Delete Quotation'; 
        this.ActionType = 'DeleteQuotation'; 
        this.SaveBtn = 'Delete'; 
        this.CancelBtn = 'No'; 
        // this.showDeleteModal = true;
      }
    } else {
      this.toastr.error('ERROR', 'Please Select Quotation.');
    }
  }

  confirmedAction(event:any) {
    this.MessageText = '';
    this.MessageTitle = '';
    if (event.status) {
      if (event.type == 'DeleteQuotation') {
       this.deleteData();
      }
      if (event.type == 'ChangePairedQty') {
       // this.deleteData();
      }
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Quotation.');
    } else {
      this.loader.start();
      this.apiService.deleteQuotation({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Quotation deleted successfully.'); 
        } else {
          this.toastr.success('ERROR', data['data']); 
        }
      });
    }
  }

  setType(type: string) {
    this.loader.start();
    setTimeout(() => {
      this.purchaseForm.reset();
      this.quotaionMode = type;
      this.createMode = true;
      this.editMode = false;
      this.showAlert = false;
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.purchaseForm.controls.quotation_date.setValue(date);
      this.purchaseForm.controls.quotation_mode.setValue(type);
      this.purchaseForm.controls.quotation_type.setValue('Non-Approved');
      $("#quotation_date").datepicker('setDate', new Date())
      if (type == 'N') {
        this.purchaseForm.controls.sales_executive_id.setValue(this.loginId);
        this.getClients();
      } else {
        this.getEditClients();
      }
      this.setEnableDisable();
      this.loader.stop();
    }, 200);
  }

  getExecutiveName() {
    if (this.purchaseForm.value.sales_executive_id) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.sales_executive_id) });
      if (row.length) {
        return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
      }
      return ""
    } else {
      return ""
    }
  }

  viewAddItemModal() {
    this.showAddItemModal = true;
  }

  addRow(type: string) {
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
      if (this.isNotValid(item.qty) && !item.is_paired) {
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
        item.error = true;
        errors = true;
      }
    });

    if (errors) {
      return;
    }
    this.addProdDetail(type);
    this.showAddItemModal = false;
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
      description: null,
      qty: null,
      paired_qty: null,
      rate: null,
      discount_percentage: null,
      discount_amount: null,
      sub_total: 0,
      gst_percentage: 0,
      gst_amount: 0,
      total_amount: 0,
      remark: null,
      show: false,
      service_description: 'Installation',
      is_itc: null,
      itc_gst_rate: null,
      itc_hsncode: null,
      itc_rate: null,
      products: []
    });
  }

  addServiceDetail(type: string) {
    this.serviceDetails.push({
      id: null,
      type: type,
      group_id: null,
      product_id: null,
      group_name: null,
      product_name: null,
      is_paired: null,
      paired_id: null,
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
      service_description: 'Installation',
      is_itc: null,
      itc_gst_rate: null,
      itc_hsncode: null,
      itc_rate: null,
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
  
  viewRemarkModal(prod: any, i: any) {
    this.productRemark = prod.remark;
    this.selectedProductIndex = i;
    this.showRemarkModal = true;
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    let item = this.productDetails[this.selectedProductIndex];
    let sk = -1;
    this.productItc.forEach((row, key) => {
      if (row.group_id == item.group_id && row.product_id == item.product_id && item.is_paired == row.is_paired) {
        row.qty = item.qty;
        sk = key;
      }
    });
    if (sk != -1 && this.productItc[sk]) {
      this.productItc.splice(sk, 1);
    }
    this.productDetails.splice(this.selectedProductIndex, 1);
    this.setItcTable();
    this.formValueChange();
  }

  saveRemark() {
    this.productDetails[this.selectedProductIndex].remark = this.productRemark;
    this.showRemarkModal = false;
    this.formValueChange();
  }

  getDistance() {
    if (!this.isNotValid(this.purchaseForm.value.location_id) && !this.isNotValid(this.purchaseForm.value.project_id)) {
      this.apiService.getQuotation({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id, project_id: this.purchaseForm.value.project_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (data['data'].length) {
            this.purchaseForm.controls.away_from_me.setValue(data['data'][0]['away_from_me'])
          }
        }
      });
      if (this.newProject == 0 || this.newProject != this.purchaseForm.value.project_id) {
        this.purchaseForm.controls.transaction_type.setValue('Repeat Business');
      } else {
        this.purchaseForm.controls.transaction_type.setValue('New Lead');
      }
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
    if (!this.isNotValid(product_id)) {
      for(var r in prod.products) {
        if (prod.products[r].id == product_id) {
          if (prod.type == 'Product') {
            prod.description = prod.products[r].description +'&#13;&#10;Prod. Code: '+ prod.products[r].product_code +'&#13;&#10;Warranty: '+ prod.products[r].supplier_warranty +' Months&#13;&#10;HSN Code: '+ prod.products[r].hsn_code;
            prod.rate = prod.products[r].max_retail_price;
            prod.gst_percentage = prod.products[r].gst_rate;
            prod.is_itc = prod.products[r].is_itc;
            prod.itc_gst_rate = prod.products[r].itc_gst_rate;
            prod.itc_hsncode = prod.products[r].itc_hsncode;
            prod.itc_rate = prod.products[r].itc_rate;
            this.calculate()
          } else {
            prod.description = prod.products[r].description;
            prod.rate = 0;
            prod.gst_percentage = prod.products[r].gst_rate;
          }
        }
      }
      if (!isEdited) {
        this.setItcTable();
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
      }
    } else {
      prod.description = null;
      prod.qty = null;
      prod.qty = null;
      prod.rate = null;
      prod.discount_percentage = null;
      prod.discount_amount = null;
      prod.sub_total = null;
      prod.gst_percentage = null;
      prod.gst_amount = null;
      prod.total_amount = null;
      prod.remark = null;
    }
  }

  getProductPaired(product_id: any, isEdited: any) {
    this.loader.start();
    this.apiService.showProduct({id: product_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (data['paired'] && data['paired'].length) {
          data['paired'].forEach((item: any) => {
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            let found = false;
            this.productDetails.filter((prditem) => {
               if (prditem.product_id == item.model_id && prditem.paired_id == product_id) {
                prditem.group_name = item.group.name;
                prditem.product_name = item.prmodel.model_no;
                prditem.description = desc;
                prditem.is_itc = item.prmodel.is_itc;
                prditem.gst_percentage = 0;
                // prditem.gst_percentage = item.prmodel.gst_rate;
                prditem.itc_gst_rate = item.prmodel.itc_gst_rate;
                prditem.itc_hsncode = item.prmodel.itc_hsncode;
                prditem.itc_rate = item.prmodel.itc_rate;
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
                description: desc,
                qty: 0,
                paired_qty: item.qty,
                rate: 0,
                discount_percentage: 0,
                discount_amount: 0,
                sub_total: 0,
                gst_percentage: 0,
                gst_amount: 0,
                total_amount: 0,
                remark: null,
                show: false,
                service_description: 'Installation',
                is_itc: item.prmodel.is_itc,
                itc_gst_rate: item.prmodel.itc_gst_rate,
                itc_hsncode: item.prmodel.itc_hsncode,
                itc_rate: item.prmodel.itc_rate,
                products: []
              });
            }
          });
          if (isEdited) {
            this.setItcTable();
          }
        }
        if (!isEdited) {
          this.stock = data['stock'];
          this.stockProductRemark = data['data']['remarks'];
          this.attentionModal = true;
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
      if (!item.is_paired) {
        item.discount_amount = 0;
        item.gst_amount = 0;
        item.sub_total = 0;
        if (item.qty && item.rate) {
          let itemRate = item.rate;
          let itemQty = Number(item.qty);
          item.sub_total = (itemQty * itemRate);
          qty_rate_total += (itemQty * itemRate);
        }
        if (item.discount_percentage) {
          item.discount_amount = (item.sub_total * item.discount_percentage) / 100;
          discount_total += item.discount_amount;
        }
        item.sub_total = (item.sub_total - item.discount_amount);
        sub_total += item.sub_total;
        if (item.gst_percentage) {
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
    let itc_total_amount = (this.purchaseForm.value.itc_total_amount) ? parseFloat(this.purchaseForm.value.itc_total_amount): 0;
    let p_total_amount = (this.purchaseForm.value.total_amount) ? parseFloat(this.purchaseForm.value.total_amount): 0;
    let service_total_amount = (this.purchaseForm.value.service_total_amount) ? parseFloat(this.purchaseForm.value.service_total_amount): 0;
    let final_amount = itc_total_amount + p_total_amount + service_total_amount;
    this.purchaseForm.controls.native_amount.setValue(final_amount);

    // this.purchaseForm.controls.native_amount.setValue(total_amount);
    this.setItcTable();
  }

  calculateService() {
    let qty_rate_total = 0;
    let discount_total = 0;
    let sub_total = 0;
    let gst_total = 0;
    let total_amount = 0;
    let item_amount = 0;
    this.serviceDetails.forEach((item, key) => {
        item.discount_amount = 0;
        item.gst_amount = 0;
        item.sub_total = 0;
        if (item.qty && item.rate) {
          let itemRate = item.rate;
          let itemQty = Number(item.qty);
          item.sub_total = (itemQty * itemRate);
          qty_rate_total += (itemQty * itemRate);
        }
        if (item.discount_percentage) {
          item.discount_amount = (item.sub_total * item.discount_percentage) / 100;
          discount_total += item.discount_amount;
        }
        item.sub_total = (item.sub_total - item.discount_amount);
        sub_total += item.sub_total;
        if (item.gst_percentage) {
          item.gst_amount = (item.sub_total * item.gst_percentage) / 100;
          gst_total += item.gst_amount;
        }
        item.total_amount = (item.sub_total + item.gst_amount);
        total_amount += item.total_amount;
    });

    this.purchaseForm.controls.service_qty_rate_total.setValue(qty_rate_total);
    this.purchaseForm.controls.service_discount_total.setValue(discount_total);
    this.purchaseForm.controls.service_sub_total.setValue(sub_total);
    this.purchaseForm.controls.service_gst_total.setValue(gst_total);
    this.purchaseForm.controls.service_total_amount.setValue(total_amount);
    let itc_total_amount = (this.purchaseForm.value.itc_total_amount) ? parseFloat(this.purchaseForm.value.itc_total_amount): 0;
    let p_total_amount = (this.purchaseForm.value.total_amount) ? parseFloat(this.purchaseForm.value.total_amount): 0;
    let service_total_amount = (this.purchaseForm.value.service_total_amount) ? parseFloat(this.purchaseForm.value.service_total_amount): 0;
    let final_amount = itc_total_amount + p_total_amount + service_total_amount;
    this.purchaseForm.controls.native_amount.setValue(final_amount);
  }

  calculateItc() {
    let qty_rate_total = 0;
    let discount_total = 0;
    let sub_total = 0;
    let gst_total = 0;
    let total_amount = 0;
    let item_amount = 0;
    this.productItc.forEach((item, key) => {
      // if (!item.is_paired) {
        item.discount_amount = 0;
        item.gst_amount = 0;
        item.sub_total = 0;
        if (item.qty && item.itc_rate && item.service_description == 'Installation') {
          let itemRate = item.itc_rate;
          let itemQty = Number(item.qty);
          item.sub_total = (itemQty * itemRate);
          qty_rate_total += (itemQty * itemRate);
        }
        sub_total += item.sub_total;
        if (item.itc_gst_rate && item.service_description == 'Installation') {
          item.gst_amount = (item.sub_total * item.itc_gst_rate) / 100;
          gst_total += item.gst_amount;
        }
        item.total_amount = (item.sub_total + item.gst_amount);
        total_amount += item.total_amount;
      // }
    });

    this.purchaseForm.controls.itc_qty_rate_total.setValue(qty_rate_total);
    this.purchaseForm.controls.itc_sub_total.setValue(sub_total);
    this.purchaseForm.controls.itc_gst_total.setValue(gst_total);
    this.purchaseForm.controls.itc_total_amount.setValue(total_amount);

    let itc_total_amount = (this.purchaseForm.value.itc_total_amount) ? parseFloat(this.purchaseForm.value.itc_total_amount): 0;
    let p_total_amount = (this.purchaseForm.value.total_amount) ? parseFloat(this.purchaseForm.value.total_amount): 0;
    let service_total_amount = (this.purchaseForm.value.service_total_amount) ? parseFloat(this.purchaseForm.value.service_total_amount): 0;
    let final_amount = itc_total_amount + p_total_amount + service_total_amount;
    this.purchaseForm.controls.native_amount.setValue(final_amount);
  }

  setItcTable() {
    // this.productItc = [];
    this.productDetails.forEach((item) => {
      if (item.is_itc && item.itc_rate) {
        let existRow = false;
        this.productItc.forEach((row) => {
          if (row.group_id == item.group_id && row.product_id == item.product_id && item.is_paired == row.is_paired) {
            row.qty = item.qty;
            existRow = true;
          }
        });
        if (!existRow) {
          this.productItc.push(JSON.parse(JSON.stringify(item)));
        }
      }
    });
    this.productItc.forEach((row, i) => {
      let deletedRow = false;
      this.productDetails.forEach((item) => {
        if (row.group_id == item.group_id && row.product_id == item.product_id && item.is_paired == row.is_paired) {
          deletedRow = true;
        }
      });
      if (!deletedRow) {
        this.productItc.splice(i, 1);
      }
    });
    this.calculateItc();
  }

  discountCalibration() {
    let salesDiscount = 10;
    if (this.purchaseForm.value.native_amount) {
      let native_amount = parseFloat(this.purchaseForm.value.native_amount);
      let re_worked_amount = (native_amount * salesDiscount) / 100;
      re_worked_amount = native_amount - re_worked_amount;
      this.purchaseForm.controls.re_worked_amount.setValue(re_worked_amount);
      this.purchaseForm.controls.closure_amount.enable();
      this.purchaseForm.controls.main_discount.setValue(salesDiscount);
    }
  }

  checkDiscount() {
    this.showApplyBtn = false;
    this.viewManagerDiscount = false;
    this.showManagerDiscountModal = false;
    let re_worked_amount = parseFloat(this.purchaseForm.value.re_worked_amount);
    if (parseFloat(this.purchaseForm.value.closure_amount) >= re_worked_amount) {
      this.showApplyBtn = true;
      this.purchaseForm.controls.discount_request_amount.setValue(null);
      this.purchaseForm.controls.discount_request_category.setValue(null);
    } else {
      let discount_request_amount = re_worked_amount - parseFloat(this.purchaseForm.value.closure_amount);
      this.purchaseForm.controls.discount_request_amount.setValue(discount_request_amount);
      this.purchaseForm.controls.discount_request_category.setValue('Manager');
      this.showManagerDiscountModal = true;
    }
  }

  clearManagerDiscount(status: any) {
    if (status) {
      this.showManagerDiscount = true;
    } else {
      this.purchaseForm.controls.discount_request_amount.setValue(0);
      this.purchaseForm.controls.discount_request_category.setValue(null);
    }
    this.showManagerDiscountModal = false;
  }

  setDiscountCategory() {
    if (!this.purchaseForm.value.is_discount_category) {
      this.showCancelDiscountModal = true;
    }
  }

  noCancelDisount() {
    this.purchaseForm.controls.is_discount_category.setValue(true);
    this.showCancelDiscountModal = false;
  }

  applyDiscount() {
    this.purchaseForm.controls.is_applied_discount.setValue(true);
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
