import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-spare-service-demand-approval',
  templateUrl: './spare-service-demand-approval.component.html',
  styleUrls: ['./spare-service-demand-approval.component.css']
})
export class SpareServiceDemandApprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  verifyLoginModal = false;
  isFocus = false;
  showProductDetailModal = false;
  showRemoveModal = false;
  showNotificationModal = false;
  suppliers : any[] = [];
  spareDemands : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  selectedProductId:any;
  loginUser:any;
  myPassword:any;
  productName:any;
  selectedProductIndex:any;
  stock = 0;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null, Validators.required),
      status_by: new FormControl(null, Validators.required),
      client: new FormControl(null),
      location: new FormControl(null),
      project: new FormControl(null),
      spare_no: new FormControl(null),
      spare_date: new FormControl(null),
      spare_time: new FormControl(null),
      remarks: new FormControl(null),
      status_date: new FormControl(null, Validators.required),
      t_status_date: new FormControl(null),
      status_time: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });
    this.getMe();
    this.getProductGroup();
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

  setDefaultTime() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.status_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.status_time.setValue(tims);
  }

  verifyPassword() {
    this.verifyLoginModal = true;
  }

  savePassword(status: boolean, main: any) {
    if (!status) {
      this.verifyLoginModal = false;
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

  getSpareDemand(status: string) {
    this.loader.start();
    this.apiService.getSpareDemand({status: status}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.spareDemands = data['data'];
      }
    });
  }

  setRow(item: any) {
    let project = (item.project) ? item.project.name: '';
    this.purchaseForm.controls.id.setValue(item.id);
    this.purchaseForm.controls.client.setValue(item.client.account_name);
    this.purchaseForm.controls.location.setValue(item.location.name);
    this.purchaseForm.controls.project.setValue(project);
    this.purchaseForm.controls.spare_no.setValue(item.spare_no);
    this.purchaseForm.controls.spare_date.setValue(item.spare_date);
    this.purchaseForm.controls.spare_time.setValue(item.spare_time);
    this.purchaseForm.controls.status.setValue(item.status);
    if (this.editMode) {
      this.purchaseForm.controls.status_by.setValue(item.status_by);
      this.purchaseForm.controls.status_date.setValue(item.status_date);
      this.purchaseForm.controls.status_time.setValue(item.status_time);
    }
    this.showSpareDemand();
  }

  showSpareDemand() {
    this.loader.start();
    this.apiService.showSpareDemand({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.productDetails = data['data']['details'];
        this.productDetails.forEach((item, key) => {
          let desc = item.product.description +'&#13;&#10;Prod. Code: '+ item.product.product_code +'&#13;&#10;Warranty: '+ item.product.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.product.hsn_code;
          item.description = desc;
        })
      }
    });
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.spareDemands = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.setDefaultTime();
    this.getSpareDemand('Pending');
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    this.getSpareDemand('Approved');
  }

  resetForm() {
    this.purchaseForm.reset();
    this.productDetails = [];
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
      this.apiService.showProduct({id: product_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (data['stock'] > 0) {
            this.productDetails[index].description = data['data'].description;
          } else {
            this.stock = data['stock'];
            this.showNotificationModal = true;
            this.productName = data['data']['model_no'];
            this.productDetails[index].product_id = null;
          }
        }
      });
    }
  }

  changeQty(qty: any, index: any) {
    if (!this.isNotValid(this.productDetails[index].product_id)) {
      this.apiService.showProduct({id: this.productDetails[index].product_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (Number(qty) > Number(data['stock'])) {
            this.stock = data['stock'];
            this.showNotificationModal = true;
            this.productName = data['data']['model_no'];
            this.productDetails[index].qty = null;
          }
        }
      });
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

  viewProductDetailModal(prod: any, i: any) {
    this.selectedProductId = prod.product_id;
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
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
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.SpareDemandApproved(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Spare Demand Approved Successfully.');
          this.closeForm();
          this.apiService.applyNotificationCount('Spare');
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
