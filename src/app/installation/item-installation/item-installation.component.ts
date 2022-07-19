import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-item-installation',
  templateUrl: './item-installation.component.html',
  styleUrls: ['./item-installation.component.css']
})
export class ItemInstallationComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  staffs : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  commissioning : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      project_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      claim_no: new FormControl(null, [Validators.required]),
      claim_date: new FormControl(null, [Validators.required]),
      t_claim_date: new FormControl(null),
      claim_time: new FormControl(null, [Validators.required]),
      claimed_by: new FormControl(null, [Validators.pattern("^[0-9]*$")])
    });
    this.getProductGroup();
    // this.getYieldProduct();
    this.getStaff();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#claim_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.claim_date.setValue(date);
      });
      $("#claim_date").mask('00/00/0000');
      $('#claim_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.claim_time.setValue(this.getTimes(time));
        }
      });
    }, 1000);
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

  getYieldProduct() {
    this.products = [];
    if (!this.isNotValid(this.purchaseForm.value.client_id) && !this.isNotValid(this.purchaseForm.value.location_id)) {
      this.apiService.getYieldProduct({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (data['data']) {
            data['data'].forEach((item: any) => {
              this.products.push({
                model_no: item.product.model_no,
                category_name: item.product.category.name,
                supplied: item.qty,
                installed: 0,
                pending: item.qty,
                installed_by_date: null,
                supporting_engineer: null,
                today_installed: 0
              });
            });
          }
        }
      });
    }
  }

  checkQty() {
    for (var r in this.products) {
      if (Number(this.products[r].today_installed) > Number(this.products[r].pending)) {
        this.toastr.error('Gentlemen!', 'You can not install qnty more than total supplied or pending to install qnty. please check.');
        break;
        return;
      }
    };
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
    this.apiService.editClients({page: 'ppc'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getItemInstallationNo() {
    if (!this.isNotValid(this.purchaseForm.value.client_id) && this.createMode) {
      this.loader.start();
      this.apiService.getItemInstallationNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.claim_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }

    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      this.purchaseForm.controls.claim_no.setValue(null);
    }
  }

  showItemInstallation() {
    if (!this.isNotValid(this.purchaseForm.value.id)) {
      this.loader.start();
      this.apiService.showItemInstallation({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.patchValue(data['data'])
          if (data['data']['claim_date']) {
            $("#claim_date").datepicker('setDate', new Date(data['data']['claim_date']))
          }
        }
        this.loader.stop();
      });
    }
  }

  getItemInstallation() {
    if (!this.isNotValid(this.purchaseForm.value.client_id)) {
      this.loader.start();
      this.apiService.getItemInstallation({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.commissioning = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getLocation() {
    this.apiService.getLocation({parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getProject() {
    if (this.isNotValid(this.purchaseForm.value.location_id)) {
      return;
    }
    this.apiService.getProject({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
    if (this.editMode) {
      this.getItemInstallation();
    }
  }

  resetForm() {
    if (this.editMode && !this.isNotValid(this.purchaseForm.value.id)) {
      this.showItemInstallation();
    } else {
      this.purchaseForm.reset();
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.purchaseForm.controls.claim_date.setValue(date);
      this.purchaseForm.controls.t_claim_date.setValue(new Date());
      $("#claim_date").datepicker('setDate', new Date())
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productGroups.forEach((grps: any) => {
        grps.checked = false;
    });
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.claim_date.setValue(date);
    this.purchaseForm.controls.t_claim_date.setValue(new Date());
    $("#claim_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.claim_time.setValue(tims);
    this.getClients();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.createMode = false;
    this.editMode = true;
    this.getEditClients();
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
      this.apiService.updateItemInstallation(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item Installation details update successfully.');
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
      this.apiService.saveItemInstallation(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item Installation details saved successfully.');
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
      this.toastr.error('ERROR', 'Please Select Item Installation.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Item Installation.');
    } else {
      this.loader.start();
      this.apiService.deleteItemInstallation({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Item Installation deleted successfully.'); 
        }
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
