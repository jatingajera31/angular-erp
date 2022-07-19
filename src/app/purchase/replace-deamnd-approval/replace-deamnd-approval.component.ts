import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-replace-deamnd-approval',
  templateUrl: './replace-deamnd-approval.component.html',
  styleUrls: ['./replace-deamnd-approval.component.css']
})
export class ReplaceDeamndApprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  showAddItemModal = false;
  verifyLoginModal = false;
  disApproveMode = false;
  isReceived = false;
  staffs : any[] = [];
  suppliers : any[] = [];
  purchaseDetails : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  ExchangeDemands : any[] = [];
  ReplaceDemands : any[] = [];
  contactPersons : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  productImage = './assets/images/product.jpg';
  loginUser:any;
  myPassword:any;
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
      t_status_date: new FormControl(null),
      status_date: new FormControl(null, Validators.required),
      status_time: new FormControl(null, Validators.required),
      status_by: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });
    this.getStaff();
    this.getMe();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#status_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.status_date.setValue(date);
      });
      $('#status_date').mask('00/00/0000');
      $('#status_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.status_time.setValue(this.getTimes(time));
        }
      });
    }, 1000);
  }

  getMe() {
    this.apiService.me().subscribe(data => {
      if (data) {
        this.loginUser = data;
      }
    });
  }

  setDefaultTime() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.status_date.setValue(date);
    this.purchaseForm.controls.t_status_date.setValue(new Date());
    $("#status_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.status_time.setValue(tims);
  }

  verifyPassword() {
    this.verifyLoginModal = true;
  }

  savePassword(status: boolean, main: any) {
    if (!status) {
      this.verifyLoginModal = false;
      // this.purchaseForm.controls.status.setValue(null);
      return
    } else {
      this.loader.start();
      this.apiService.verifyPassword({password: this.myPassword}).subscribe(data => {
        this.loader.stop();
        if (data.status == 1) {
          this.purchaseForm.controls.status.setValue(main);
          this.purchaseForm.controls.status_by.setValue(this.loginUser.id);
          this.setDefaultTime();
          this.verifyLoginModal = false;    
        } else {
          this.toastr.error('ERROR', 'Invalid Password.');
        }
        this.myPassword = null;
      });
    }
  }

  changeSource() {
    if (this.purchaseForm.value.source_demand == 'Stock') {
      this.purchaseForm.controls.ref_repair.disable();
      this.purchaseForm.controls.sales_exchage_id.disable();
      this.purchaseForm.controls.sales_exchage_id.clearValidators();
    } else {
      this.purchaseForm.controls.ref_repair.enable();
      this.purchaseForm.controls.sales_exchage_id.enable();
      this.purchaseForm.controls.sales_exchage_id.setValidators([Validators.required]);
    }
    this.purchaseForm.controls.sales_exchage_id.updateValueAndValidity();
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
      this.apiService.getReplaceDemand({supplier_id: this.clientId, status: (this.disApproveMode) ? 'Approved' : 'Pending'}).subscribe(data => {
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

  getEditSuppliers() {
    this.loader.start();
    this.apiService.editSuppliers({page: 'rpd', replace_approval: 1, status: (this.disApproveMode) ? 'Approved' : 'Pending'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
      this.loader.stop();
    });
  }

  getReplaceDemandNo() {
    if (this.purchaseForm.value.supplier_id && this.createMode) {
      this.loader.start();
      this.apiService.getReplaceDemandNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.replace_no.setValue(this.demandNo);
        }
        this.loader.stop();
      });
    }
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
    this.disApproveMode = false;
    this.isReceived = false;
    this.purchaseForm.reset();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.suppliers = [];
    this.ReplaceDemands = [];
    this.showEditModal = true;
    this.createMode = false;
    this.disApproveMode = false;
    this.isReceived = false;
    this.getEditSuppliers();
  }

  viewDisMode() {
    this.purchaseForm.reset();
    this.suppliers = [];
    this.ReplaceDemands = [];
    this.showEditModal = true;
    this.createMode = false;
    this.disApproveMode = true;
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

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please confirm Demand.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.ReplaceDemandApproved(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          if (this.disApproveMode) {
            this.toastr.success('SUCCESS', 'Replace Demand disapproved successfully.');
          } else {
            this.toastr.success('SUCCESS', 'Replace Demand approved successfully.');
          }
          
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
          this.isReceived = false;
          if (data['data']['replacereceived'] || data['data']['replacereturn']) {
            this.isReceived = true;
          }
          this.getExchangeDemand();
          this.changeSource();
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