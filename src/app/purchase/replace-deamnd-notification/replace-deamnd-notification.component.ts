import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-replace-deamnd-notification',
  templateUrl: './replace-deamnd-notification.component.html',
  styleUrls: ['./replace-deamnd-notification.component.css']
})
export class ReplaceDeamndNotificationComponent implements OnInit {

  contactForm: FormGroup;
  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  viewMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  showAddItemModal = false;
  verifyLoginModal = false;
  showContactForm = false;
  invalidContactForm = false;
  staffs : any[] = [];
  suppliers : any[] = [];
  purchaseDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  ExchangeDemands : any[] = [];
  ReplaceDemands : any[] = [];
  contactPersons : any[] = [];
  departments : any[] = [];
  designations : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null),
      replace_no: new FormControl(null),
      sales_exchage_id: new FormControl(null),
      exchange_date: new FormControl(null),
      t_exchange_date: new FormControl(null),
      exchange_time: new FormControl(null),
      source_demand: new FormControl(null),
      ref_repair: new FormControl(null),
      remarks: new FormControl(null),
      connect_id: new FormControl(null),
      discuss_id: new FormControl(null),
      requested_id: new FormControl(null),
      confirmation_received: new FormControl(null),
      confirmation_date: new FormControl(null),
      confirmation_cc: new FormControl(null),
      advised_as: new FormControl(null),
      contact_no: new FormControl(null),
      email_id: new FormControl(null),
      priority: new FormControl(null),
      notification_email_copy: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      notification_contact_no: new FormControl(null, Validators.required),
      notification_email: new FormControl(null, Validators.required),
      designation: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      notification_date: new FormControl(null, Validators.required),
      t_notification_date: new FormControl(null)
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
    this.getStaff();
    this.getDesignation();
    this.getDepartment();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#notification_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.notification_date.setValue(date);
      });
      $('#notification_date').mask('00/00/0000');
    }, 1000);
  }

  setDefaultTime() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.notification_date.setValue(date);
    this.purchaseForm.controls.t_notification_date.setValue(new Date());
    $("#notification_date").datepicker('setDate', new Date())
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getExchangeDemand() {
    if (this.purchaseForm.value.source_demand == 'Serivce') {
      this.apiService.getExchangeDemand({status: 'Approved'}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ExchangeDemands = data['data'];
        }
      });
    } else {
      this.ExchangeDemands = [];
    }
  }

  getReplaceDemand() {
    if (this.clientId) {
      this.apiService.getReplaceDemand({supplier_id: this.clientId, status: 'Approved', is_notification:1, mode: (this.viewMode) ? true: false}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.ReplaceDemands = data['data'];
          this.getAccountPerson(this.clientId);
        }
      });
    } else {
      this.ReplaceDemands = [];
    }
  }

  changeDate(field: any, iField: any) {
    if (this.purchaseForm.value[field]) {
      let d = this.makeDate(this.purchaseForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.purchaseForm.controls[iField].setValue(date);
    }
  }

  changeConDate(field: any, iField: any) {
    if (this.contactForm.value[field]) {
      let d = this.makeDate(this.contactForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.contactForm.controls[iField].setValue(date);
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

  getAccountPerson(supplier_id: any) {
    if (!this.isNotValid(supplier_id)) {
      this.apiService.getAccountPerson({account_id: supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.contactPersons = data['data'];
        }
      });
    }
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
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

  getDepartment() {
    this.apiService.getDepartment({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.departments = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'rpd', replace_approval: 1, status: 'Approved', is_notification:1, mode: (this.viewMode) ? true: false}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  resetForm() {
    this.purchaseDetails = [];
    if (this.editMode) {
      this.demandId = this.purchaseForm.value.id;
      this.showData();
    } else {
      this.purchaseForm.reset();
    }
  }

  closeForm() {
    this.purchaseDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.viewMode = false;
    this.purchaseForm.reset();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.viewMode = false;
    this.getEditSuppliers();
  }
  viewNotification() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.viewMode = true;
    this.getEditSuppliers();
  }
  getDemandValue() {
    if (this.purchaseForm.value.source_demand) {
      return (this.purchaseForm.value.source_demand == 'Stock') ? 'Stock': 'Serivce Call';
    } else {
      return "";
    }
  }

  getSupplierName() {
    if (!this.isNotValid(this.purchaseForm.value.supplier_id)) {
      let row = this.suppliers.filter((item) => { return (item.id == this.purchaseForm.value.supplier_id) });
      return row[0].name;
    } else {
      return "";
    }
  }

  getSalesExName() {
    if (!this.isNotValid(this.purchaseForm.value.sales_exchage_id)) {
      let row = this.ExchangeDemands.filter((item) => { return (item.id == this.purchaseForm.value.sales_exchage_id) });
      return row[0].exchange_no;
    } else {
      return "";
    }
  }

  changeECopy() {
    let row = this.contactPersons.filter((item) => { return (item.id == this.purchaseForm.value.notification_email_copy) });
    if (row.length) {
      this.purchaseForm.controls.notification_contact_no.setValue(row[0].mobile_number);
      this.purchaseForm.controls.notification_email.setValue(row[0].email);
      this.purchaseForm.controls.designation.setValue(row[0].designation_id);
    } else {
      this.purchaseForm.controls.notification_contact_no.setValue(null);
      this.purchaseForm.controls.notification_email.setValue(null);
      this.purchaseForm.controls.designation.setValue(null);
    }
  }


  getDiscussedName() {
    if (!this.isNotValid(this.purchaseForm.value.discuss_id)) {
      let row = this.contactPersons.filter((item) => { return (item.id == this.purchaseForm.value.discuss_id) });
      if (this.isNotValid(row[0].last_name)) {
        return row[0].first_name;  
      }
      return row[0].first_name + ' ' + row[0].last_name;
    } else {
      return "";
    }
  }

  getReplacementName() {
    if (!this.isNotValid(this.purchaseForm.value.requested_id)) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.requested_id) });
      return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
    } else {
      return "";
    }
  }

  getConnName() {
    if (!this.isNotValid(this.purchaseForm.value.connect_id)) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.connect_id) });
      return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
    } else {
      return "";
    }
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
          this.contactForm.controls.account_id.setValue(this.purchaseForm.value.supplier_id);
          if (!isCont) {
            this.showContactForm = false;  
          }
          this.getAccountPerson(this.purchaseForm.value.supplier_id);
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
          this.contactForm.controls.account_id.setValue(this.purchaseForm.value.supplier_id);
          if (!isCont) {
            this.showContactForm = false;  
          }
          this.contactPersons.push(data['data']);
          this.purchaseForm.controls.notification_email_copy.setValue(data['data']['id']);
          this.changeECopy();
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
    if (!this.isNotValid(this.purchaseForm.value.supplier_id)) {
      this.contactForm.reset();
      this.contactForm.controls.account_id.setValue(this.purchaseForm.value.supplier_id);
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
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.replaceDemandSaveNotification(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Replace Demand notification save successfully.');
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

  showData() {
    if (!this.isNotValid(this.demandId)) {
      this.loader.start();
      this.apiService.showReplaceDemand({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.purchaseDetails = data['data']['details'];
          this.showEditModal = false;
          this.purchaseDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
          })
          if (data['data']['exchange_date']) {
            $("#exchange_date").datepicker("setDate", new Date(data['data']['exchange_date']));
          }
          if (data['data']['notification_date']) {
            $("#notification_date").datepicker("setDate", new Date(data['data']['notification_date']));
          }
          this.getExchangeDemand();
          if (!this.isNotValid(this.purchaseForm.value.discuss_id)) {
            let row = this.contactPersons.filter((item) => { return (item.id == this.purchaseForm.value.discuss_id) });
            this.purchaseForm.controls.notification_email_copy.setValue(row[0].id);
            this.purchaseForm.controls.notification_contact_no.setValue(row[0].mobile_number);
            this.purchaseForm.controls.notification_email.setValue(row[0].email);
            this.purchaseForm.controls.designation.setValue(row[0].designation_id);
          }
          // this.setDefaultTime();
        }
        this.loader.stop();
        this.demandId = null;
        this.clientId = null;
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}