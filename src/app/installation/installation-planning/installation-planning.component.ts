import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-installation-planning',
  templateUrl: './installation-planning.component.html',
  styleUrls: ['./installation-planning.component.css']
})
export class InstallationPlanningComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  suppliers : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  locations : any[] = [];
  projects : any[] = [];
  building : any[] = [];
  floors : any[] = [];
  InstaPlanning : any[] = [];
  NoOFFloor: any;
  NoOFGroundFloor: any = 1;
  NoOFBasement: any;
  NoOfArea: any;
  NoOfJunction: any;
  SelectedRow: any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      location_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      project_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      planning_no: new FormControl(null, [Validators.required]),
      planning_date: new FormControl(null, [Validators.required]),
      t_planning_date: new FormControl(null),
      planning_time: new FormControl(null, [Validators.required]),
      planning_done_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      building_name: new FormControl(null, [Validators.required]),
    });
    this.getStaff();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#planning_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.planning_date.setValue(date);
      });
      $("#planning_date").mask('00/00/0000');

      $('#planning_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.planning_time.setValue(this.getTimes(time));
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
    this.apiService.editClients({page: 'ips'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getInstaPlanningNo() {
    if (!this.isNotValid(this.purchaseForm.value.client_id) && this.createMode) {
      this.loader.start();
      this.apiService.getInstaPlanningNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.planning_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }

    if (this.isNotValid(this.purchaseForm.value.client_id)) {
      this.purchaseForm.controls.planning_no.setValue(null);
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
      this.getInstaPlanning();
    }
  }

  getInstaPlanning() {
    this.loader.start();
    this.apiService.getInstaPlanning({client_id: this.purchaseForm.value.client_id, location_id: this.purchaseForm.value.location_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.InstaPlanning = data['data'];
      }
      this.loader.stop();
    });
  }

  showInstaPlanning() {
    if (!this.isNotValid(this.purchaseForm.value.id)) {
      this.loader.start();
      this.apiService.showInstaPlanning({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.patchValue(data['data']);
          this.building = data['data']['details'];
          $("#planning_date").datepicker('setDate', new Date(data['data']['planning_date']));
        }
        this.loader.stop();
      }); 
    }
  }

  addBuilding() {

    if (this.isNotValid(this.NoOFFloor)) {
      this.toastr.error('ERROR', 'Please enter No. of Floor');
      this.invalidForm = true;
      return;
    }

    if (this.isNotValid(this.NoOFGroundFloor)) {
      this.toastr.error('ERROR', 'Please enter No. of Ground Floor.');
      this.invalidForm = true;
      return;
    }

    for(var i = 1; i <= this.NoOFFloor; i++) {
      this.building.push({
        floor_id: i + 'F',
        floor_name: 'Floor-' + i,
        floors: []
      });
    }

    this.building.push({
      floor_id: 'GND',
      floor_name: 'Ground Floor',
      no_of_area: 0,
      no_of_junction: 0,
      floors: []
    });

    if (!this.isNotValid(this.NoOFBasement)) {
      for(var i = 1; i <= this.NoOFBasement; i++) {
        this.building.push({
          floor_id: i + 'B',
          floor_name: 'Basement-' + i,
          no_of_area: 0,
          no_of_junction: 0,
          floors: []
        });
      }
    }

    this.NoOFFloor = 0;
    this.NoOFGroundFloor = 1;
    this.NoOFBasement = 0;
  }

  setArea() {
    if (!this.isNotValid(this.SelectedRow.no_of_area)) {
      this.floors = [];
      for(var i = 1; i <= this.SelectedRow.no_of_area; i++) {
        this.floors.push({
          area_id: 'A' + i,
          area_name: null
        });
      }
      for(var i = 1; i <= this.SelectedRow.no_of_junction; i++) {
        this.floors.push({
          area_id: 'J' + i,
          area_name: null
        });
      }
    }
  }

  saveArea() {
    let err = false;
    for(var r in this.floors) {
      if (this.isNotValid(this.floors[r].area_id) || this.isNotValid(this.floors[r].area_name)) {
        err = true;
        this.toastr.error('Sorry Gentleman !', 'Area Name of ' + this.floors[r].area_id + ' is Pending. please complete planning.');
        break;
        return;
      }
    }

    if (err) {
      return;
    }

    this.building.forEach((item) => {
      if (item.floor_id == this.SelectedRow.floor_id) {
        item.floors = this.floors;
        item.no_of_area = this.SelectedRow.no_of_area;
        item.no_of_junction = this.SelectedRow.no_of_junction;
      }
    });
    this.showAddItemModal = false;
  }

  resetForm() {
    if (this.editMode && !this.isNotValid(this.purchaseForm.value.id)) {
      this.showInstaPlanning();
    } else {
      this.purchaseForm.reset();
      this.building = [];
      const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.purchaseForm.controls.planning_date.setValue(date);
      this.purchaseForm.controls.t_planning_date.setValue(new Date());
      $("#planning_date").datepicker('setDate', new Date())
      let tims = this.getTimes(new Date());
      this.purchaseForm.controls.planning_time.setValue(tims);
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.building = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.planning_date.setValue(date);
    this.purchaseForm.controls.t_planning_date.setValue(new Date());
    $("#planning_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.planning_time.setValue(tims);
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

    if (!this.building.length) {
      this.toastr.error('ERROR', 'Please enter building structure details.');
      return;
    }

    let err = false;
    for(var r in this.building) {
      if (this.building[r].floors.length == 0) {
        err = true;
        this.toastr.error('Sorry Gentleman !', this.building[r].floor_name + ' is Pending. please complete planning.');
        break;
        return;
      }
    }

    if (err) {
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.building = JSON.parse(JSON.stringify(this.building));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateInstaPlanning(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Planning details update successfully.');
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
      this.apiService.saveInstaPlanning(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Planning details saved successfully.');
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
      this.toastr.error('ERROR', 'Please Select Planning.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Planning.');
    } else {
      this.loader.start();
      this.apiService.deleteInstaPlanning({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Planning deleted successfully.'); 
        }
      });
    }
  }

  setPlanning(row: any) {
    this.SelectedRow = row;
    this.floors = row.floors;
    this.showAddItemModal = true;
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
