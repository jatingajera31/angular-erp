import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-item-lost-approval',
  templateUrl: './item-lost-approval.component.html',
  styleUrls: ['./item-lost-approval.component.css']
})
export class ItemLostApprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showAddItemModal = false;
  verifyLoginModal = false;
  isFocus = false;
  suppliers : any[] = [];
  itemLosts : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  products : any[] = [];
  demandNo: any = null;
  clientId: any = null;
  demandId: any = null;
  selectedProductId:any;
  prdObj = {
    qr_code: null,
    group_id: null,
    product_id: null,
    category: null,
    qty: 0,
    remarks: null
  }
  loginUser:any;
  myPassword:any;
  totalAmount = 0;
  taxTotalAmount = 0;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      prepared_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      connected_with: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      challan_no: new FormControl(null, [Validators.required]),
      challan_date: new FormControl(null, [Validators.required]),
      challan_time: new FormControl(null, [Validators.required]),
      status_date: new FormControl(null, Validators.required),
      status_time: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      status_by: new FormControl(null),
      remarks: new FormControl(null),
      approved_remarks: new FormControl(null),
      noticed_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
    });
    this.getStaff();
    this.getMe();
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
      $( "#challan_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.challan_date.setValue(date);
      });
      $("#challan_date").mask('00/00/0000');
    }, 1000);
  }

  viewProductDetailModal(prod: any, i: any) {
    this.selectedProductId = prod.product_id;
  }

  getMe() {
    this.apiService.me().subscribe(data => {
      if (data) {
        this.loginUser = data;
      }
    });
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getItemLost() {
    let status = (this.editMode) ? 'Approved': 'Pending';
    this.apiService.getItemLost({status: status}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.itemLosts = data['data'];
      }
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

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getClients() {
    this.apiService.getClients({lost:1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }
  getEditClients() {
    this.apiService.editClients({page: 'lost'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  resetForm() {
    if (this.editMode && this.isNotValid(this.purchaseForm.value.id)) {
      this.showData();
    } else {
      this.purchaseForm.reset();
      this.productDetails = [];  
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
    this.getItemLost();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    this.getItemLost();
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
      this.apiService.ItemLostApproved(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', (params.status == 'Pending') ? 'Item Disapproved Successfully' : 'Item Approved Successfully' );
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
      this.toastr.error('ERROR', 'Please Select Demo Demand.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Demo Demand.');
    } else {
      this.loader.start();
      this.apiService.deleteItemLost({id: this.purchaseForm.value.id}).subscribe(data => {
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
    if (this.purchaseForm.value.id) {
      this.loader.start();
      this.apiService.showItemLost({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.productDetails.forEach((item, key) => {
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
            item.category_name = item.product.category.name;
            item.gst_rate = item.product.gst_rate;
          })
          this.calc();
          if (data['data']['challan_date']) {
            $("#challan_date").datepicker("setDate", new Date(data['data']['challan_date']));
          }
          if (this.createMode) {
            const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.purchaseForm.controls.status_date.setValue(date);
            let tims = this.getTimes(new Date());
            this.purchaseForm.controls.status_time.setValue(tims);
          }
        }
        this.loader.stop();
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
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

  calc() {
    this.totalAmount = 0;
    this.taxTotalAmount = 0;
    this.productDetails.forEach((item, key) => {
      this.totalAmount += parseFloat(item.purchase_rate);
      this.taxTotalAmount += parseFloat(item.gst_amount);
    })
  }

}