import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-purchase-notification',
  templateUrl: './purchase-notification.component.html',
  styleUrls: ['./purchase-notification.component.css']
})
export class PurchaseNotificationComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  productGroups : any[] = [];
  productDetails : any[] = [];
  client_id:any = null;
  preSalesDemand:any = null;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      project_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      purpose: new FormControl(null, [Validators.required]),
      pre_sale_demand_id: new FormControl(null),
      pre_sale_demand_date: new FormControl(null),
    });

    this.getProductGroup();
  }

  ngOnInit(): void {
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getPreSalesDemand() {
    if (!this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getPreSalesDemand({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.preSalesDemand = data['data'];
        }
      });
    } else {
      this.preSalesDemand = [];
    }
  }

  changePreSalesDemand() {
    if (!this.isNotValid(this.purchaseForm.value.pre_sale_demand_id)) {
      this.preSalesDemand.forEach((item: any) => {
        if (item.id == this.purchaseForm.value.pre_sale_demand_id) {
          this.purchaseForm.controls.pre_sale_demand_date.setValue(item.pre_sale_date);
        }
      })
    }
  }

  getModels(prod: any, index: any, product_id: any) {
    if (prod.group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          prod.products = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  changeModel(product_id: any, prod: any, isEdited: any) {
    if (product_id) {
      for(var r in prod.products) {
        if (prod.products[r].id == product_id) {
          prod.description = prod.products[r].description;
          prod.category = prod.products[r].category.name;
        }
      }
    }
  }

  getClients() {
    this.apiService.getClients({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getEditClients() {
    this.apiService.editClients({page: 'srd'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getLocation() {
    this.loader.start();
    this.apiService.getLocation({parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
      this.loader.stop();
    });
  }

  getProject() {
    this.apiService.getProject({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
  }

  resetForm() {
    if (this.createMode || this.isNotValid(this.purchaseForm.value.id)) {
      this.purchaseForm.reset();
      this.productDetails = [];
    } else {
      if (this.purchaseForm.value.id) {
        // this.showSalesReturnDemand();
      }
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
    this.getClients();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getEditClients();
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.productDetails.length) {
      this.productDetails.forEach((item) => {
        if (this.isNotValid(item.group_id)) {
          
          this.invalidForm = true;
        }
        if (this.isNotValid(item.product_id)) {
          this.invalidForm = true;
        }
        if (this.isNotValid(item.qty)) {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid product details.');
        return;
      }
    } else {
      this.toastr.error('ERROR', 'Please enter product details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.products = this.productDetails;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateSalesReturnDemand(params).subscribe(data => {
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

    } else {
      this.loader.start();
      this.apiService.saveSalesReturnDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Sales Return Demand Saved Successfully.');
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
      this.toastr.error('ERROR', 'Please Select Sales Return Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Sales Return Demand.');
    } else {
      this.loader.start();
      this.apiService.deleteSalesReturnDemand({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Sales Return Demand deleted successfully.'); 
        }
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
