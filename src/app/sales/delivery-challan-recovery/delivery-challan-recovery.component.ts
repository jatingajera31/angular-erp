import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-delivery-challan-recovery',
  templateUrl: './delivery-challan-recovery.component.html',
  styleUrls: ['./delivery-challan-recovery.component.css']
})
export class DeliveryChallanRecoveryComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showProductDetailModal = false;
  showAddItemModal = false;
  productImage = './assets/images/product.jpg';
  selectedModal:any;
  suppliers : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  staffs : any[] = [];
  deliveryChallans : any[] = [];
  delivered_products : any[] = [];
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required]),
      // project_id: new FormControl(null, [Validators.required]),
      delivery_challan_id: new FormControl(null, [Validators.required]),
      delivery_challan_date: new FormControl(null, [Validators.required]),
      material_accepted_by: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
      is_client_signature_done: new FormControl(null, [Validators.required]),
      materials_delivered_system: new FormControl(null, [Validators.required]),
      is_signature_done: new FormControl(null, [Validators.required]),
      supporting_engineer: new FormControl(null),
      delivery_challan_recovery_date: new FormControl(null, [Validators.required]),
      t_delivery_challan_recovery_date: new FormControl(null),
      delivery_challan_recovery_time: new FormControl(null, [Validators.required]),
      contact_no: new FormControl(null, [Validators.required]),
      material_accepted_date: new FormControl(null, [Validators.required]),
      t_material_accepted_date: new FormControl(null),
      quantities_verified: new FormControl(null),
      materials_delivered_actual: new FormControl(null, [Validators.required]),
      is_signature_done_actual: new FormControl(null, [Validators.required]),
      supporting_engineer_actual: new FormControl(null),
    });
    this.getStaff();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#material_accepted_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.material_accepted_date.setValue(date);
      });
    },1000)
  }

  intiDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.delivery_challan_recovery_date.setValue(date);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.delivery_challan_recovery_time.setValue(tims);
  }

  getLocation() {
    this.loader.start();
    this.apiService.getLocation({}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  openModel(item:any){
    this.showProductDetailModal = true;
    this.selectedModal = item
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getClients() {
    this.apiService.editClients({page: 'dc'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getEditClients() {
    this.apiService.editClients({page: 'dcr'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getDeliveryChallan() {
    if (!this.isNotValid(this.purchaseForm.value.client_id) && !this.isNotValid(this.purchaseForm.value.location_id)) {
      this.loader.start();
      let status = (this.editMode) ? 'Done': 'Pending';
      this.apiService.getDeliveryChallan({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id, status: status}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.deliveryChallans = data['data'];
        }
      });
    }
  }

  showDeliveryChallan() {
    if (this.isNotValid(this.purchaseForm.value.delivery_challan_id)) {
      return;
    }
    this.loader.start();
    this.apiService.showDeliveryChallan({id: this.purchaseForm.value.delivery_challan_id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.purchaseForm.controls.delivery_challan_date.setValue(data['data']['challan_date'])
        this.delivered_products = data['data']['details'];
      }
    });

    if (this.editMode) {
      this.apiService.getDeliveryChallanRecovery({delivery_challan_id: this.purchaseForm.value.delivery_challan_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.patchValue(data['data']);
          if (data['data']['material_accepted_date']) {
            $("#material_accepted_date").datepicker('setDate', new Date(data['data']['material_accepted_date']));
          }
        }
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

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
  }

  resetForm() {
    if (this.editMode) {
      if (this.isNotValid(this.purchaseForm.value.delivery_challan_id)) {
        this.purchaseForm.reset();
      } else {
        this.showDeliveryChallan();
      }
    } else {
      this.purchaseForm.reset();
    }
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getClients();
    this.purchaseForm.controls.is_client_signature_done.setValue('No');
    this.purchaseForm.controls.is_signature_done.setValue('No');
    this.purchaseForm.controls.is_signature_done_actual.setValue('No');
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.purchaseForm.reset();
    this.getEditClients();
  }

  formErrors(field: string) {
    return (this.invalidForm && this.purchaseForm.controls[field].invalid);
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
      this.apiService.updateDeliveryChallanRecovery(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Delivery Challan Detail Changed Successfully');
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
      this.apiService.saveDeliveryChallanRecovery(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Delivery Challan Detail Changed Successfully');
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
      this.toastr.error('ERROR', 'Please Select Delivery Challan.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Delivery Challan.');
    } else {
      this.loader.start();
      this.apiService.deleteDeliveryChallanRecovery({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Delivery Challan deleted successfully.'); 
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
