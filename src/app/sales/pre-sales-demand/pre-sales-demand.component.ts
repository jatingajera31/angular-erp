import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-pre-sales-demand',
  templateUrl: './pre-sales-demand.component.html',
  styleUrls: ['./pre-sales-demand.component.css']
})
export class PreSalesDemandComponent implements OnInit {

  purchaseForm: FormGroup;
  contactForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  showAlert = false;
  isLoadedAddress = false;
  payemntCondtionModal = false;
  showAddAttentionModal = false;
  invalidContactForm = false;
  showContactForm = false;
  suppliers : any[] = [];
  dropdowns : any[] = [];
  departments : any[] = [];
  designations : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  quotations : any[] = [];
  demands : any[] = [];
  productDetails : any[] = [];
  serviceDetails : any[] = [];
  productItc : any[] = [];
  attentions : any[] = [];
  quotaionMode: string = '';
  stringAddress: string = '';
  shipAddress: string = '';
  billAddress: string = '';
  gst_no: string = '';
  pan_no: string = '';
  fieldName: string = '';
  quots: any;
  attentionName: any;
  loginUser: any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      sales_executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      pre_sale_demand_no: new FormControl(null, Validators.required),
      pre_sale_date: new FormControl(null, Validators.required),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      address_line_one: new FormControl(null),
      address_line_two: new FormControl(null),
      pincode: new FormControl(null),
      area_id: new FormControl(null),
      quotation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      quotation_date: new FormControl(null),
      po_no: new FormControl(null),
      po_date: new FormControl(null),
      po_received_date: new FormControl(null, Validators.required),
      delivery_day: new FormControl(null, Validators.required),
      delivery_date: new FormControl(null, Validators.required),
      ship_address_line_one: new FormControl(null),
      ship_address_line_two: new FormControl(null),
      ship_pincode: new FormControl(null),
      ship_area_id: new FormControl(null),
      bill_address_line_one: new FormControl(null),
      bill_address_line_two: new FormControl(null),
      bill_pincode: new FormControl(null),
      bill_area_id: new FormControl(null),
      project_id: new FormControl(null),
      location_id: new FormControl(null, Validators.required),
      away_from_me: new FormControl(null, Validators.required),
      remarks: new FormControl(null),
      project_completion_date: new FormControl(null, Validators.required),
      credit_limit: new FormControl(null),
      credit_balance: new FormControl(null),
      payment_id: new FormControl(null, Validators.required),
      payment_code: new FormControl(null, Validators.required),
      payment_number: new FormControl(null, Validators.required),
      payment_email: new FormControl(null, Validators.required),
      manager_id: new FormControl(null),
      manager_code: new FormControl(null),
      manager_number: new FormControl(null),
      manager_email: new FormControl(null),
      electrician_id: new FormControl(null),
      electrician_code: new FormControl(null),
      electrician_number: new FormControl(null),
      electrician_email: new FormControl(null),
      store_keeper_id: new FormControl(null),
      store_keeper_code: new FormControl(null),
      store_keeper_number: new FormControl(null),
      store_keeper_email: new FormControl(null),
      architect_id: new FormControl(null),
      architect_code: new FormControl(null),
      architect_number: new FormControl(null),
      architect_email: new FormControl(null),
      total_amount: new FormControl(null),
      payment_condition: new FormControl(null),
      special_percent: new FormControl(null),
      special_day: new FormControl(null),
      special_condition: new FormControl(null),
      special_payment: new FormControl(null),
      advance_amount: new FormControl(null),
      advance_mode: new FormControl('CASH'),
      advance_cheque_no: new FormControl({value: null, disabled: true}),
      bank_name: new FormControl({value: null, disabled: true}),
      advance_date: new FormControl(null),
      balance_percent: new FormControl(null),
      balance_day: new FormControl(null),
      balance_payment: new FormControl(null),
      final_percent: new FormControl(null),
      final_day: new FormControl(null),
      final_payment: new FormControl(null),
      extended_comments: new FormControl(null),
      approved_remarks: new FormControl(null),
      approved_by: new FormControl(null),
      status: new FormControl(null),
      t_po_date: new FormControl(null),
      t_po_received_date: new FormControl(null),
      t_project_completion_date: new FormControl(null),
      t_advance_date: new FormControl(null),
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

