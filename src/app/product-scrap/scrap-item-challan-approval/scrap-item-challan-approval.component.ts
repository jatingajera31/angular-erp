import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-scrap-item-challan-approval',
  templateUrl: './scrap-item-challan-approval.component.html',
  styleUrls: ['./scrap-item-challan-approval.component.css']
})
export class ScrapItemChallanApprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  verifyLoginModal = false;
  suppliers : any[] = [];
  demoDemands : any[] = [];
  productDetails : any[] = [];
  staffs : any[] = [];
  selectedRow:any;
  loginUser:any;
  myPassword:any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null, Validators.required),
      client: new FormControl(null),
      location: new FormControl(null),
      status_by: new FormControl(null, Validators.required),
      project: new FormControl(null),
      scrap_item_no: new FormControl(null),
      scrap_date: new FormControl(null),
      scrap_time: new FormControl(null),
      exchange_no: new FormControl(null),
      exchange_date: new FormControl(null),
      exchange_time: new FormControl(null),
      ref_repair: new FormControl(null),
      repair_date_time: new FormControl(null),
      checked_by: new FormControl(null),
      connect_id: new FormControl(null),
      remarks: new FormControl(null),
      status_date: new FormControl(null, Validators.required),
      t_status_date: new FormControl(null),
      status_time: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      noticed_by: new FormControl(null),
      approved_remarks: new FormControl(null),
    });
    this.getMe();
    this.getStaff();
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

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
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
      this.purchaseForm.controls.status.setValue(null);
      return
    } else {
      this.loader.start();
      this.apiService.verifyPassword({password: this.myPassword}).subscribe(data => {
        this.loader.stop();
        if (data.status == 1) {
          this.purchaseForm.controls.status.setValue(main);
          this.purchaseForm.controls.status_by.setValue(this.loginUser.id);
          this.verifyLoginModal = false;    
        } else {
          this.toastr.error('ERROR', 'Invalid Password.');
        }
        this.myPassword = null;
      });
    }
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
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

  getMe() {
    this.apiService.me().subscribe(data => {
      if (data) {
        this.loginUser = data;
      }
    });
  }

  getItemScrapChallan(status: string) {
    this.loader.start();
    this.apiService.getItemScrapChallan({status: status}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.demoDemands = data['data'];
      }
    });
  }

  setRow(item: any) {
    let project = (item.project) ? item.project.name: '';
    this.purchaseForm.controls.id.setValue(item.id);
    this.purchaseForm.controls.client.setValue(item.client.account_name);
    this.purchaseForm.controls.location.setValue(item.location.name);
    this.purchaseForm.controls.project.setValue(project);
    this.purchaseForm.controls.scrap_item_no.setValue(item.scrap_item_no);
    this.purchaseForm.controls.scrap_date.setValue(item.scrap_date);
    this.purchaseForm.controls.scrap_time.setValue(item.scrap_time);
    this.purchaseForm.controls.status.setValue(item.status);
    this.purchaseForm.controls.exchange_no.setValue(item.exchange.exchange_no);
    this.purchaseForm.controls.exchange_date.setValue(item.exchange.exchange_date);
    this.purchaseForm.controls.exchange_time.setValue(item.exchange.exchange_time);
    this.purchaseForm.controls.ref_repair.setValue(item.ref_repair);
    // this.purchaseForm.controls.repair_date_time.setValue();
    this.purchaseForm.controls.checked_by.setValue(item.checked_by);
    this.purchaseForm.controls.connect_id.setValue(item.connect_id);
    if (this.editMode) {
      this.purchaseForm.controls.noticed_by.setValue(item.noticed_by);
      this.purchaseForm.controls.status_by.setValue(item.status_by);
      this.purchaseForm.controls.status_date.setValue(item.status_date);
      this.purchaseForm.controls.status_time.setValue(item.status_time);
      this.purchaseForm.controls.approved_remarks.setValue(item.approved_remarks);
      $("#status_date").datepicker('setDate', new Date(item.status_date))
    }
    this.showItemScrapChallan();
  }

  showItemScrapChallan() {
    this.loader.start();
    this.apiService.showItemScrapChallan({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
          item.category_name = item.product.category.name;
          item.product_name = item.product.model_no;
        })
      }
    });
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.demoDemands = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.setDefaultTime();
    this.getItemScrapChallan('Pending');
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    this.getItemScrapChallan('Approved');
  }

  resetForm() {
    this.purchaseForm.reset();
    this.productDetails = [];
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
      this.apiService.ItemScrapChallanApproved(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item Scrap Request Approved Successfully.');
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
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.purchase_id.setValue(1);
    this.showEditModal = false;
  }

}

