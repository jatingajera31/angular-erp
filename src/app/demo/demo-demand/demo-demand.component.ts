import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-demo-demand',
  templateUrl: './demo-demand.component.html',
  styleUrls: ['./demo-demand.component.css']
})
export class DemoDemandComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  isFocus = false;
  showNotificationModal = false;
  productName: any;
  suppliers : any[] = [];
  staffs : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  clients : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  demoDemands : any[] = [];
  demandNo: any;
  clientId: any = null;
  demandId: any = null;
  selectedProductIndex:any;
  selectedModal:any;
  loginId:any = null;
  productImage = './assets/images/product.jpg';
  stock = 0;
  MessageText: string = '';
  MessageTitle: string = '';
  ActionType: string = '';
  SaveBtn: string = '';
  CancelBtn: string = '';
  isCancel = false;
  isApproved = false;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.getStaff();
    this.getProductGroup();
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      demo_no: new FormControl(null, Validators.required),
      project_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      demand_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      executive_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      demo_date: new FormControl(null, Validators.required),
      t_demo_date: new FormControl(null),
      demo_time: new FormControl(null, Validators.required),
      demo_days: new FormControl(null, Validators.required),
      demo_return_date: new FormControl(null, Validators.required),
      remarks: new FormControl(null),
      status: new FormControl(null),
    });
    this.loginId = localStorage.getItem('token_id');
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
    setTimeout(() => {
      $( "#demo_return_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.demo_return_date.setValue(date);
      });
      $("#demo_return_date").mask('00/00/0000');
    }, 1000);
  }

  exposeDemand() {
    this.MessageText = 'Are you sure to expose this Demand?'; 
    this.MessageTitle = 'Expose Demand'; 
    this.ActionType = 'ExposeDemand'; 
    this.SaveBtn = 'Yes'; 
    this.CancelBtn = 'No';
  }

  cancelDemand() {
    this.MessageText = 'Are you sure to conceal this Demand?'; 
    this.MessageTitle = 'Conceal Demand'; 
    this.ActionType = 'ConcealDemand'; 
    this.SaveBtn = 'Yes'; 
    this.CancelBtn = 'No'; 
  }

  confirmedAction(event:any) {
    this.MessageText = '';
    this.MessageTitle = '';
    if (event.status) {
      if (event.type == 'ConcealDemand') {
       this.cancelData(1);
      }
      if (event.type == 'ExposeDemand') {
       this.cancelData(0);
      }
    }
  }

  cancelData(cancel: number) {
    this.apiService.demoDemandCancel({id: this.purchaseForm.value.id , is_cancel: cancel}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.isCancel = (cancel == 1);
      }
    });
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getDemoDemand() {
    if (this.clientId) {
      this.apiService.getDemoDemand({client_id: this.clientId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demoDemands = data['data'];
        }
      });
    }
  }

  getProject() {
    this.apiService.getProject({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
  }

  getDemandBy() {
    if (this.purchaseForm.value.demand_by) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.demand_by) });
      if (row.length) {
        return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
      }
      return ""
    } else {
      return ""
    }
  }

  getExecutiveName() {
    if (this.purchaseForm.value.executive_id) {
      let row = this.staffs.filter((item) => { return (item.id == this.purchaseForm.value.executive_id) });
      if (row.length) {
        return row[0].first_name + ' ' + row[0].father_name + ' ' + row[0].last_name;
      }
      return ""
    } else {
      return ""
    }
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getModels(group_id: any, index: any, product_id: any) {
    if (group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.productDetails[index].products = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  changeModel(product_id: any, index: any) {
    if (product_id) {
      this.stock = 0;
      this.apiService.showProduct({id: product_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (data['stock'] > 0) {
            this.stock = data['stock'];
            this.productDetails[index].description = data['data'].description;
          } else {
            this.showNotificationModal = true;
            this.productName = data['data']['model_no'];
            this.productDetails[index].product_id = null;
          }
        }
      });
    }
  }

  changeQty(qty: any, index: any) {
    if (Number(qty) > Number(this.stock)) {
      this.showNotificationModal = true;
      let r = this.productDetails[index].products.filter((itm:any) => { return (itm.id == this.productDetails[index].product_id) });
      if (r.length) {
        this.productName = r[0].model_no;
        this.productDetails[index].qty = null;
      }
    }
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
      description: null,
      qty: null,
      products: []
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

  getLocation() {
    this.apiService.getLocation({parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
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
    this.apiService.getClients({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }
  getEditClients() {
    this.apiService.editClients({page: 'dd'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getDemoDemandNo() {
    if (this.purchaseForm.value.client_id && this.createMode) {
      this.loader.start();
      this.apiService.getDemoDemandNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.demandNo = data['data'];
          this.purchaseForm.controls.demo_no.setValue(this.demandNo);
        }
        this.loader.stop();
      });
    }
  }

  setReturnDate() {
    if (this.purchaseForm.value.demo_date && this.purchaseForm.value.demo_days) {
      var date = new Date();
      var demo_date = new Date(this.purchaseForm.value.demo_date);
      date.setDate(demo_date.getDate() + this.purchaseForm.value.demo_days);
      const ddate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.purchaseForm.controls.demo_return_date.setValue(ddate);
      $("#demo_return_date").datepicker('setDate', date)
    } else {
      this.purchaseForm.controls.demo_return_date.setValue(null);
    }
  }

  closeForm() {
    this.productDetails = [];
    this.createMode = false;
    this.editMode = false;
    this.isCancel = false;
    this.isApproved = false;
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    if (this.createMode) {
      return;
    }
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.purchaseForm.controls.demand_by.setValue(this.loginId);
    this.purchaseForm.controls.executive_id.setValue(this.loginId);
    this.addRow();
    this.getClients();
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.demo_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.demo_time.setValue(tims);
  }
  
  viewEditMode() {
    if (this.editMode) {
      return;
    }
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getEditClients();
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
    params.products = JSON.parse(JSON.stringify(this.productDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateDemoDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.apiService.applyNotificationCount('Demo');
          this.toastr.success('SUCCESS', 'demo demand details update successfully.');
          this.closeForm();
          this.productDetails = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveDemoDemand(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.apiService.applyNotificationCount('Demo');
          this.toastr.success('SUCCESS', 'demo demand details saved successfully.');
          this.closeForm();
          this.productDetails = [];
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
      if (this.purchaseForm.value.status == 'Approved') {
        this.toastr.error('Gentleman !', 'This demand is Approved, you can not delete !');
      } else {
        this.showDeleteModal = true;
      }
    } else {
      this.toastr.error('ERROR', 'Please Select Demo Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Demo Demand.');
    } else {
      this.loader.start();
      this.apiService.deleteDemoDemand({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Demo Demand deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    if (this.demandId) {
      this.loader.start();
      this.apiService.showDemoDemand({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          if (data['data']['is_cancel'] == 1) {
            this.isCancel = true;
          }
          if (data['data']['status'] == 'Approved') {
            this.isApproved = true;
          }
          this.showEditModal = false;
          this.productDetails.forEach((item, key) => {
            let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
            item.description = desc;
          })
          this.getLocation();
          this.getProject();
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