    this.getAllAddress();
    this.getStaff();
    this.getDesignation();
    this.getDepartment();
  }

  ngOnInit(): void {
    this.apiService.me().subscribe(data => {
      if (data) {
        this.loginUser = data;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#pre_sale_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.pre_sale_date.setValue(date);
      });
      $( "#po_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.po_date.setValue(date);
      });
      $( "#po_received_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.po_received_date.setValue(date);
        this.setDeliveryDate();
      });
      $('#pre_sale_date').mask('00/00/0000');
      $('#po_date').mask('00/00/0000');
      $('#po_received_date').mask('00/00/0000');
      $('#project_completion_date').mask('00/00/0000');
    },1000)
  }

  initPcDate() {
    let n = new Date(this.purchaseForm.value.delivery_date);
    $( "#project_completion_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy', startDate: n }).on('changeDate', (e:any) => {
      const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
      this.purchaseForm.controls.project_completion_date.setValue(date);
      this.purchaseForm.controls.t_project_completion_date.setValue(date);
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

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.serviceDetails = [];
    this.productItc = [];
    this.quots = null;
  }

  resetForm() {
    this.productDetails = [];
    this.serviceDetails = [];
    this.productItc = [];
    this.quots = null;
    let quotation_id = this.purchaseForm.value.quotation_id;
    let client_id = this.purchaseForm.value.client_id;
    let sales_executive_id = this.purchaseForm.value.sales_executive_id;
    this.purchaseForm.reset();
    this.stringAddress = '';
    this.shipAddress = '';
    this.billAddress = '';
  }

  viewCreateMode() {
    this.stringAddress = '';
    this.shipAddress = '';
    this.billAddress = '';
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.sales_executive_id.setValue(this.loginUser.id);
    this.purchaseForm.controls.pre_sale_date.setValue(date);
    this.purchaseForm.controls.advance_mode.setValue('CASH');
    $("#pre_sale_date").datepicker('setDate', new Date())
    this.getClients();
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.purchaseForm.reset();
    this.purchaseForm.controls.sales_executive_id.setValue(this.loginUser.id);
    this.purchaseForm.controls.advance_mode.setValue('CASH');
    this.getEditClients();
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

  getLocation() {
    this.apiService.getLocation({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getProject() {
    this.apiService.getProject({location_id: this.purchaseForm.value.location_id, client_id: this.purchaseForm.value.client_id}).subscribe(data => {
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
    if (!this.editMode) {
      this.apiService.getClients({sales_demand: 1, sales_executive_id: this.purchaseForm.value.sales_executive_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.clients = data['data'];
        }
      });
    } else {
      this.getEditClients();
    }
  }

  getEditClients() {
    this.apiService.editClients({page: 'psd', sales_executive_id: this.purchaseForm.value.sales_executive_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getQuotations() {
    this.apiService.getQuotation({client_id: this.purchaseForm.value.client_id, status: 'Approved'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.quotations = data['data'];
      }
    });
  }

  changeQuotation() {
    if (this.isNotValid(this.purchaseForm.value.quotation_id)) {
      this.purchaseForm.controls.quotation_date.setValue(null);
      this.purchaseForm.controls.delivery_day.setValue(null);
      this.purchaseForm.controls.away_from_me.setValue(null);
      this.purchaseForm.controls.credit_limit.setValue(null);
      this.purchaseForm.controls.credit_balance.setValue(null);
      this.purchaseForm.controls.location_id.setValue(null);
      this.purchaseForm.controls.project_id.setValue(null);
    }
    this.quotations.forEach((item) => {
      if (item.id == this.purchaseForm.value.quotation_id) {
        this.projects = [item.project];
        this.purchaseForm.controls.quotation_date.setValue(item.quotation_date);
        this.purchaseForm.controls.delivery_day.setValue(Number(item.goods_delivery * 7));
        this.purchaseForm.controls.away_from_me.setValue(item.away_from_me);
        this.purchaseForm.controls.credit_limit.setValue(0);
        this.purchaseForm.controls.credit_balance.setValue(0);
        this.purchaseForm.controls.location_id.setValue(item.location_id);
        setTimeout(() => {
          this.purchaseForm.controls.project_id.setValue(item.project_id);
        }, 200)
        // this.getProject();
      }
    });
  }

  setDeliveryDate() {
    $('#project_completion_date').datepicker('destroy');
    $('#project_completion_date').val('');
    this.purchaseForm.controls.project_completion_date.setValue(null);
    this.purchaseForm.controls.t_project_completion_date.setValue(null);
    if (this.purchaseForm.value.po_received_date && this.purchaseForm.value.delivery_day) {
      var date = new Date();
      var po_received_date = new Date(this.purchaseForm.value.po_received_date);
      date.setDate(po_received_date.getDate() + this.purchaseForm.value.delivery_day);
      const ddate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.purchaseForm.controls.delivery_date.setValue(ddate);
      this.initPcDate();
    } else {
      this.purchaseForm.controls.delivery_date.setValue(null);
    }
  }

  showQuotation() {
    if (this.isNotValid(this.purchaseForm.value.quotation_id)) {
      this.productDetails = [];
      this.serviceDetails = [];
      return;
    }
    this.loader.start();
    this.apiService.showQuotation({id: this.purchaseForm.value.quotation_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.quots = data['data'];
        this.productDetails = data['data']['details'];
        this.serviceDetails = data['data']['sdetails'];
        this.productItc = data['data']['itc'];
        this.productDetails.forEach((item: any) => {
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
            item.description = desc;
        });
        this.serviceDetails.forEach((item: any) => {
            item.description = item.prmodel.description;
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
    if (!this.isNotValid(this.purchaseForm.value.id)) {
      this.demands.forEach((item) => {
        if (item.id == this.purchaseForm.value.id) {
          this.projects = [item.project];
        }
      });
      this.loader.start();
      this.apiService.showPreSalesDemand({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.patchValue(data['data']);
          if (data['data']['pre_sale_date']) {
            $("#pre_sale_date").datepicker('setDate', new Date(data['data']['pre_sale_date']))
          }
          if (data['data']['po_date']) {
            $("#po_date").datepicker('setDate', new Date(data['data']['po_date']))
          }
          if (data['data']['po_received_date']) {
            $("#po_received_date").datepicker('update', new Date(data['data']['po_received_date']))
          }
          setTimeout(() => {
            this.initPcDate();
          }, 200)
          if (data['data']['project_completion_date']) {
            setTimeout(() => {
              $("#project_completion_date").datepicker('setDate', new Date(data['data']['project_completion_date']))
            }, 500)
          }
          this.showQuotation();
          this.changeBankMode();

          this.quotations.forEach((item) => {
            if (item.id == this.purchaseForm.value.quotation_id) {
              this.purchaseForm.controls.quotation_date.setValue(item.quotation_date);
            }
            let newAddress : any[] = [];
            if (data['data'].address_line_one) {
              newAddress.push(data['data'].address_line_one);
            }
            if (data['data'].address_line_two) {
              newAddress.push(data['data'].address_line_two);
            }
            if (data['data'].city_name) {
              let ct = data['data'].city_name;
              if (data['data'].pincode) {
                ct += '-' + data['data'].pincode;
              }
              newAddress.push(ct);
            }
            if (data['data'].state_name) {
              newAddress.push(data['data'].state_name);
            }
            if (data['data'].country_name) {
              newAddress.push(data['data'].country_name);
            }
            this.stringAddress = newAddress.join(', ');

            let shipAddress : any[] = [];
            if (data['data'].ship_address_line_one) {
              shipAddress.push(data['data'].ship_address_line_one);
            }
            if (data['data'].ship_address_line_two) {
              shipAddress.push(data['data'].ship_address_line_two);
            }
            if (data['data'].ship_city_name) {
              let ct = data['data'].ship_city_name;
              if (data['data'].ship_pincode) {
                ct += '-' + data['data'].ship_pincode;
              }
              shipAddress.push(ct);
            }
            if (data['data'].ship_state_name) {
              shipAddress.push(data['data'].ship_state_name);
            }
            if (data['data'].ship_country_name) {
              shipAddress.push(data['data'].ship_country_name);
            }
            this.shipAddress = shipAddress.join(', ');

            let billAddress : any[] = [];
            if (data['data'].bill_address_line_one) {
              billAddress.push(data['data'].bill_address_line_one);
            }
            if (data['data'].bill_address_line_two) {
              billAddress.push(data['data'].bill_address_line_two);
            }
            if (data['data'].bill_city_name) {
              let ct = data['data'].bill_city_name;
              if (data['data'].bill_pincode) {
                ct += '-' + data['data'].bill_pincode;
              }
              billAddress.push(ct);
            }
            if (data['data'].bill_state_name) {
              billAddress.push(data['data'].bill_state_name);
            }
            if (data['data'].bill_country_name) {
              billAddress.push(data['data'].bill_country_name);
            }
            this.billAddress = billAddress.join(', ');
            this.isLoadedAddress = true;
          });
        }
        this.loader.stop();
      });
    }
  }

  changePerson(payment_id: string, payment_code: string, payment_number: string, payment_email: string) {
    this.attentions.forEach((item) => {
      if (item.id == this.purchaseForm.value[payment_id]) {
        this.purchaseForm.controls[payment_code].setValue(item.mobile_code)
        this.purchaseForm.controls[payment_number].setValue(item.mobile_number)
        this.purchaseForm.controls[payment_email].setValue(item.email)
      }
    })    
  }

  formErrors(field: any) {
    return this.invalidForm && (this.isNotValid(this.purchaseForm.value[field]) || this.purchaseForm.controls[field].invalid);
  }

  saveInfo() {
    for(var d in this.purchaseForm.controls) {
      console.log(d, this.purchaseForm.controls[d].invalid)
    }
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updatePreSalesDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Pre Sales Demand save successfully.');
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
      this.apiService.savePreSalesDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Pre Sales Demand save successfully.');
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
    // This Pre Sales Demand Used In Delivery Challan.You Can not Delete It.
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Pre Sales Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Pre Sales Demand.');
    } else {
      this.loader.start();
      this.apiService.deletePreSalesDemand({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Pre Sales Demand deleted successfully.'); 
        }
      });
    }
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
          // this.getAttentions();
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
          this.purchaseForm.controls[this.fieldName].setValue(data['data']['id']);
          if (this.fieldName == 'payment_id') {
            this.changePerson('payment_id', 'payment_code', 'payment_number', 'payment_email')  
          }
          if (this.fieldName == 'manager_id') {
            this.changePerson('manager_id', 'manager_code', 'manager_number', 'manager_email')  
          }
          if (this.fieldName == 'electrician_id') {
            this.changePerson('electrician_id', 'electrician_code', 'electrician_number', 'electrician_email')  
          }
          if (this.fieldName == 'store_keeper_id') {
            this.changePerson('store_keeper_id', 'store_keeper_code', 'store_keeper_number', 'store_keeper_email')  
          }
          if (this.fieldName == 'architect_id') {
            this.changePerson('architect_id', 'architect_code', 'architect_number', 'architect_email')  
          }
          // this.changeAtt();
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

  addAttention(field: string) {
    if (!this.isNotValid(this.purchaseForm.value.client_id)) {
      this.fieldName = field;
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

  // addAttention(field: string) {
  //   if (this.isNotValid(this.purchaseForm.value.client_id)) {
  //     this.toastr.error('ERROR', 'Please select client.');
  //     return
  //   }
  //   this.fieldName = field;
  //   if (!this.isNotValid(this.purchaseForm.value[field])) {
  //     for(let i in this.attentions) {
  //       if (this.attentions[i].id == this.purchaseForm.value[field]) {
  //         this.attentionName = this.attentions[i].name;
  //         this.showAddAttentionModal = true;
  //       }
  //     }
  //   } else {
  //     this.attentionName = '';
  //     this.showAddAttentionModal = true;
  //   }
  // }

  // saveAttention() {
  //   if (!this.attentionName) {
  //     this.toastr.error('ERROR', 'Please enter person name.');
  //     return;
  //   }
  //   if (!this.isNotValid(this.purchaseForm.value[this.fieldName])) {
  //     this.loader.start();
  //     this.apiService.updateLookup({id:this.purchaseForm.value[this.fieldName], name: this.attentionName, lookup_type: 'Contacts', parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
  //       this.loader.stop();
  //       if (data && data['status'] == 1) {
  //         for(let i in this.attentions) {
  //           if (this.attentions[i].id == this.purchaseForm.value[this.fieldName]) {
  //             this.attentions[i].name = data['data'].name;
  //           }
  //         }
  //         this.showAddAttentionModal = false;
  //       }
  //       if (data['status'] == 0) {
  //         for(var r in data['data']) {
  //           this.toastr.error('Error', data['data'][r]);    
  //         }
  //       }
  //     })
  //   } else {
  //     this.loader.start();
  //     this.apiService.saveLookup({name: this.attentionName, lookup_type: 'Contacts', parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
  //       this.loader.stop();
  //       if (data && data['status'] == 1) {
  //         this.attentions.push(data['data']);
  //         this.purchaseForm.controls[this.fieldName].setValue(data['data'].id);
  //         this.showAddAttentionModal = false;
  //       }
  //       if (data['status'] == 0) {
  //         for(var r in data['data']) {
  //           this.toastr.error('Error', data['data'][r]);    
  //         }
  //       }
  //     });
  //   }
  // }

  setType(type: string) {
    this.purchaseForm.reset();
    this.quotaionMode = type;
    this.createMode = true;
    this.editMode = false;
    this.showAlert = false;
  }

  viewAddItemModal() {
    this.showAddItemModal = true;
  }

  addRow(type: string) {
    this.showAddItemModal = false;
  }

  changeClient() {
    if (this.createMode) {
      this.loader.start();
      this.stringAddress = '';
      this.shipAddress = '';
      this.billAddress = '';
      this.purchaseForm.controls.address_line_one.setValue(null);
      this.purchaseForm.controls.address_line_two.setValue(null);
      this.purchaseForm.controls.pincode.setValue(null);
      this.purchaseForm.controls.area_id.setValue(null);
      this.purchaseForm.controls.ship_address_line_one.setValue(null);
      this.purchaseForm.controls.ship_address_line_two.setValue(null);
      this.purchaseForm.controls.ship_pincode.setValue(null);
      this.purchaseForm.controls.ship_area_id.setValue(null);
      this.purchaseForm.controls.bill_address_line_one.setValue(null);
      this.purchaseForm.controls.bill_address_line_two.setValue(null);
      this.purchaseForm.controls.bill_pincode.setValue(null);
      this.purchaseForm.controls.bill_area_id.setValue(null);
      this.isLoadedAddress = false;
      this.clients.forEach((item) => {
        if (item.id == this.purchaseForm.value.client_id) {

          let newAddress : any[] = [];
          if (item.address_line_one) {
            newAddress.push(item.address_line_one);
          }
          if (item.address_line_two) {
            newAddress.push(item.address_line_two);
          }
          if (item.city_name) {
            let ct = item.city_name;
            if (item.pincode) {
              ct += '-' + item.pincode;
            }
            newAddress.push(ct);
          }
          if (item.state_name) {
            newAddress.push(item.state_name);
          }
          if (item.country_name) {
            newAddress.push(item.country_name);
          }
          this.stringAddress = newAddress.join(', ');

          this.purchaseForm.controls.address_line_one.setValue(item.address_line_one);
          this.purchaseForm.controls.address_line_two.setValue(item.address_line_two);
          this.purchaseForm.controls.pincode.setValue(item.pincode);
          this.purchaseForm.controls.area_id.setValue(item.area_id);

          this.purchaseForm.controls.ship_address_line_one.setValue(item.address_line_one);
          this.purchaseForm.controls.ship_address_line_two.setValue(item.address_line_two);
          this.purchaseForm.controls.ship_pincode.setValue(item.pincode);
          this.purchaseForm.controls.ship_area_id.setValue(item.area_id);

          this.purchaseForm.controls.bill_address_line_one.setValue(item.address_line_one);
          this.purchaseForm.controls.bill_address_line_two.setValue(item.address_line_two);
          this.purchaseForm.controls.bill_pincode.setValue(item.pincode);
          this.purchaseForm.controls.bill_area_id.setValue(item.area_id);

          this.gst_no = item.gst_no;
          this.pan_no = item.pan_no;
        }
      });
      setTimeout(() => {
        this.isLoadedAddress = true;
        this.loader.stop();
      },300);
    }

    if (this.editMode) {
      this.getPreSalesDemand();
    }
  }

  getPreSalesDemand() {
    if (this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getPreSalesDemand({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demands = data['data'];
        }
      });
    }
  }

  getPreSalesDemandNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getPreSalesDemandNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.pre_sale_demand_no.setValue(data['data']);
        }
      });
    } else {
      this.purchaseForm.controls.pre_sale_demand_no.setValue(null);
    }
  }

  getAllAddress() {
    this.apiService.getAllAddress({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.dropdowns = data['data'];
        this.isLoadedAddress = true;
      }
    });
  }

  getAddress(address: any) {
    this.purchaseForm.controls.address_line_one.setValue(address.address_line_one);
    this.purchaseForm.controls.address_line_two.setValue(address.address_line_two);
    this.purchaseForm.controls.pincode.setValue(address.pincode);
    this.purchaseForm.controls.area_id.setValue(address.area_id);
  }

  getBillingAddress(address: any) {
    this.purchaseForm.controls.bill_address_line_one.setValue(address.address_line_one);
    this.purchaseForm.controls.bill_address_line_two.setValue(address.address_line_two);
    this.purchaseForm.controls.bill_pincode.setValue(address.pincode);
    this.purchaseForm.controls.bill_area_id.setValue(address.area_id);
  }
  getShipingAddress(address: any) {
    this.purchaseForm.controls.ship_address_line_one.setValue(address.address_line_one);
    this.purchaseForm.controls.ship_address_line_two.setValue(address.address_line_two);
    this.purchaseForm.controls.ship_pincode.setValue(address.pincode);
    this.purchaseForm.controls.ship_area_id.setValue(address.area_id);
  }

  getExecutiveName() {
    let found = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.sales_executive_id) });
    if (found.length) {
      return found[0].first_name +' '+ found[0].father_name +' '+ found[0].last_name;
    } else {
      return "";
    }
  }

  changeBankMode() {
    if (this.purchaseForm.value.advance_mode == 'CASH') {
      this.purchaseForm.controls.advance_cheque_no.disable();
      this.purchaseForm.controls.bank_name.disable();
    } else {
      this.purchaseForm.controls.advance_cheque_no.enable();
      this.purchaseForm.controls.bank_name.enable();
    }
  }

  loadPaymentCond() {
    if (this.purchaseForm.value.quotation_id) {
      this.payemntCondtionModal = true;
      setTimeout(() => {
        $( "#advance_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.advance_date.setValue(date);
          this.purchaseForm.controls.t_advance_date.setValue(e.format());
        });
        $('#advance_date').mask('00/00/0000');
      }, 500);
    }
  } 

  changePercent(field: string, value: string) {
    if (!this.isNotValid(this.purchaseForm.value[field])) {
      let itp = (Number(this.quots.native_amount) * Number(this.purchaseForm.value[field])) / 100;
      itp = Math.round(itp * 100) / 100;
      this.purchaseForm.controls[value].setValue(itp);
    }
  }

  calcFinal() {
    let bpc = 0;
    if (!this.isNotValid(this.purchaseForm.value.balance_percent)) {
      bpc = Number(this.purchaseForm.value.balance_percent);
    }
    this.purchaseForm.controls.final_percent.setValue((100 - bpc));
    this.changePercent('final_percent', 'final_payment');
  }

  saveConditions() {
    let bpc = 0;
    let fpc = Number(this.purchaseForm.value.final_percent);
    if (!this.isNotValid(this.purchaseForm.value.balance_percent)) {
      bpc = Number(this.purchaseForm.value.balance_percent);
    }
    if ((bpc + fpc) != 100) {
      this.toastr.error('ERROR', 'Percent You Entered that May be Not Equal to Total Percent.');
      return;
    }

    this.purchaseForm.controls.payment_condition.setValue(true);
    this.payemntCondtionModal = false;
  }

  closeCond() {
    this.payemntCondtionModal = false;
  }

  resetCond() {
    $('#advance_date').val('');
    this.purchaseForm.controls.payment_condition.setValue(null);
    this.purchaseForm.controls.special_percent.setValue(null);
    this.purchaseForm.controls.special_day.setValue(null);
    this.purchaseForm.controls.special_condition.setValue(null);
    this.purchaseForm.controls.special_payment.setValue(null);
    this.purchaseForm.controls.advance_amount.setValue(null);
    this.purchaseForm.controls.advance_mode.setValue(null);
    this.purchaseForm.controls.advance_cheque_no.setValue(null);
    this.purchaseForm.controls.bank_name.setValue(null);
    this.purchaseForm.controls.advance_date.setValue(null);
    this.purchaseForm.controls.t_advance_date.setValue(null);
    this.purchaseForm.controls.balance_percent.setValue(null);
    this.purchaseForm.controls.balance_day.setValue(null);
    this.purchaseForm.controls.balance_payment.setValue(null);
    this.purchaseForm.controls.final_percent.setValue(null);
    this.purchaseForm.controls.final_day.setValue(null);
    this.purchaseForm.controls.final_payment.setValue(null);
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
