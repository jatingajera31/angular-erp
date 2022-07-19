import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-spare-service-demand-disapproval',
  templateUrl: './spare-service-demand-disapproval.component.html',
  styleUrls: ['./spare-service-demand-disapproval.component.css']
})
export class SpareServiceDemandDisapprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  verifyLoginModal = false;
  isFocus2 = false;
  suppliers : any[] = [];
  spareDemands : any[] = [];
  productDetails : any[] = [];
  clients : any[] = [];
  selectedRow:any;
  loginUser:any;
  myPassword:any;
  statusby:any;
  selectedProductId:any;
  clientId = null;
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
  }

  @HostListener('click', ['$event'])
  mouseClick(evt: any) {
    const flyoutElement = document.getElementsByClassName('adminActions');
      let targetElement1 = evt.target;
      do {
          if (targetElement1 && targetElement1.classList && targetElement1.classList.contains('adminActionsDemannd')) {
            this.isFocus2 = true;
            return;
          }
          targetElement1 = targetElement1['parentNode'];
      } while (targetElement1);

      this.isFocus2 = false;
      this.setFalseDataD(-1);
  }

  setFalseDataD(k: number) {
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

  viewProductDetailModal(prod: any) {
    this.selectedProductId = prod.product_id;
  }

  getEditClients() {
    this.apiService.editClients({page: 'spared', status: 'Approved', disapprove: 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
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
    this.apiService.getSpareDemand({status: status, client_id: this.clientId, disapprove: 1}).subscribe(data => {
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
    this.purchaseForm.controls.status_by.setValue(item.status_by);
    this.purchaseForm.controls.status_date.setValue(item.status_date);
    this.purchaseForm.controls.status_time.setValue(item.status_time);
    this.showSpareDemand();
  }

  showSpareDemand() {
    this.loader.start();
    this.apiService.showSpareDemand({id: this.purchaseForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.productDetails = data['data']['details'];
        this.statusby = data['data']['statusby'];
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
    this.statusby = null;
    this.clientId = null;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.spareDemands = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getEditClients();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
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
      this.apiService.SpareDemandApproved(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Spare Demand Disapproved Successfully.');
          this.apiService.applyNotificationCount('Spare');
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

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}