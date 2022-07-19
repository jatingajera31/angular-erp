import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-sales-return-updates',
  templateUrl: './sales-return-updates.component.html',
  styleUrls: ['./sales-return-updates.component.css']
})
export class SalesReturnUpdatesComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showAddItemModal = false;
  suppliers : any[] = [];
  staffs : any[] = [];
  accounts : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  productDetails : any[] = [];
  salesReturnReceived : any[] = [];
  sales_return_id:any = null;
  loginUser:any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null, Validators.required),
      sales_return_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      client_id: new FormControl(null),
      location_id: new FormControl(null),
      sales_executive_id: new FormControl(null),
      collected_by: new FormControl(null),
      return_by: new FormControl(null),
      remarks: new FormControl(null),
      action_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      action_date: new FormControl(null, Validators.required),
      action_time: new FormControl(null, Validators.required),
      action_detail: new FormControl(null, Validators.required),
      total_qty: new FormControl(null),
      total_amount: new FormControl(null),
      total_gst_amount: new FormControl(null)
    });

    this.getMe();
    this.getStaff();
    this.getClients();
  }

  ngOnInit(): void {
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
    this.purchaseForm.controls.action_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.action_time.setValue(tims);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  resetForm() {
    if (this.isNotValid(this.purchaseForm.value.sales_return_id) || this.createMode) {
      this.purchaseForm.reset();
      this.productDetails = [];
    } else {
      this.showSalesReturnReceived();
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getSalesReturnReceived('Received');
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getSalesReturnReceived('Approved');
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getClients() {
    this.apiService.getClients({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.accounts = data['data'];
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

  getSalesReturnReceived(status: string) {
    this.loader.start();
    this.apiService.getSalesReturnReceived({status: status}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.salesReturnReceived = data['data'];
      }
    });
  }

  showSalesReturnReceived() {
    if (this.isNotValid(this.purchaseForm.value.sales_return_id)) {
      return;
    }
    this.loader.start();
    this.apiService.showSalesReturnReceived({id: this.purchaseForm.value.sales_return_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.patchValue(data['data']);
        this.getLocation();
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item) => {
          item.product_name = item.product.model_no;
          item.description = item.product.description;
          item.serial_no = item.product.serial_no;
          item.mac_address = item.product.mac_address;
        });
        if (this.isNotValid(this.purchaseForm.value.action_by)) {
          this.purchaseForm.controls.action_by.setValue(this.loginUser.id);
          this.setDefaultTime();
        }
      }
    });
  }

  getClientName() {
    let row = this.accounts.filter((item) => { return (item.id == this.purchaseForm.value.client_id) });
    if (row.length) {
      return row[0].account_name;
    } else {
      return '';
    }
  }

  getLocationName() {
    let row = this.locations.filter((item) => { return (item.id == this.purchaseForm.value.location_id) });
    if (row.length) {
      return row[0].name;
    } else {
      return '';
    }
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.status = 'Approved';
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.approvedSalesReturnReceived(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Sales Return Demand Updated Successfully.');
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
      this.toastr.error('ERROR', 'Please Select Purchase Order.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Order.');
    } else {
      this.loader.start();
      this.apiService.deleteService({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase Order deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.sales_return_id.setValue(this.sales_return_id);
    this.showEditModal = false;
    this.showSalesReturnReceived();
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
