import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-project-completion',
  templateUrl: './project-completion.component.html',
  styleUrls: ['./project-completion.component.css']
})
export class ProjectCompletionComponent implements OnInit {

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
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      project_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      commissioning_no: new FormControl(null, [Validators.required]),
      pre_date: new FormControl(null, [Validators.required]),
      t_pre_date: new FormControl(null),
      completion_date: new FormControl(null, [Validators.required]),
      t_completion_date: new FormControl(null),
      completed_by: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      reason: new FormControl(null),
    });
    this.getProductGroup();
    this.getStaff();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#pre_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.pre_date.setValue(date);
      });
      $( "#completion_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.completion_date.setValue(date);
      });
      $("#pre_date").mask('00/00/0000');
      $("#completion_date").mask('00/00/0000');
    }, 1000);
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

  getPreCommissioningNo() {
    if (!this.isNotValid(this.purchaseForm.value.client_id) && this.createMode) {
      this.loader.start();
      this.apiService.getPreCommissioningNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.commissioning_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }

    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      this.purchaseForm.controls.commissioning_no.setValue(null);
    }
  }

  showPreCommissioning() {
    if (!this.isNotValid(this.purchaseForm.value.id)) {
      this.loader.start();
      this.apiService.showPreCommissioning({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1 && data['data']) {
          this.purchaseForm.patchValue(data['data'])
          if (data['data']['pre_date']) {
            $("#pre_date").datepicker('setDate', new Date(data['data']['pre_date']))
          }
          if (data['data']['completion_date']) {
            $("#completion_date").datepicker('setDate', new Date(data['data']['completion_date']))
          }
          if (data['data']['details']) {
            data['data']['details'].forEach((item: any) => {
              this.productGroups.forEach((grps: any) => {
                if (grps.id == item.group_id) {
                  grps.checked = true;
                }
              });
            });
          }
        }
        this.loader.stop();
      });
    }
  }

  getPreCommissioning() {
    if (!this.isNotValid(this.purchaseForm.value.client_id)) {
      this.loader.start();
      this.apiService.getPreCommissioning({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
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
      this.getPreCommissioning();
    }
  }

  resetForm() {
    if (this.editMode && !this.isNotValid(this.purchaseForm.value.id)) {
      this.showPreCommissioning();
    } else {
      this.purchaseForm.reset();
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.purchaseForm.controls.pre_date.setValue(date);
      this.purchaseForm.controls.t_pre_date.setValue(new Date());
      $("#pre_date").datepicker('setDate', new Date())
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
    this.purchaseForm.controls.pre_date.setValue(date);
    this.purchaseForm.controls.t_pre_date.setValue(new Date());
    $("#pre_date").datepicker('setDate', new Date())
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
    params.groups = this.productGroups.filter((item) => { return (item.checked) });
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updatePreCommissioning(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Project Pre-Commissioning details update successfully.');
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
      this.apiService.savePreCommissioning(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Project Pre-Commissioning details saved successfully.');
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
      this.toastr.error('ERROR', 'Please Select Project Pre-Commissioning.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Project Pre-Commissioning.');
    } else {
      this.loader.start();
      this.apiService.deletePreCommissioning({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Project Pre-Commissioning deleted successfully.'); 
        }
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}

