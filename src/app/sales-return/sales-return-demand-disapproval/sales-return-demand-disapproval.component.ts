import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-sales-return-demand-disapproval',
  templateUrl: './sales-return-demand-disapproval.component.html',
  styleUrls: ['./sales-return-demand-disapproval.component.css']
})
export class SalesReturnDemandDisapprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  verifyLoginModal = false;
  clients : any[] = [];
  salesReturnDemand : any[] = [];
  productDetails : any[] = [];
  selectedRow:any;
  approver:any;
  loginUser:any;
  myPassword:any;
  clientId = null;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null, Validators.required),
      status_by: new FormControl(null, Validators.required),
      client: new FormControl(null),
      location: new FormControl(null),
      project: new FormControl(null),
      sales_return_demand_no: new FormControl(null),
      sales_return_demand_date: new FormControl(null),
      sales_return_demand_time: new FormControl(null),
      remarks: new FormControl(null),
      status_date: new FormControl(null, Validators.required),
      status_time: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });
    this.getMe();
    this.getEditClients();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  getEditClients() {
    this.apiService.editClients({page: 'srd', status: 'Approved'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  setDefaultTime() {
    // const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // this.purchaseForm.controls.status_date.setValue(date);
    // let tims = this.getTimes(new Date());
    // this.purchaseForm.controls.status_time.setValue(tims);
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
          this.purchaseForm.controls.status.setValue('Pending');
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

  getSalesReturnDemand(status: string, client_id: any) {
    this.loader.start();
    this.apiService.getSalesReturnDemand({client_id: client_id, status: status}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.salesReturnDemand = data['data'];
      }
    });
  }

  setRow(item: any) {
    let project = (item.project) ? item.project.name: '';
    this.purchaseForm.controls.id.setValue(item.id);
    this.purchaseForm.controls.client.setValue(item.client.account_name);
    this.purchaseForm.controls.location.setValue(item.location.name);
    this.purchaseForm.controls.project.setValue(project);
    this.purchaseForm.controls.sales_return_demand_no.setValue(item.sales_return_demand_no);
    this.purchaseForm.controls.sales_return_demand_date.setValue(item.sales_return_demand_date);
    this.purchaseForm.controls.sales_return_demand_time.setValue(item.sales_return_demand_time);
    this.purchaseForm.controls.remarks.setValue(item.remarks);
    this.purchaseForm.controls.status.setValue(item.status);
    this.purchaseForm.controls.status_by.setValue(item.status_by);
    this.purchaseForm.controls.status_date.setValue(item.status_date);
    this.purchaseForm.controls.status_time.setValue(item.status_time);
    this.showSalesReturnDemand();
  }

  showSalesReturnDemand() {
    this.loader.start();
    this.apiService.showSalesReturnDemand({id: this.purchaseForm.value.id, approval: 1}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.approver = data['data']['approver'];
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
        })
      }
    });
  }

  getDemands() {
    this.getSalesReturnDemand('Approved', this.clientId);
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.clientId = null;
    this.approver = null;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.salesReturnDemand = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.setDefaultTime();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    // this.getSalesReturnDemand('Approved');
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
    params.status = 'Pending';
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.salesReturnApproved(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Sales Return Demand Disapproved Successfully.');
          this.closeForm();
          this.getEditClients();
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
