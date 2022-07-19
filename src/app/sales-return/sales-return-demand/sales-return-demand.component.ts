import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-sales-return-demand',
  templateUrl: './sales-return-demand.component.html',
  styleUrls: ['./sales-return-demand.component.css']
})
export class SalesReturnDemandComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  isFocus = false;
  suppliers : any[] = [];
  services : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  productGroups : any[] = [];
  salesReturnDemand : any[] = [];
  productDetails : any[] = [];
  selectedModal: any;
  selectedProductIndex:any;
  client_id:any = null;
  sales_return_demand_id:any = null;
  loginId:any = null;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      project_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      sales_return_demand_no: new FormControl(null, [Validators.required]),
      sales_return_demand_date: new FormControl(null, [Validators.required]),
      t_sales_return_demand_date: new FormControl(null),
      sales_return_demand_time: new FormControl(null, [Validators.required]),
      sales_executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      sales_return_demand_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      remarks: new FormControl(null, Validators.required),
    });

    this.loginId = localStorage.getItem('token_id');

    this.getProductGroup();
    this.getStaff();
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
  }

  ngAfterViewInit() {

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
      let params = {
        client_id: this.purchaseForm.value.client_id,
        location_id: this.purchaseForm.value.location_id,
        project_id: this.purchaseForm.value.project_id,
        group_id: prod.group_id,
        type: 'group'
      }
      this.apiService.salesReturnCheck(params).subscribe(data => {
        if (data['status'] == 1 && (data['data'] > 0)) {
          this.apiService.getProductGroupCode({group_id: prod.group_id}).subscribe(data => {
            if (data && data['status'] == 1) {
              prod.products = data['data'];
            }
            this.loader.stop();
          });
        } else {
          let d = this.clients.filter((item) => { return (item.id == this.purchaseForm.value.client_id) });
          if (d.length) {
            let clientName = d[0].account_name;
            this.toastr.warning('Product Group Alert !', 'Sorry, we have not supplied this Product Group to ' + clientName +'. Please check about it.');
          }
          this.loader.stop();
        }
      })
    }
  }

  changeModel(product_id: any, prod: any, isEdited: any) {
    if (product_id) {
      this.loader.start();
      let params = {
        client_id: this.purchaseForm.value.client_id,
        location_id: this.purchaseForm.value.location_id,
        project_id: this.purchaseForm.value.project_id,
        group_id: prod.group_id,
        product_id: prod.product_id,
        type: 'product'
      }
      this.apiService.salesReturnCheck(params).subscribe(data => {
        if (data['status'] == 1 && (data['data'] > 0)) {
          for(var r in prod.products) {
            if (prod.products[r].id == product_id) {
              prod.description = prod.products[r].description;
              prod.category = prod.products[r].category.name;
            }
          }
        } else {
          let d = this.clients.filter((item) => { return (item.id == this.purchaseForm.value.client_id) });
          if (d.length) {
            prod.product_id = null;
            let clientName = d[0].account_name;
            this.toastr.warning('Model No. Alert !', 'Sorry, we have not supplied Product of this Model to ' + clientName +'. Please check about it.');
          }
        }
        this.loader.stop();
      });
    }
  }

  changeQty(prod: any) {
    this.loader.start();
    let params = {
      client_id: this.purchaseForm.value.client_id,
      location_id: this.purchaseForm.value.location_id,
      project_id: this.purchaseForm.value.project_id,
      group_id: prod.group_id,
      product_id: prod.product_id,
      qty: prod.qty,
      type: 'qty'
    }
    this.apiService.salesReturnCheck(params).subscribe(data => {
        if (data['status'] == 1) {
          if (prod.qty > data['data']) {
            let d = this.clients.filter((item) => { return (item.id == this.purchaseForm.value.client_id) });
            if (d.length) {
              prod.qty = 0;
              let clientName = d[0].account_name;
              this.toastr.warning('Quantity Alert !', 'Sorry, we have supplied only ' + data['data'] +' nos. to ' + clientName +'. Please check quantity.');
            }
          }
        }
        this.loader.stop();
      });
  }

  addProdDetail() {
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
      if (this.isNotValid(item.qty)) {
        this.toastr.error('ERROR', 'Please enter quantity');
        item.error = true;
        errors = true;
        return
      }
    });

    if (errors) {
      return;
    }
    this.addRow();
  }

  addRow() {
    this.productDetails.push({
      id: null,
      group_id: null,
      product_id: null,
      group_name: null,
      product_name: null,
      category: null,
      description: null,
      qty: null,
      reason: null,
      show: false,
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

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
  }

  getSalesReturnDemand() {
    this.loader.start();
    this.apiService.getSalesReturnDemand({client_id: this.client_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.salesReturnDemand = data['data'];
      }
    });
  }

  showSalesReturnDemand() {
    this.loader.start();
    this.apiService.showSalesReturnDemand({id: this.purchaseForm.value.id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.getProject(data['data'], true);
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
          item.category = item.product.category.name
        })
      }
      setTimeout(() => {
        this.loader.stop();
      },300)
    });
  }

  getSalesReturnDemandNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.loader.start();
      this.apiService.getSalesReturnDemandNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.sales_return_demand_no.setValue(data['data']);
        }
      });
    } else {
      this.purchaseForm.controls.sales_return_demand_no.setValue(null);
    }
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

  getLocation(client_id: any) {
    this.apiService.getLocation({parent_id: client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getProject(pValue: any, e: boolean) {
    this.apiService.getProject({client_id: pValue['client_id'], location_id: pValue['location_id']}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
        if (e) {
          setTimeout(() => {
            this.purchaseForm.patchValue(pValue);
          }, 300)
        }
      }
    });
  }

  getLocationName() {
    if (!this.isNotValid(this.purchaseForm.value.location_id) && this.locations.length) {
      let lc = this.locations.filter((row) => { return (row.id == this.purchaseForm.value.location_id) });
      return (lc.length) ? lc[0].name: '';
    }
    return "";
  }

  getProjectName() {
    if (!this.isNotValid(this.purchaseForm.value.project_id) && this.locations.length) {
      let lc = this.projects.filter((row) => { return (row.id == this.purchaseForm.value.project_id) });
      return (lc.length) ? lc[0].name: '';
    }
    return "";
  }

  resetForm() {
    if (this.createMode || this.isNotValid(this.purchaseForm.value.id)) {
      this.purchaseForm.reset();
      this.productDetails = [];
      this.setDefaultTime();
    } else {
      if (this.purchaseForm.value.id) {
        this.showSalesReturnDemand();
      }
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.invalidForm = false;
    this.purchaseForm.reset();
    this.productDetails = [];
  }

  viewCreateMode() {
    if (this.createMode) {
      return;
    }
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.purchaseForm.controls.sales_return_demand_by.setValue(this.loginId);
    this.purchaseForm.controls.sales_executive_id.setValue(this.loginId);
    this.addRow();
    this.getClients();
  }

  getDemandBy() {
    if (this.purchaseForm.value.sales_return_demand_by) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.sales_return_demand_by) });
      if (row.length) {
        return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
      }
      return ""
    } else {
      return ""
    }
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

  setDefaultTime() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.sales_return_demand_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.sales_return_demand_time.setValue(tims);
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

  showData() {
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.id.setValue(this.sales_return_demand_id);
    this.showEditModal = false;
    this.getLocation(this.client_id);
    this.showSalesReturnDemand();
    this.client_id = null;
    this.sales_return_demand_id = null;
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