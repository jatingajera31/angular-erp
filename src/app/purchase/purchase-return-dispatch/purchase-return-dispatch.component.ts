import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-purchase-return-dispatch',
  templateUrl: './purchase-return-dispatch.component.html',
  styleUrls: ['./purchase-return-dispatch.component.css']
})
export class PurchaseReturnDispatchComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  showEditModal = false;
  showAddModal = false;
  supplierId: any = null;
  purchaseId: any = null;
  staffs : any[] = [];
  suppliers : any[] = [];
  purchases : any[] = [];
  purchaseDispatch : any[] = [];
  purchaseDetails : any[] = [];
  deliveredBy : any[] = [];
  PurchaseDispatchId : any = null;
  SupplierName:any = null;
  PurchaseReturnId:any = null;
  PurchaseReturnDate:any = null;
  PurchaseReturnTime:any = null;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_return_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_dispatch_no: new FormControl(null, Validators.required),
      remarks: new FormControl(null),
      dispatch_date: new FormControl(null),
      dispatch_time: new FormControl(null),
      dispatched_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      docket_no: new FormControl(null, Validators.required),
      dispatch_mode: new FormControl(null, Validators.required),
      store_out_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      docket_date: new FormControl(null, Validators.required),
      t_docket_date: new FormControl(null),
      no_of_box: new FormControl(null, Validators.required),
      basic_amount: new FormControl(null),
      gst_amount: new FormControl(null),
      final_amount: new FormControl(null),
    });

    this.getStaff();
    this.getDeliveredBy();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#docket_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.docket_date.setValue(date);
      });
      $('#docket_date').mask('00/00/0000');
    },1000)
  }

  getSupplier() {
    this.apiService.editSuppliers({page: 'pretn', return_dispatch: true}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getPurchaseReturn() {
    this.apiService.getPurchaseReturn({supplier_id: this.supplierId}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchases = data['data'];
      }
    });
  }

  getPurchaseReturnDispatch() {
    if (this.isNotValid(this.supplierId)) {
      this.purchaseDispatch = [];
    } else {
      this.apiService.getPurchaseReturnDispatch({supplier_id:this.supplierId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseDispatch = data['data'];
        }
      });
    }
  }

  showPurchaseReturnDispatch() {
    this.loader.start();
    this.apiService.showPurchaseReturnDispatch({id: this.PurchaseDispatchId}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchaseForm.patchValue(data['data']);
        if (data['data']['docket_date']) {
          this.purchaseForm.controls.t_docket_date.setValue(new Date(data['data']['docket_date']));
          $("#docket_date").datepicker('setDate', new Date(data['data']['docket_date']))
        }
        this.PurchaseDispatchId = null;
        this.showPurchaseReturn();
      }
      this.loader.stop();
    });
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getDeliveredBy() {
    this.apiService.getTransport({}).subscribe(data => {
        this.deliveredBy = data['data'];
    });
  }

  showRdData() {
    if (!this.isNotValid(this.purchaseId)) {
      this.purchaseForm.controls.purchase_return_id.setValue(this.purchaseId);
      this.createMode = true;
      this.showAddModal = false;
      this.purchaseId = null;
      this.supplierId = null;
      let d = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      this.purchaseForm.controls.dispatch_date.setValue(d);
      let tims = this.getTimes(new Date());
      this.purchaseForm.controls.dispatch_time.setValue(tims);
      this.showPurchaseReturn();
    }
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getPurchaseReturnDispatchNo() {
    if (!this.editMode) {
      this.apiService.getPurchaseReturnDispatchNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.purchase_dispatch_no.setValue(data['data']);
        } else {
          this.purchaseForm.controls.purchase_dispatch_no.setValue(null);
        }
      });
    }
  }

  showPurchaseReturn() {
    if (this.purchaseForm.value.purchase_return_id) {
      this.loader.start();
      this.apiService.showPurchaseReturn({id: this.purchaseForm.value.purchase_return_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.supplier_id.setValue(data['data']['supplier_id']);
          this.purchaseForm.controls.remarks.setValue(data['data']['remarks']);
          this.purchaseForm.controls.basic_amount.setValue(data['data']['basic_amount']);
          this.purchaseForm.controls.gst_amount.setValue(data['data']['gst_amount']);
          this.purchaseForm.controls.final_amount.setValue(data['data']['final_amount']);
          this.purchaseDetails = data['data']['details'];
          this.purchaseDetails.forEach((item) => {
              let sw = 'Not Applicable';
              let hsn = '';
              let product_code = '';
              if (item.prmodel.supplier_warranty > 0) {
                sw = item.prmodel.supplier_warranty + ' Months';
              }
              if (item.prmodel.hsn_code) {
                hsn = item.prmodel.hsn_code;
              }
              if (item.prmodel.product_code) {
                product_code = item.prmodel.product_code;
              }
              item.description = item.prmodel.category_name;
              // item.description = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
              item.tdescription = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
          });
          this.getPurchaseReturnDispatchNo();
          setTimeout(() => {
            $('.purchase-return-dispatch-cn td[data-toggle="tooltip"]').tooltip({html: true})
          }, 1500);

          this.suppliers.forEach((row) => {
            if (row.id == this.purchaseForm.value.supplier_id) {
              this.SupplierName = row.name;
            }
          });
          this.purchases.forEach((row) => {
            if (row.id == this.purchaseForm.value.purchase_return_id) {
              this.PurchaseReturnId = row.purchase_return_no;
              this.PurchaseReturnDate = row.return_date;
              this.PurchaseReturnTime = row.return_time;
            }
          });
        }
        this.loader.stop();
      })
    } else {
      this.purchaseForm.controls.supplier_id.setValue(null);
      this.purchaseForm.controls.remarks.setValue(null);
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

  resetForm() {
    this.purchaseDetails = [];
    if (this.editMode && this.purchaseForm.value.id) {
      this.PurchaseDispatchId = this.purchaseForm.value.id;
      this.showPurchaseReturnDispatch();
    }
    this.purchaseForm.reset();
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseDetails = [];
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    this.purchaseForm.reset();
    this.showAddModal = true;
    this.getSupplier();
    // this.createMode = true;
    // this.editMode = false;
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.apiService.editSuppliers({page: 'purchrtndis'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
    this.showEditModal = true;
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
      this.apiService.updatePurchaseReturnDispatch(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase return dispatch details update successfully.');
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
      this.apiService.savePurchaseReturnDispatch(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase return dispatch details saved successfully.');
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
      this.toastr.error('ERROR', 'Please Select Purchase Dispatch.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Dispatch.');
    } else {
      this.loader.start();
      this.apiService.deletePurchaseReturnDispatch({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase Dispatch deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    if (this.PurchaseDispatchId) {
      this.createMode = false;
      this.editMode = true;
      this.showEditModal = false;
      this.showPurchaseReturnDispatch();
    }
  }

  viewAddItemModal() {
    this.showAddItemModal = true;
  }

  addItem() {
    this.showAddItemModal = false;
  }

  clearItem() {
    this.showAddItemModal = false;
  }

  calculate() {

  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
